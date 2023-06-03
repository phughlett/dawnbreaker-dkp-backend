import express from "express";
import db from "../database/controllers.js";
import {processLedgerUpdate, processLedgerDelete, processLedgerAdd} from "../core/ledgerManager.js"

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
  .post(async (req, res) => {
    let { update, action } = req.body;

    if(action === "UPDATE_ITEM"){
      console.log('Ledger UPDATE_ITEM',update)

      processLedgerUpdate(update)
      .then((response) => {
        res.status(200).json(response)
      })
      .catch((err) => {
        console.error(err)
        return res.status(500).json(err);
      })




    }else if(action === "DELETE_ITEM"){
      console.log('Ledger DELETE_ITEM',update)

      processLedgerDelete(update)
      .then((response) => {
        res.status(200).json(response)
      })
      .catch((err) => {
        console.error(err)
        return res.status(500).json(err);
      })

    }else if(action === "ADD_ITEM"){
      console.log('Ledger ADD_ITEM', update)

      processLedgerAdd(update)
      .then((response) => {
        res.status(200).json(response)
      })
      .catch((err) => {
        console.error(err)
        return res.status(500).json(err);
      })


    }else{
      res.status(406)
    }


  })
;

export default ledgerRoute;