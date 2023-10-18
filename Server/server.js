const express = require("express");
require("dotenv").config();
const router = express.Router();
const app = express();
const cors = require("cors");
const {
  User,
  Department,
  Proposal,
  Course,
  CPD,
  Trainee,
  Trainer,
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
        where: { CPDId: null },
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
  await Department.findOne({
    where: { name: req.user.department },
  }).then(async (resp) => {
    await Proposal.findAll({
      include: [Course, CPD],
      where: {
        departmentId: resp.id,
        CPDId: { [Sequelize.Op.ne]: null },
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
    // await Course.findAll({
    //   include: {
    //     model: Proposal,
    //     include: [Department, CPD],
    //   },
    // }).then((data) => {
    //   console.log("fetching all courses");
    //   res.json(data);
    // });
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
        .then((deps) => {
          deps.dataValues.name?.toLowerCase() ==
          req.user.department?.toLowerCase()
            ? res.json({
                user: theUser,
                department: deps,
              })
            : console.log("not ath", req.user.department, deps.dataValues.name);
          // console.log({
          //   user: theUser.dataValues,
          //   department: deps.dataValues,
          // })
        })
        .catch((err) => console.log("error", err));
  });
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
  await User.findAll({
    include: {
      model: Department,
      where: { name: req.user.department },
    },
  })
    .then(async (allUsers) => {
      console.log("the users by dep", allUsers);
      res.json(allUsers);
    })
    .catch((err) => console.log("catch for all user ", err));
});

app.post("/registertrainee", authenticateToken, async (req, res) => {
  console.log(
    `\n\ntrainee registered ${req.query.uid},${req.query.courseid} ${
      req.query.uid > 0
    }\n\n`
  );
  // console.log(req.body);
  const addTr= async(userId)=> {
    await Trainee.create({
      userId: userId,
      courseId: req.query.courseid,
    }).then((resp) => {
      res.json(resp);
    });
  }
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
    }).then((resp)=>{
      console.log(resp.dataValues.id)
      addTr(resp.dataValues.id);
    });
  }else{
    addTr(req.query.uid)
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
    include: [User],
    where: { courseId: req.query.courseId },
  }).then((resp) => {
    console.log("req success trainee");
    res.json(resp);
  });
});

app.post("/addTrainers", authenticateToken, async (req, res) => {
  const tr = req.query.trainers.split(",");
  const success = [];
  console.log("\nthe trainers", tr, req.query.courseId);
  tr.forEach(async (trainer) => {
    await Trainer.create({
      userId: trainer,
      courseId: req.query.courseId,
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
      password: reque.password,
    },
  })
    .then(async (foundUser) => {
      const departments = await Department.findOne({
        where: {
          id: foundUser.departmentId,
        },
      });
      user = { ...user, department: departments.name };
      console.log(user);
      accessToken = jwt.sign(user, process.env.JWT_SECRET);

      res.json({
        accessToken: accessToken,
        user: foundUser,
        departments: departments,
      });
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

//check authentication token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);
  //console.log("got it ", token);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      //console.log("got it ", user);
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}
