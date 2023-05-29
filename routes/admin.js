import express from "express";
import db from "../database/controllers.js";
import 'dotenv/config';

const adminRoute = express.Router();

adminRoute.route("/")
.post((req, res) => {


  let {password} = req.body

  console.log(password)

  if(password === process.env.PASSWORD){
    res.status(200).json('Correct Password')

  }else{
    res.status(401).json('Incorrect Password')
  }

});


export default adminRoute
