const express = require("express");
require("dotenv").config();
const router = express.Router();
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");

const {
  User,
  Department,
  Proposal,
  Course,
  CPD,
  Trainee,
  Trainer,
  Facilitator,
  trainerEvaluation,
  rating_type,
  CourseRating,
} = require("./models");
const jwt = require("jsonwebtoken");
const Sequelize = require("sequelize");
// const proposal = require("./models/proposal");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("heloo");
});

//create a new proposal, all departments can create
app.post("/addproposal", authenticateToken, async (req, res) => {
  console.log("\nadding porposal\n", req.body);
  Proposal.create({
    topic: req.body.topic,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    targetProfession: req.body.targetProfession,
    numberOfFacilitator: req.body.numberOfFacilitator,
    departmentId: req.body.departmentId,
    numberOfTrainee: req.body.numberOfTrainee,
    budget: req.body.budget,
    numberOfTrainer: req.body.numberOfTrainer,
    requestDate: req.body.requestDate,
  })
    .then((resp) => res.json(resp))
    .catch((err) => {
      console.log("Unsuccessful", err);
      res.send(false);
    });
});

//get all proposals filterd for each department
app.get("/fetchAllProposal", authenticateToken, async (req, res) => {
  if (req.user.department != null) {
    await Department.findOne({
      where: { name: req.user.department },
    }).then(async (depId) => {
      await Proposal.findAll({ where: { departmentId: depId.id } })
        .then((resp) => {
          if (resp.length > 0) {
            console.log("\n\nfetch prposals...", depId.id);
            res.json({
              resp,
              depDetail: {
                departmentId: depId.id,
                depName: req.user.department,
              },
            });
          } else {
            Department.findOne({
              where: { name: req.user.department },
            }).then((resDep) =>
              res.json({
                resp,
                depDetail: { departmentId: resDep.id, depName: resDep.name },
              })
            );
          }
        })
        .catch((err) => console.log(err));
    });
  } else {
    await CPD.findOne({
      where: { name: req.user.department },
    }).then(async (cpdId) => {
      await Proposal.findAll({ where: { cpdId: cpdId.id } })
        .then((resp) => {
          if (resp.length > 0) {
            console.log("\n\nfetch prposals...", cpdId.id);
            res.json({
              resp,
              depDetail: {
                departmentId: cpdId.id,
                depName: req.user.department,
              },
            });
          } else {
            CPD.findOne({
              where: { name: req.user.department },
            }).then((resDep) =>
              res.json({
                resp,
                depDetail: { departmentId: resDep.id, depName: resDep.name },
              })
            );
          }
        })
        .catch((err) => console.log(err));
    });
  }
  //await Proposal.findAll({ where: { departmentId: id } }).then((resp)=>res.json(resp)).catch((err)=>console.log(err));
});

//fetch proposals which are null(approved/rejected), seen only for finance and logistics
app.get("/fetchNullProposal", authenticateToken, async (req, res) => {
  const isPrivilaged = req.user.department;
  const finLog = async () => {
    if (isPrivilaged == "Finance") {
      return await Proposal.findAll({
        where: { approveBudgetStatus: null },
      });
    } else if (isPrivilaged == "Logistics") {
      return await Proposal.findAll({
        where: { venueApprovedRejectedDate: null },
      });
    }
  };

  await Department.findAll().then(async (respn) => {
    finLog()
      .then(async (proposal) => {
        const proposalWdep = proposal.map(
          (props, i) =>
            (proposal[i].dataValues.departmentName = respn.find(
              (resDep) => resDep.id == proposal[i].dataValues.departmentId
            ).name)
        );
        console.log("\n is precvilage?");
        await CPD.findAll().then((allCpds) => {
          res.json({
            nullProposal: proposal,
            department: req.user.department,
            cpd: allCpds,
          });
        });
      })
      .catch((err) => console.log("\n error?", err));
  });
});

//to approve budgets(by changing budget, assign date and status), for finance
app.post("/proposalApprove", authenticateToken, (req, res) => {
  if (req.user.department == "Finance") {
    console.log(req.body);
    Proposal.findOne({ where: { id: req.body.budget.id } }).then((approve) => {
      approve.approveBudgetStatus = true;
      approve.budget = req.body.budget.budget;
      approve.budgetApprovedRejectedDate = new Date();
      approve.save().then((acc) => {
        console.log("acce");
        createProposal(approve);
        res.json({});
      });
    });
  } else if (req.user.department == "Logistics") {
    console.log(req.body);
    Proposal.findOne({ where: { id: req.body.budget.id } }).then((approve) => {
      approve.CPDId = req.body.tType == 0 ? null : req.body.tType;
      approve.venueApprovedRejectedDate = new Date();
      approve.save().then((acc) => {
        console.log("logisti acce");
        createProposal(approve);
        res.json({});
      });
    });
  }
});

//to reject budgets(by changing budget, assign date and status), for finance
app.post("/proposalReject", authenticateToken, (req, res) => {
  if (req.user.department == "Finance") {
    console.log(req.body);
    Proposal.findOne({ where: { id: req.body.budget.id } }).then((approve) => {
      approve.approveBudgetStatus = false;
      approve.budgetApprovedRejectedDate = new Date();

      approve.save().then((acc) => {
        console.log("removed");
        res.json({});
      });
    });
  } else if (req.user.department == "Logistics") {
    console.log(req.body);
    Proposal.findOne({ where: { id: req.body.budget.id } }).then((approve) => {
      approve.CPDId = req.body.tType;
      approve.venueApprovedRejectedDate = new Date();
      approve.save().then((acc) => {
        console.log("logisti acce");
        res.json({});
      });
    });
  }
});

