const express = require("express");
require("dotenv").config();
const router = express.Router();
const app = express();
const cors = require("cors");
const { User, UserType } = require("./models");
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("heloo");
});
const posts=[{
  userName:"basleal",
  post:"this is basleal"
},{
  userName:"eliyab",
  post:"this is eliyab"
}]
app.get("/l",authenticateToken, async (req, res) => {
  console.log("fot here",req)
  res.json(posts.filter(post=>post.userName==req.user.firstName))
});

app.post("/find", async (req, res) => {
  const reque = req.body.data;
  const user = {
    firstName: reque.userName,
    password: reque.password,
  };
  let accessToken = null;
  const foundUser = await User.findOne({
    where: {
      firstName: reque.userName,
      password: reque.password,
    },
  })
    .then((foundUser) => {
      accessToken = jwt.sign(user, process.env.JWT_SECRET);
      res.json({accessToken:accessToken});
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
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.sendStatus(401);
    console.log("got it ",token)

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("got it ",user);
      return res.sendStatus(403)}
    req.user = user;
    next();
  });
}
