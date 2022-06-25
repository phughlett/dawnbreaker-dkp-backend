const express = require("express");
const router = express.Router();
const db = require("../database/controllers");

router.route("/")
.get((req, res) => {
  db.getCharacters()
    .then((response) => res.status(200).json(response))
    .catch((err) => {
      console.error("Error @ /raidteams GET", err);
      res.status(400).json(err);
    });
})
.post((req, res) => {
  let {newTeamName} = req.body;

  db.addRaidTeam(newTeamName)
  .then(response => res.status(200).json(response))
  .catch((err) => {
    console.error('Error creating new raid team: ', err)
    res.status(401).json(err);
  })

})

module.exports = router;