const createProposal = async (approve) => {
  console.log(approve.id);
  if (approve.approveBudgetStatus && approve.CPDId) {
    await Course.create({
      proposalId: approve.id,
      creditHr: 6,
    }).then((res) => console.log("course created"));
  }
};

app.get("/fetchAllCourse", authenticateToken, async (req, res) => {
  console.log(req.user.department);
  await Department.findOne({
    where: { name: req.user.department },
  }).then(async (resp) => {
    if (resp != null) {
      await Proposal.findAll({
        include: [
          { model: CPD },
          {
            model: Course,
            include: [
              {
                model: Facilitator,
              },
            ],
          },
        ],
        where: {
          departmentId: resp.id,
          // CPDId: { [Sequelize.Op.ne]: null },
          [Sequelize.Op.and]: [
            {
              approveBudgetStatus: { [Sequelize.Op.ne]: null },
              approveBudgetStatus: true,
            },
          ],
        },
      })
        .then(async (resp2) => {
          console.log("fetching all courses");
          res.json(resp2);
        })
        .catch((err) => console.log("error fetching all course", err));
    } else {
      console.log("the dep is null");
      await CPD.findOne({
        where: { name: req.user.department },
      }).then(async (resp) => {
        await Proposal.findAll({
          include: [
            { model: CPD },
            { model: Course, include: [{ model: Facilitator }] },
          ],
          where: {
            // departmentId: resp.id,
            CPDId: resp.id,
            [Sequelize.Op.and]: [
              {
                approveBudgetStatus: { [Sequelize.Op.ne]: null },
                approveBudgetStatus: true,
              },
            ],
          },
        })
          .then(async (resp2) => {
            console.log("fetching all courses");
            res.json(resp2);
          })
          .catch((err) => console.log("error fetching all course", err));
      });
    }
  });
});

app.get("/gradetrainee/:id", authenticateToken, async (req, res) => {
  const userN = req.user.userName;
  await User.findOne({ where: { userName: userN } }).then(async (resp) => {
    console.log("got that course facil", resp.id);
    await Course.findOne({
      include: [
        { model: Facilitator, where: { userId: resp.id } },
        { model: Trainee, include: [User] },
        { model: Proposal, include: [CPD] },
      ],
      where: { id: req.params.id, courseStatus: true },
    }).then((resp2) => {
      res.json(resp2);
    });
  });
});

app.get("/fetchOneCourse/:id", authenticateToken, async (req, res) => {
  const userN = req.user.userName;
  await User.findOne({
    where: {
      userName: userN,
      [Sequelize.Op.or]: [
        {
          departmentId: { [Sequelize.Op.ne]: null },
          CPDId: { [Sequelize.Op.ne]: null },
        },
      ],
    },
  }).then(async (resp) => {
    console.log("got that staff", resp);
    await Course.findOne({
      include: [
        { model: Facilitator },
        { model: Trainee },
        { model: Proposal, include: [CPD] },
      ],
      where: { id: req.params.id },
    }).then((resp2) => {
      res.json(resp2);
    });
  });
});

app.post("/pretest", authenticateToken, async (req, res) => {
  const userN = req.user.userName;
  // const testAttendance = {
  //   dates: [
  //     { date: "2023-10-01", attended: true },
  //     { date: "2023-10-02", attended: false },
  //     { date: "2023-10-03", attended: true },
  //     { date: "2023-10-04", attended: true },
  //   ],
  // };
  await User.findOne({ where: { userName: userN } }).then(async (resp) => {
    console.log("got that course facil", req.query.id);
    await Trainee.update(
      { preTest: req.query.pret },
      {
        where: { id: req.query.id },
        include: [
          {
            model: Course,
            where: { courseStatus: true },
            include: { model: Facilitator, where: { userId: resp.id } },
          },
        ],
      }
    ).then((resp) => {
      if (resp != null) {
        res.json(true);
      } else {
        res.json(false);
      }
    });
  });
});
app.post("/posttest", authenticateToken, async (req, res) => {
  const userN = req.user.userName;
  await User.findOne({ where: { userName: userN } }).then(async (resp) => {
    console.log("got that course facil", req.query.id);
    await Trainee.update(
      { postTest: req.query.postt },
      {
        where: { id: req.query.id },
        include: [
          {
            model: Course,
            where: { courseStatus: true },
            include: { model: Facilitator, where: { userId: resp.id } },
          },
        ],
      }
    ).then((resp) => {
      if (resp != null) {
        res.json(true);
      } else {
        res.json(false);
      }
    });
  });
});
//fetch all users of staffs, only for system admins
app.get("/fetchAllUser_It", authenticateToken, async (req, res) => {
  // let users = null;
  // let deps = null;
  if (req.user.department == "System Administrator") {
    await User.findAll({
      where: {
        departmentId: {
          [Sequelize.Op.ne]: null,
        },
      },
    })
      .then(async (allUsers) => {
        await Department.findAll().then((allDeps) => {
          const tojson = {
            allDepartments: allDeps.map((dep) => dep.toJSON()),
            users: allUsers.map((user) => user.toJSON()),
          };
          res.json(tojson);
        });
      })
      .catch((err) => console.log("catch for all user ", err));
  }
  // deps=Department.findAll()
});

//fetch all users of staffs, only for system admins
app.get("/fetchAllUser_It_cpd", authenticateToken, async (req, res) => {
  // let users = null;
  // let deps = null;
  if (req.user.department == "System Administrator") {
    await User.findAll({
      include: [
        {
          model: CPD,
        },
      ],
      where: {
        cpdId: {
          [Sequelize.Op.ne]: null,
        },
      },
    })
      .then(async (allUsers) => {
        await CPD.findAll().then((allDeps) => {
          res.json({ allUsers, allDeps });
        });
      })
      .catch((err) => console.log("catch for all user ", err));
  }
  // deps=Department.findAll()
});

