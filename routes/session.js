const express = require("express");
const router = express.Router();
const db = require("../database/controllers");

router.route("/")
.get((req, res) => {
  //ToDo
  //Likely there will only be one session at a time but we could support multiple by creating the tables with unique hashes


})
.post((req, res) => {
  let {sessionData, action} = req.body;

  if(action === 'CREATE'){
    //Create a table to hold the session data

  }else if(action === 'UPDATE'){
    //Update Session table based on Master Looter input
  }else{
    //Closing a session will process the session table data and update the ledger + character dkp and close the table
  }
  })



module.exports = router;
