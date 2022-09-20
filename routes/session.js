import express from "express";
import db from "../database/controllers.js";
import { initStringParser } from "../helperFunctions/helperFunctions.js";
import {
  createSession,
  stopSession,
  checkForNewCharacters,
} from "../core/sessionManager.js";

const sessionRoute = express.Router();

sessionRoute
  .route("/")
  .get((req, res) => {
    //ToDo
    //Likely there will only be one session at a time but we could support multiple by creating the tables with unique hashes
  })
  .post((req, res) => {
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
      createSession(sessionName, characterArray)

    } else if (action === "UPDATE") {
      //Update Session table based on Master Looter input
    } else if (action === "CLOSE") {
      //Closing a session will process the session table data and update the ledger + character dkp and close the table
      stopSession(sessionName)
        .then(() => db.deleteActiveSession(sessionName))
        .catch((err) => console.error(err));
    } else {
      return res.status(406).send("Invalid format.");
    }
  });

export default sessionRoute;