//get a user by user name
app.get("/getUser/:id", authenticateToken, async (req, res) => {
  // req.params.id?.toLowerCase()==req.user.userName?.toLowerCase()?
  // console.log("right",req.user):console.log("not ath",req.user,req.params.id);

  if (req.params.id.toLowerCase() === req.user.userName.toLowerCase()) {
    await User.findOne({
      where: {
        userName: req.params.id,
      },
    }).then((theUser) => {
      theUser &&
        Department.findOne({
          where: {
            id: theUser.departmentId,
          },
        })
          .then(async (deps) => {
            if (deps != null) {
              deps.dataValues.name?.toLowerCase() ==
              req.user.department?.toLowerCase()
                ? res.json({
                    user: theUser,
                    department: deps,
                    cpd: null,
                  })
                : console.log(
                    "not ath",
                    req.user.department,
                    deps.dataValues.name
                  );
            } else {
              await CPD.findOne({ where: { id: theUser.cpdId } }).then(
                (cpds) => {
                  if (cpds != null) {
                    cpds.dataValues.name?.toLowerCase() ==
                    req.user.department?.toLowerCase()
                      ? res.json({
                          user: theUser,
                          department: null,
                          cpd: cpds,
                        })
                      : console.log(
                          "not ath",
                          req.user.department,
                          deps.dataValues.name
                        );
                  } else {
                    res.json({
                      user: theUser,
                      department: null,
                      cpd: null,
                    });
                  }
                }
              );
            }
            // console.log({
            //   user: theUser.dataValues,
            //   department: deps.dataValues,
            // })
          })
          .catch((err) => console.log("error", err));
    });
  }
});

//only for sys.admin to create new staff user
app.post("/addstaff", authenticateToken, async (req, res) => {
  console.log("\n\nadding staff...", req.body);
  User.create({
    firstName: req.body.firstName,
    middleName: req.body.middleName,
    lastName: req.body.lastName,
    Dob: req.body.Dob,
    email: req.body.email,
    gender: req.body.gender,
    departmentId: req.body.departmentId,
    phone: req.body.phone,
    eduLevel: req.body.eduLevel,
    profession: req.body.profession,
    userType: req.body.userType ? "Director" : null,
    userName: req.body.userName,
    isStaff: true,
  })
    .then((resp) => res.json(resp))
    .catch((err) => {
      console.log("Unsuccessful");
      res.send(false);
    });
});

//edit staff user only by sys.admin
app.post("/editstaff/:userName", authenticateToken, async (req, res) => {
  console.log("\nediting staff...", req.params.userName);
  await User.findOne({ where: { userName: req.params.userName } }).then(
    (editU) => {
      editU
        .update({
          firstName: req.body.firstName,
          middleName: req.body.middleName,
          lastName: req.body.lastName,
          Dob: req.body.Dob,
          email: req.body.email,
          gender: req.body.gender,
          departmentId: req.body.departmentId,
          phone: req.body.phone,
          eduLevel: req.body.eduLevel,
          profession: req.body.profession,
          userType: req.body.userType ? "Director" : "",
          userName: req.body.userName,
          isStaff: true,
        })
        .then((result) => res.json(result))
        .catch((err) => {
          console.log("Unsuccessful");
          res.send(false);
          console.log(err);
        });
    }
  );
});
app.post("/addcpd/", authenticateToken, async (req, res) => {
  console.log("\nadd cpd...", req.body);
  await User.create({
    firstName: req.body.firstName,
    middleName: req.body.middleName,
    lastName: req.body.lastName,
    Dob: req.body.Dob,
    email: req.body.email,
    gender: req.body.gender,
    cpdId: req.body.cpdId,
    phone: req.body.phone,
    profession: req.body.profession,
    userType: "Director",
    userName: req.body.userName,
    isStaff: false,
  }).then(async (result) => {
    await User.findOne({
      include: [
        {
          model: CPD,
        },
      ],
      where: { id: result.id },
    })
      .then((newResult) => res.json(newResult))
      .catch((err) => {
        console.log("Unsuccessful");
        res.send(false);
        console.log(err);
      });
  });
});
//edit staff user only by sys.admin
app.post("/editcpd/:userName", authenticateToken, async (req, res) => {
  console.log("\nediting cpd...", req.params.userName);
  await User.findOne({
    where: { userName: req.params.userName },
  }).then((editU) => {
    editU
      .update({
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        Dob: req.body.Dob,
        email: req.body.email,
        gender: req.body.gender,
        cpdId: req.body.cpdId,
        phone: req.body.phone,
        profession: req.body.profession,
        userType: "Director",
        userName: req.body.userName,
        isStaff: false,
      })
      .then(
        async (result) =>
          await User.findOne({
            include: [
              {
                model: CPD,
              },
            ],
            where: { id: result.id },
          }).then((newResult) => res.json(newResult))
      )
      .catch((err) => {
        console.log("Unsuccessful");
        res.send(false);
        console.log(err);
      });
  });
});

app.get("/getTrainersbydep", authenticateToken, async (req, res) => {
  console.log("course", req.query.courseId);
  await Course.findOne({
    include: [Proposal],
    where: { id: req.query.courseId },
  }).then(async (props) => {
    await User.findAll({
      include: {
        model: Department,
        where: { id: props.Proposal.departmentId },
      },
    })
      .then(async (allUsers) => {
        console.log("the users by dep", allUsers);
        res.json(allUsers);
      })
      .catch((err) => console.log("catch for all user ", err));
  });
});

