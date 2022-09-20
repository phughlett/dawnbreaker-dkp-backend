import express from "express";
import db from "../database/controllers.js";
import { initStringParser } from "../helperFunctions/helperFunctions.js";
import {
  createSession,
  stopSession,
  checkForNewCharacters,
  getAddonInitString,
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
      createSession(sessionName, characterArray);

      db.getCharacters()
        .then((response) => {
          let addonInit = response.map((raider) => {
            return `["${raider.name}"]="${raider.dkp}"`;
          });
          addonInit = addonInit.toString();
          addonInit = `{${addonInit}}`;
          return res.status(200).json(addonInit);
        })
        .catch((err) => console.error(err));
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
sessionRoute.route("/addonInit").get((req, res) => {
  db.getCharacters().then((response) => {
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

export default sessionRoute;
