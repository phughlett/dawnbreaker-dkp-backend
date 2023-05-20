import express from "express";
import db from "../database/controllers.js";
import manualUpload from "../core/manualUpload.js"


const characterRoute = express.Router();

characterRoute
  .route("/")
  .get((req, res) => {
    db.getCharacters()
      .then((response) => res.status(200).json(response))
      .catch((err) => {
        console.error("Error @ /characters GET", err);
        res.status(400).json(err);
      });
  })
  .post((req, res) => {
    let { name, raidTeam } = req.body;

    db.addCharacter(name, raidTeam)
      .then((response) => res.status(200).json(response))
      .catch((err) => {
        console.error("Error creating new raid team: ", err);
        res.status(401).json(err);
      });
  });

  characterRoute
  .route("/:characterName")
  .get((req,res) => {

  })
  .patch(async(req, res)=> {
    console.log(req.body.update)
    let {raid_team, name, dkp, characterClass, role} = req.body.update;

    await db.updateCharacter(name, raid_team, dkp, characterClass, role);

    let updatedCharacters = await db.getCharacters

    res.status(200).json(updatedCharacters)

  });

  characterRoute
  .route("/manual")
  .get((req,res) => {

  })
  .post(async(req, res)=> {
    await manualUpload(req.body)
    res.status(200).json('hi')
  });

  characterRoute
  .route("/team/:raid_team")
  .get((req,res) => {
    let { raid_team } = req.params;

    db.getCharactersByRaid(raid_team)
    .then((response) => res.status(200).json(response))
    .catch((err) => {
      console.error("Error @ /characters/team/:raid_team GET", err);
      res.status(400).json(err);
    });
  })



export default characterRoute;