app.post("/registertrainee", authenticateToken, async (req, res) => {
  console.log(
    `\n\ntrainee registered ${req.query.uid},${req.query.courseid} ${
      req.query.uid > 0
    }\n\n`
  );
  // console.log(req.body);
  const newAttendance = {
    dates: [{ date: new Date().toDateString(), attended: true }],
  };
  const addTr = async (userId) => {
    await Trainee.create({
      userId: userId,
      courseId: req.query.courseid,
      attendance: JSON.stringify(newAttendance),
    }).then(async (resp) => {
      await Course.update(
        { courseStatus: true },
        { where: { id: req.query.courseid } }
      );
      res.json(resp);
    });
  };
  if (!(req.query.uid > 0)) {
    User.create({
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      gender: req.body.gender,
      email: req.body.email,
      phone: req.body.phone,
      profession: req.body.profession,
      Dob: req.body.Dob,
      userName: req.body.userName,
    }).then((resp) => {
      console.log(resp.dataValues.id);
      addTr(resp.dataValues.id);
    });
  } else {
    addTr(req.query.uid);
  }
});

app.get("/removetrainee", authenticateToken, async (req, res) => {
  console.log(`\n\ntrainee removed ${req.query.traineeId}\n\n`);
  await Trainee.destroy({
    where: {
      id: req.query.traineeId,
    },
  }).then((resp) => {
    res.json("");
  });
});

app.get("/getTrainees", authenticateToken, async (req, res) => {
  await Trainee.findAll({
    include: [
      { model: User },
      {
        model: Course,
        attributes: ["courseStatus"],
        include: [{ model: Proposal, attributes: ["topic", "CPDID"] }],
      },
    ],
    where: { courseId: req.query.courseId },
  }).then((resp) => {
    console.log("req success trainee");
    res.json(resp);
  });
});

app.post("/addTrainers", authenticateToken, async (req, res) => {
  const tr = req.query.trainers.split(",");
  const success = [];
  const directorName = await User.findOne({
    include: { model: Department, where: { name: req.user.department } },
    where: { userName: req.user.userName },
  });
  console.log("\nthe trainers", tr, req.query.courseId);
  tr.forEach(async (trainer) => {
    await Trainer.create({
      userId: trainer,
      courseId: req.query.courseId,
      assignedBy: `${directorName.firstName} ${directorName.middleName} ${directorName.lastName}`,
    }).then((res) => {
      success.push("success");
      console.log("successfully trainer created");
    });
  });
  res.json(success);
});

app.get("/getTrainers", authenticateToken, async (req, res) => {
  console.log("get trainers", req.query.courseId);
  await Trainer.findAll({
    include: [User],
    where: { courseId: req.query.courseId },
  }).then((resp) => {
    console.log("successfully trainer created");
    res.json(resp);
  });
});

app.get("/removetrainer", authenticateToken, async (req, res) => {
  console.log(`\ntrainer removed ${req.query.trainerId}\n`);

  await Trainer.destroy({
    where: {
      id: req.query.trainerId,
    },
  }).then((resp) => {
    res.json("trainer removed");
  });
});

app.get("/searchuser/", authenticateToken, async (req, res) => {
  const nameParts = req.query.query.split(" ");
  const [fName, mName, lName] = nameParts;
  console.log("the name", fName, req.query.userid);
  if (nameParts.length == 1) {
    await User.findAll({
      where: {
        firstName: { [Sequelize.Op.like]: `%${fName}%` },
        departmentId: null,
        cpdId: null,
      },
    }).then((resp) => {
      res.json(resp);
    });
  } else if (nameParts.length == 2) {
    await User.findAll({
      where: {
        [Sequelize.Op.or]: [
          { firstName: { [Sequelize.Op.like]: `%${fName}%` } },
          { middleName: { [Sequelize.Op.like]: `%${mName}%` } },
        ],
      },
    }).then((resp) => {
      res.json(resp);
    });
  } else if (nameParts.length == 3) {
    await User.findAll({
      where: {
        [Sequelize.Op.or]: [
          { firstName: { [Sequelize.Op.like]: `%${fName}%` } },
          { middleName: { [Sequelize.Op.like]: `%${mName}%` } },
          { lastName: { [Sequelize.Op.like]: `%${lName}%` } },
        ],
      },
    }).then((resp) => {
      res.json(resp);
    });
  }
});

app.post("/addFacilitator", authenticateToken, async (req, res) => {
  const tr = req.query.facilitators.split(",");
  const success = [];

  let directorName = await User.findOne({
    include: { model: Department, where: { name: req.user.department } },
    where: { userType: "director" },
  });
  if (directorName == null) {
    directorName = await User.findOne({
      include: { model: CPD, where: { name: req.user.department } },
      where: { userType: "director" },
    });
  }
  console.log(
    "\nthe facilitator",
    tr,
    req.query.courseId,
    directorName.firstName
  );
  tr.forEach(async (facilitator) => {
    await Facilitator.create({
      userId: facilitator,
      courseId: req.query.courseId,
      assignedBy: `${directorName.firstName} ${directorName.middleName} ${directorName.lastName}`,
    }).then((res) => {
      success.push("success");
      console.log("successfully facilitator reated");
    });
  });
  res.json(success);
});

app.get("/getFacilitator", authenticateToken, async (req, res) => {
  console.log("get facilitator", req.query.courseId);
  await Facilitator.findAll({
    include: [User],
    where: { courseId: req.query.courseId },
  }).then((resp) => {
    console.log("successfully found facilitator");
    res.json(resp);
  });
});

app.post("/changepass", authenticateToken, async (req, res) => {
  console.log(req.query.id, req.query.password);
  const uId = req.query.id;
  await User.findOne({ where: { id: uId } }).then(async (resp) => {
    // if (resp.password == "") {
    const saltRounds = 3;
    bcrypt.hash(req.query.password, saltRounds, async function (err, hash) {
      if (err) {
        console.error(err);
        return;
      }
      console.log(typeof hash); // This is the hashed password

      await User.update({ password: hash }, { where: { id: uId } })
        .then((rep2) => {
          console.log("done", hash);
        })
        .then((resp2) => {
          res.json(true);
        });
    });
    // }
    // console.log(checkPass())
  });
});

