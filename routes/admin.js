import express from "express";
import db from "../database/controllers.js";
import {dkpSquish} from "../core/dkpManager.js"
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

adminRoute.route("/squish")
.post((req, res) => {

  dkpSquish()
  .then((response) => {
    res.status(200).json(response)

  })
  .catch((err) => {
    console.log(err)
    res.status(401).json(err)
  })


})


export default adminRoute
