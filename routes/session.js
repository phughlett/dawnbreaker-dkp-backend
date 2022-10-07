import express from "express";
import db from "../database/controllers.js";
import { initStringParser } from "../helperFunctions/helperFunctions.js";
import {
  createSession,
  stopSession,
  checkForNewCharacters,
  addItemBidtoRaidLedger,
  updateSessionLedger,
  deleteSessionLedgerEntry
} from "../core/sessionManager.js";

const sessionRoute = express.Router();

sessionRoute
  .route("/")
  .get((req, res) => {
    db.getAllActiveSessions()
      .then((response) => res.status(200).json(response))
      .catch((err) => console.log(err));
  })
  .post(async (req, res) => {
    console.log(req.body);
    let { sessionData, action, sessionName } = req.body;

    if (action === "CREATE") {
      //validate string
      let sessionInit = sessionData.slice(0, 17);
      if (!sessionData) {
        return res.status(406).json("No Session Data");
      } else if (sessionInit !== "beginSessionInit:") {
        return res.status(406).json("Improper Session String");
      }
      //Create a table to hold the session data
      let characterArray = initStringParser(sessionData);
      await createSession(sessionName, characterArray);

      let activeSessions = await db.getAllActiveSessions();

      res.status(200).json(activeSessions);


    } else if (action === "UPDATE") {
      //Update Session table based on Master Looter input
    } else if (action === "CLOSE") {
      //Closing a session will process the session table data and update the ledger + character dkp and close the table
      stopSession(sessionName)
        .then(() => db.deleteActiveSession(sessionName))
        .catch((err) => console.error(err));
    } else if (action === "ADD_ITEM") {
      let { character, itemId, itemName, dkpAmount, sessionName } = req.body;
      addItemBidtoRaidLedger(
        character,
        itemId,
        itemName,
        dkpAmount,
        sessionName
      )
        .then((response) => {
          res.status(200).json(response);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json(error);
        });
    }else if(action === "REMOVE_ITEM"){

    } else {
      return res.status(406).send("Invalid format.");
    }
  });
sessionRoute.route("/addonInit").get((req, res) => {
  db.getCharacters()
    .then((response) => {
      let addonInit = response.map((raider) => {
        return `["${raider.name}"]="${raider.dkp}"`;
      });
      addonInit = addonInit.toString();
      addonInit = `{${addonInit}}`;
      return res.status(200).json(addonInit);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json(err);
    });
});
sessionRoute
  .route("/:id")
  .get(async (req, res) => {
    let { id } = req.params;

    let session = await db.getActiveSessionByID(id);

    if(session.length === 0){
      return res.status(400).json("ID doesn't exist.")
    }

    let sessionName = session[0].name;

    let sessionLedger = await db.getSessionLedger(sessionName);

    let response = {sessionLedger, sessionName}
    res.status(200).json(response);

  })
  .post(async(req, res) => {
    console.log(req.body)
    let {sessionId, update, action} = (req.body);
    if(action === 'DELETE_ITEM'){
      let updatedSession = await deleteSessionLedgerEntry(sessionId, update);
      return res.status(200).json(updatedSession);

    }if(action === 'ADD_BENCH'){

    }else{
      updateSessionLedger(sessionId, update);
      res.status(200).json('Success!')
    }

  });

export default sessionRoute;