//add new department
app.post("/adddepartment", authenticateToken, async (req, res) => {
  const reque = req.body.newDep;
  console.log("new department", reque);
  await Department.create({
    name: reque.depName,
  }).then((resp) => {
    res.json(resp);
  });
});

app.get("/getdepartment", authenticateToken, async (req, res) => {
  await Department.findAll().then((resp) => {
    res.json(resp);
  });
});

//add new organizer
app.post("/addorganizer", authenticateToken, async (req, res) => {
  const reque = req.body.newDep;
  console.log("new cpd", reque);
  await CPD.create({
    name: reque.orgName,
  }).then((resp) => {
    res.json(resp);
  });
});

app.get("/getAttendance/:id", authenticateToken, async (req, res) => {
  console.log("the trainee atten ", req.params.id);
  await Trainee.findAll({
    include: [{ model: User }, { model: Course, where: { id: req.params.id } }],
  }).then((resp) => {
    console.log("the trainee atten ", resp.length);
    if (resp.length > 0) {
      if (resp[0].Course.courseStatus == true) {
        let isToday = JSON.parse(resp[0].attendance);
        console.log("the trainee atten course is true");
        // if (isToday === null) {
        //   isToday =
        //     { dates: [{ date: new Date().toDateString(), attended: false }] };
        // }
        if (
          isToday.dates[isToday.dates.length - 1].date ==
          new Date().toDateString()
        ) {
          console.log("the trainee atten course is modified today");
          res.json({ trainee: resp, today: null });
        } else {
          res.json({ trainee: resp, today: new Date().toDateString() });
        }
      }
    } else {
      res.json({ trainee: null, today: null });
    }
  });
});

app.post("/setattendance", authenticateToken, async (req, res) => {
  const isUser = req.user.userName;
  await User.findOne({ where: { userName: isUser } }).then(async (uId) => {
    await Course.findOne({
      include: [{ model: Facilitator, where: { userId: uId.id } }],
      where: { courseStatus: true, id: req.body.course },
    }).then(async (resp) => {
      // const attend = { dates: req.body.attendance[0].Attendance };
      // console.log(attend);
      if (resp) {
        req.body.attendance.forEach(async (element) => {
          await Trainee.update(
            {
              attendance: JSON.stringify({ dates: element.attendance }),
            },
            {
              where: { id: element.uId },
            }
          );
        });
      }
    });
  });
  // console.log(req.body.attendance[0].Attendance);
});

app.put("/allowrate", authenticateToken, async (req, res) => {
  console.log(req.query.allow, req.query.cId);
  await Course.update(
    { allowRating: req.query.allow },
    { where: { id: req.query.cId, courseStatus: true } }
  ).then((resp) => {
    res.json(true);
  });
});

app.get("/gettrainerforrate", authenticateToken, async (req, res) => {
  console.log(req.query.uId, req.query.cId);
  await Course.findOne({
    where: { allowRating: true, courseStatus: true, id: req.query.cId },
    include: [
      {
        model: Trainee,
        where: {
          userId: req.query.uId,
          trainerRate: false,
        },
      },
      {
        model: Trainer,
        attributes: ["id", "assignedBy"],
        include: {
          model: User,
          attributes: ["firstName", "middleName", "lastName"],
        },
      },
    ],
  }).then((resp) => {
    console.log("course trainers", resp?.Trainees.length);
    let trainerR = null;
    if (resp) {
      if (!resp.Trainees[0].trainerRate) {
        const cols = [
          "Personality keeping including wearing style(From  5pts)",
          "Training materials preparation status(From 15pts)",
          "Training methods used(From 15pts)",
          "Facilitation skill(From 15pts)",
          "Comprehensive Knowledge regarding to course title(From 15pts)",
          "Comprehensive practical skill regarding to course title(From 15pts)",
          "Punctuality(From 10pts)",
          "CRC/Decipline(From 10pts)",
        ];
        console.log("course trainers1", resp.Trainers.length);
        trainerR = { form: cols, trainers: resp.Trainers };
      }
      if (resp.Trainees[0].courseRate) {
      }
    }
    // console.log("response", {"trainerR":trainerR,"courseR":courseR});
    res.json(trainerR);
  });
});

