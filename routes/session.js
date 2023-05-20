import express from "express";
import db from "../database/controllers.js";
import { initStringParser } from "../helperFunctions/helperFunctions.js";
import {
  createSession,
  processSession,
  checkForNewCharacters,
  addItemBidtoRaidLedger,
  updateSessionLedger,
  deleteSessionLedgerEntry,
  addCharacterToSession,
  cancelSession,
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
    let { sessionData, action, sessionName, character } = req.body;
    if (action === "CREATE") {
      //validate string
      if (Object.keys(sessionData).length === 0) {
        return res.status(406).json("No Session Data");
      }
      let sessionInit = sessionData.slice(0, 17);
      if (sessionInit !== "beginSessionInit:") {
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
      processSession(sessionName)
        .then((response) => {
          res.status(200).json(response);
        })
        .catch((err) => console.error(err));
    } else if (action === "CANCEL") {
      cancelSession(sessionName)
        .then((response) => {
          res.status(200).json(response);
        })
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
        .catch(async (err) => {
          let currentSession = await db.getSessionLedger(sessionName);

          let error = {};
          error.data = currentSession;
          error.message = err;
          res.status(400).json(error);
        });
    } else if (action === "REMOVE_ITEM") {
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
  .route("/:sessionId")
  .get(async (req, res) => {
    let { sessionId } = req.params;

    let session = await db.getActiveSessionByID(sessionId);

    if (session.length === 0) {
      return res.status(400).json("ID doesn't exist.");
    }

    let sessionName = session[0].name;

    let sessionLedger = await db.getSessionLedger(sessionName);

    let response = { sessionLedger, sessionName };
    res.status(200).json(response);
  })
  .post(async (req, res) => {
    let { sessionId } = req.params;

    console.log(req.body);
    let { action } = req.body;
    if (action === "DELETE_ITEM") {
      let { update } = req.body;
      let updatedSession = await deleteSessionLedgerEntry(sessionId, update);
      return res.status(200).json(updatedSession);
    }
    if (action === "ADD_BENCH") {
    } else if (action === "ADD_CHARACTER") {
      let { character, session } = req.body;
      addCharacterToSession(session, character)
        .then((response) => {
          res.status(200).json(response);
        })
        .catch(async (err) => {
          let currentSession = await db.getSessionLedger(session);

          let error = {};
          error.data = currentSession;
          error.message = err;
          res.status(400).json(error);
        });
    } else {
      let { update } = req.body;
      await updateSessionLedger(sessionId, update);
      //TODO needs to return the updated session
      res.status(200).json("Success!");
    }
  });

export default sessionRoute;
