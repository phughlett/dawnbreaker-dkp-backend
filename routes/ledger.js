import express from "express";
import db from "../database/controllers.js";

const ledgerRoute = express.Router();

ledgerRoute
  .route("/")
  .get((req, res) => {
    db.getLedger()
      .then((response) => res.status(200).json(response))
      .catch((err) => {
        console.error("Error @ /Ledger GET", err);
        res.status(400).json(err);
      });
  })
;

export default ledgerRoute;