app.post("/ratetrainer", authenticateToken, async (req, res) => {
  console.log("rated trainers", req.body.enteredValue);
  const ratedValue = req.body.enteredValue;
  let isDone = false;
  ratedValue.forEach(async (element, i) => {
    element.data.sort((a, b) => {
      if (a.key < b.key) {
        return -1;
      }
      if (a.key > b.key) {
        return 1;
      }
      return 0;
    });
    console.log(element);
    if (element.data.length == 8) {
      await Trainee.findOne({
        where: {
          userId: req.query.uId,
          courseId: req.query.cId,
          trainerRate: false,
        },
      }).then(async (foundT) => {
        if (foundT != null) {
          await trainerEvaluation
            .findOne({
              where: {
                trainerId: element.uId,
                courseId: req.query.cId,
              },
            })
            .then(async (tE) => {
              if (tE != null) {
                tE.Personality_keeping_including_wearing_style =
                  parseInt(element.data[0].rate) +
                  parseInt(tE.Personality_keeping_including_wearing_style);
                tE.Training_materials_preparation_status =
                  parseInt(element.data[1].rate) +
                  parseInt(tE.Training_materials_preparation_status);
                tE.Training_methods_used =
                  parseInt(element.data[2].rate) +
                  parseInt(tE.Training_methods_used);
                tE.Facilitation_skill =
                  parseInt(element.data[3].rate) +
                  parseInt(tE.Facilitation_skill);
                tE.Comprehensive_Knowledge_regarding_to_course_title =
                  parseInt(element.data[4].rate) +
                  parseInt(
                    tE.Comprehensive_Knowledge_regarding_to_course_title
                  );
                tE.Comprehensive_practical_skill_regarding_to_course_title =
                  parseInt(element.data[5].rate) +
                  parseInt(
                    tE.Comprehensive_practical_skill_regarding_to_course_title
                  );
                tE.Punctuality =
                  parseInt(element.data[6].rate) + parseInt(tE.Punctuality);
                tE.CRC_Decipline =
                  parseInt(element.data[7].rate) + parseInt(tE.CRC_Decipline);
                tE.voteAmount = parseInt(tE.voteAmount) + 1;
                await tE.save().then(async (resp) => {
                  if (resp) {
                    foundT.trainerRate = true;
                    await foundT.save();
                    if (ratedValue.length - 1 == i) {
                      res.json(true);
                    }
                    isDone = true;
                    // res.json(true);
                  } else {
                    isDone = false;
                  }
                });
              } else {
                await trainerEvaluation
                  .create({
                    trainerId: element.uId,
                    courseId: req.query.cId,
                    dateOfEvaluation: new Date(),
                    Personality_keeping_including_wearing_style:
                      element.data[0].rate,
                    Training_materials_preparation_status: element.data[1].rate,
                    Training_methods_used: element.data[2].rate,
                    Facilitation_skill: element.data[3].rate,
                    Comprehensive_Knowledge_regarding_to_course_title:
                      element.data[4].rate,
                    Comprehensive_practical_skill_regarding_to_course_title:
                      element.data[5].rate,
                    Punctuality: element.data[6].rate,
                    CRC_Decipline: element.data[7].rate,
                    voteAmount: 1,
                  })
                  .then(async (resp) => {
                    foundT.trainerRate = true;
                    await foundT.save();
                    if (resp) {
                      if (ratedValue.length - 1 == i) {
                        res.json(true);
                      }
                      isDone = true;
                      // res.json(true);
                    } else {
                      isDone = false;
                      // res.json(false);
                    }
                    console.log(resp);
                  });
              }
            });
        }
      });
    } else {
      res.json(false);
    }
  });
  // if (isDone) {
  //   res.json(true);
  // }
});

app.get("/getcourseforrate", authenticateToken, async (req, res) => {
  console.log(req.query.uId, req.query.cId);
  await Course.findOne({
    where: { allowRating: true, courseStatus: true, id: req.query.cId },
    include: [
      {
        model: Trainee,
        where: {
          userId: req.query.uId,
          courseRate: false,
        },
      },
    ],
  }).then(async (resp) => {
    if (resp != null) {
      let cols = [];
      const rows = [
        "Overall training content",
        "Training methods",
        "Trainers facilitation skill",
        "Participation status",
        "Refreshment services",
        "Training venue",
        "Training materials preparation",
        "Experience sharing",
        "Time allocation for each course title",
        "Overall  training facilitation",
        "Overall  training coordination",
      ];
      await rating_type.findAll().then((ratingT) => {
        ratingT.forEach((element) => {
          cols.push(element.type);
        });
      });
      res.json({ cols, rows });
    }
  });
});

app.put("/ratecourse", authenticateToken, async (req, res) => {
  const ratings = req.body.finalValue;
  let success = false;
  console.log(ratings);
  console.log(req.query.cId, req.query.uId);
  await Trainee.findOne({
    where: { courseId: req.query.cId, userId: req.query.uId },
  }).then(async (foundTrainee) => {
    if (foundTrainee != null && !foundTrainee.courseRate) {
      await CourseRating.findAll({ where: { courseId: req.query.cId } }).then(
        async (foundC) => {
          if (foundC.length < 1) {
            ratings.forEach(async (element, i) => {
              await CourseRating.create({
                courseId: req.query.cId,
                OverallTrainingContent: element.values[0],
                TrainingMethods: element.values[1],
                TrainersFacilitationSkill: element.values[2],
                ParticipationStatus: element.values[3],
                RefreshmentServices: element.values[4],
                TrainingVenue: element.values[5],
                TrainingMaterialsPreparation: element.values[6],
                ExperienceSharing: element.values[7],
                TimeAllocationForEachCourseTitle: element.values[8],
                OverallTrainingFacilitation: element.values[9],
                OverallTrainingCoordination: element.values[10],
                ratingTypeId: i + 1,
              }).then(async (resp) => {
                console.log("success is ", success);
                if (resp != null) {
                  success = true;
                }
              });
            });
          } else {
            ratings.forEach(async (element, i) => {
              foundC.forEach(async (rates) => {
                if (rates.ratingTypeId == i + 1) {
                  rates.OverallTrainingContent =
                    parseInt(rates.OverallTrainingContent) +
                    parseInt(element.values[0]);
                  rates.TrainingMethods =
                    parseInt(rates.TrainingMethods) +
                    parseInt(element.values[1]);
                  rates.TrainersFacilitationSkill =
                    parseInt(rates.TrainersFacilitationSkill) +
                    parseInt(element.values[2]);
                  rates.ParticipationStatus =
                    parseInt(rates.ParticipationStatus) +
                    parseInt(element.values[3]);
                  rates.RefreshmentServices =
                    parseInt(rates.RefreshmentServices) +
                    parseInt(element.values[4]);
                  rates.TrainingVenue =
                    parseInt(rates.TrainingVenue) + parseInt(element.values[5]);
                  rates.TrainingMaterialsPreparation =
                    parseInt(rates.TrainingMaterialsPreparation) +
                    parseInt(element.values[6]);
                  rates.ExperienceSharing =
                    parseInt(rates.ExperienceSharing) +
                    parseInt(element.values[7]);
                  rates.TimeAllocationForEachCourseTitle =
                    parseInt(rates.TimeAllocationForEachCourseTitle) +
                    parseInt(element.values[8]);
                  rates.OverallTrainingFacilitation =
                    parseInt(rates.OverallTrainingFacilitation) +
                    parseInt(element.values[9]);
                  rates.OverallTrainingCoordination =
                    parseInt(rates.OverallTrainingCoordination) +
                    parseInt(element.values[10]);
                  await rates.save().then((svedResp) => {
                    success = true;
                    console.log("edited");
                  });
                }
              });
            });
          }
        }
      );
    }
    foundTrainee.courseRate = true;
    await foundTrainee.save().then((tResp) => {
      if (tResp) {
        res.json(true);
      }
    });
  });
});

