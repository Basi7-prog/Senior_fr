const express = require("express");
require("dotenv").config();
const router = express.Router();
const app = express();
const cors = require("cors");
const { User, Department } = require("./models");
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("heloo");
});

app.get("/fetchAllUser_It", authenticateToken, async (req, res) => {
  // let users = null;
  // let deps = null;
  await User.findAll()
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
  // deps=Department.findAll()
});
app.get("/getUser/:id", authenticateToken, async (req, res) => {
  // req.params.id?.toLowerCase()==req.user.userName?.toLowerCase()?
  // console.log("right",req.user):console.log("not ath",req.user,req.params.id);
  await User.findOne({
    where: {
      userName: req.params.id,
    },
  }).then((theUser) => {
    Department.findOne({
      where: {
        id: theUser.departmentId,
      },
    }).then((deps) => {
      deps.dataValues.name?.toLowerCase() == req.user.department?.toLowerCase()
        ? res.json({
            user: theUser,
            department: deps,
          })
        : console.log("not ath", req.user.department, deps.dataValues.name);
      // console.log({
      //   user: theUser.dataValues,
      //   department: deps.dataValues,
      // })
    });
  });
});
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
    userType: req.body.userType ? "Director" : "",
    userName: req.body.userName,
    isStaff: true,
  })
    .then((resp) => res.json(resp))
    .catch((err) => {
      console.log("Unsuccessful");
      res.send(false);
    });
});
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
