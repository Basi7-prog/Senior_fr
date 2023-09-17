const express=require("express");
const router=express.Router();
const app=express();
const {User}=require("./models");



app.listen(5000,()=>{
  User.create({
    firstName:'Bebe',
    middleName:'Kokolo',
    lastName:'Abana',
    Dob:'1980-5-25'
  })
    console.log("server running");
});