app.get("/checktraineetests/:cId", authenticateToken, async (req, res) => {
  await Trainee.findAll({
    where: { courseId: req.params.cId },
    include: {
      model: User,
      attributes: ["firstName", "middleName", "lastName"],
    },
  }).then((resp) => {
    const incompleteTrainees = [];
    if (resp.length > 0) {
      resp.forEach((element) => {
        if (element.preTest == null || element.postTest == null) {
          incompleteTrainees.push({
            name: `${element.User.firstName} ${element.User.middleName} ${element.User.lastName}`,
            preTest: element.preTest,
            postTest: element.postTest,
          });
        }
      });
    }
    res.json(incompleteTrainees);
  });
});

app.post("/endcourse/:cId", authenticateToken, async (req, res) => {
  await Course.update(
    { courseStatus: false },
    { where: { id: req.params.cId } }
  ).then((resp) => {
    if (resp) {
      res.json(true);
    }
  });
});

app.get("/generateCertification", authenticateToken, async (req, res) => {
  console.log(req.query.cId, req.query.tId);
  await Trainee.findOne({
    include: [
      { model: User },
      {
        model: Course,
        attributes: ["courseStatus", "updatedAt"],
        where: { id: req.query.cId, courseStatus: false },
        include: [{ model: Proposal, attributes: ["topic", "CPDID"] }],
      },
    ],
    where: { courseId: req.query.cId, id: req.query.tId },
  }).then((resp) => {
    if (resp) {
      const tName = `${resp.User.firstName} ${resp.User.middleName}`;
      const toDate = new Date(resp.Course.updatedAt);
      const cPeriod = `${toDate.getDate()}-${toDate.getMonth()}-${toDate.getFullYear()}`;
      generateCertification(tName, resp.Course.Proposal.topic, cPeriod)
        .then(async (gResp) => {
          console.log("certified succesfully", gResp);
          resp.certified = true;
          resp.save().then((saved) => {
            if (saved) {
              res.json(true);
            }
          });
        })
        .catch((err) => {
          console.log("certified was unsuccesfully", err);
          res.json(false);
        });
    }
  });
});

app.put("/requestconductor/:id", authenticateToken, async (req, res) => {
  console.log(req.params.id, " course id");
  await User.findOne({ where: { userName: req.user.userName } }).then(
    async (resp) => {
      if (resp.userType.toLowerCase() == "director") {
        console.log(resp.userName, " is director");
        await Course.findOne({
          include: { model: Proposal, include: [CPD] },
          where: { id: req.params.id },
        }).then(async (cpdRes) => {
          console.log(cpdRes.Proposal.CPDId, " cpd");
          if (cpdRes.Proposal.CPD) {
            console.log(cpdRes.Proposal.CPD.request, " cpd");
          }
        });
      } else {
        console.log(resp.userName, " not director");
      }
    }
  );
});

app.get("/gettraineeinfo/:id", authenticateToken, async (req, res) => {
  await Trainee.findAll({
    attributes: [
      "id",
      "preTest",
      "postTest",
      "certified",
      "attendance",
      "trainerRate",
      "courseRate",
    ],
    include: {
      model: Course,
      attributes: ["id", "courseStatus", "allowRating"],
      include: [
        { model: Proposal, attributes: ["topic"] },
        {
          model: Trainer,
          include: {
            model: User,
            attributes: ["firstName", "middleName", "lastName"],
          },
          attributes: ["rating"],
        },
      ],
    },
    where: { userId: req.params.id },
  }).then((resp) => {
    res.json(resp);
  });
});

app.get("/gettrainerinfo/:id", authenticateToken, async (req, res) => {
  await Trainer.findAll({
    attributes: ["assignedBy", "rating"],
    include: {
      model: Course,
      attributes: ["courseStatus", "allowRating"],
      include: [
        { model: Proposal, attributes: ["topic"] },
        {
          model: Trainer,
          include: {
            model: User,
            attributes: ["firstName", "middleName", "lastName"],
          },
          attributes: ["rating"],
        },
      ],
    },
    where: { userId: req.params.id },
  }).then((resp) => {
    res.json(resp);
  });
});

/*login by taking user name and password, 
and generate a new token based on the user name, password and department*/
app.post("/login", async (req, res) => {
  const reque = req.body.data;
  let user = {
    userName: reque.userName,
    password: reque.password,
  };
  let accessToken = null;
  const foundUser = await User.findOne({
    where: {
      userName: reque.userName,
      // password: reque.password,
    },
  })
    .then(async (foundUser) => {
      if (foundUser.password != "") {
        bcrypt.compare(
          user.password,
          foundUser.password,
          async function (err, pRes) {
            if (err) {
              console.error(err);
              return;
            }
            if (pRes) {
              const departments = await Department.findOne({
                where: {
                  id: foundUser.departmentId,
                },
              });
              if (departments == null) {
                console.log("dep is null ", departments);
                const cpds = await CPD.findOne({
                  where: { id: foundUser.cpdId },
                });
                if (cpds == null) {
                  console.log("cpd is also null ", cpds);
                  const aTrainer = await Trainer.findAll({
                    include: { model: Course },
                    where: { userId: foundUser.id },
                  });
                  const aTrainee = await Trainee.findAll({
                    include: { model: Course },
                    where: { userId: foundUser.id },
                  });
                  user = { ...user, department: null };
                  console.log(user);
                  accessToken = jwt.sign(user, process.env.JWT_SECRET);
                  res.json({
                    accessToken: accessToken,
                    user: foundUser,
                    department: null,
                    cpd: null,
                    trainee: aTrainee,
                    trainer: aTrainer,
                  });
                } else {
                  user = { ...user, department: cpds.name };
                  console.log(user);
                  accessToken = jwt.sign(user, process.env.JWT_SECRET);

                  res.json({
                    accessToken: accessToken,
                    user: foundUser,
                    department: null,
                    cpd: cpds,
                  });
                }
              } else {
                user = { ...user, department: departments.name };
                console.log(user);
                accessToken = jwt.sign(user, process.env.JWT_SECRET);

                res.json({
                  accessToken: accessToken,
                  user: foundUser,
                  department: departments,
                  cpd: null,
                });
              }
            } else {
              console.log("password not the same");
            }
          }
        );
      } else if (user.password == foundUser.password) {
        const departments = await Department.findOne({
          where: {
            id: foundUser.departmentId,
          },
        });
        if (departments == null) {
          console.log("dep is null ", departments);
          const cpds = await CPD.findOne({ where: { id: foundUser.cpdId } });
          if (cpds == null) {
            console.log("cpd is also null ", cpds);
            const aTrainer = await Trainer.findAll({
              include: { model: Course },
              where: { userId: foundUser.id },
            });
            const aTrainee = await Trainee.findAll({
              include: { model: Course },
              where: { userId: foundUser.id },
            });
            user = { ...user, department: null };
            console.log(user);
            accessToken = jwt.sign(user, process.env.JWT_SECRET);
            res.json({
              accessToken: accessToken,
              user: foundUser,
              department: null,
              cpd: null,
              trainee: aTrainee,
              trainer: aTrainer,
            });
          } else {
            user = { ...user, department: cpds.name };
            console.log(user);
            accessToken = jwt.sign(user, process.env.JWT_SECRET);

            res.json({
              accessToken: accessToken,
              user: foundUser,
              department: departments,
              cpd: cpds,
            });
          }
        } else {
          user = { ...user, department: departments.name };
          console.log(user);
          accessToken = jwt.sign(user, process.env.JWT_SECRET);

          res.json({
            accessToken: accessToken,
            user: foundUser,
            department: departments,
            cpd: null,
          });
        }
      }
    })
    .catch((err) => console.log("error", err));

  //res.json({ accessToken: accessToken });
});

app.listen(5000, () => {
  // User.create({
  //   firstName:'Bebe',
  //   middleName:'Kokolo',
  //   lastName:'Abana',
  //   Dob:'1980-5-25'
  // })
  // await UserType.drop();
  console.log("server running");
});

app.get("/isUser", authenticateToken, async (req, res) => {
  // Example usage
  // const traineeName = "John Doe";
  // const courseName = "React Certification";
  // const date = "November 1, 2023";

  // generateCertification(traineeName, courseName, date)
  //   .then(() => console.log("Certificate generated successfully"))
  //   .catch((error) => console.error("Error generating certificate:", error));
  console.log("logged user", req.user);
  if (req.user != null) {
    await User.findOne({ where: { userName: req.user.userName } }).then(
      (resp) => {
        if (resp.departmentId != null) {
          res.json({ user: resp, department: req.user.department, cpd: null });
        } else if (resp.cpdId != null) {
          res.json({ user: resp, department: null, cpd: req.user.department });
        } else {
          res.json({
            user: resp,
            department: null,
            cpd: null,
            trainee: req.user.trainee,
            trainer: req.user.trainer,
          });
        }
      }
    );
  }
});

//check authentication token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);
  //console.log("got it ", token);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // console.log("got it ", user);
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

function hashPass(password) {
  const saltRounds = 3;
  bcrypt.hash(password, saltRounds, function (err, hash) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(hash); // This is the hashed password
    return hash;
  });
}

function checkPass(password, hash) {
  bcrypt.compare(password, hash, function (err, res) {
    if (err) {
      console.error(err);
      return;
    }

    console.log(res); // This will be true if the password matches the hash, and false otherwise
    return res;
  });
}

const { PDFDocument } = require("pdf-lib");
const fs = require("fs");
const courserating = require("./models/courserating");

async function generateCertification(TraineeName, courseName, date) {
  // Load the certificate template
  const certificateBytes = await fs.promises.readFile(
    "Internship_Certificate_Of_Completion2.pdf"
  );
  const pdfDoc = await PDFDocument.load(certificateBytes);

  // Access the first page of the PDF
  const page = pdfDoc.getForm();
  const name = page.getTextField("TraineeName");
  const details = page.getTextField("Details");

  // Add dynamic data to the certificate
  const Details = `For completing a course in ${courseName} period ${date}`;

  name.setText(TraineeName);

  details.setText(Details);

  // Save the modified PDF as a new file
  page.flatten();
  const modifiedPdfBytes = await pdfDoc.save();
  await fs.promises.writeFile(
    `${TraineeName}-${courseName}-${date}.pdf`,
    modifiedPdfBytes
  );
}
