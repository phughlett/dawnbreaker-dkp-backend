import knex from './dbConnection.js';

const db = {
    //Raid Team
  getRaidTeams: () => {
    return knex('raid_teams').select();
  },

  addRaidTeam: (name) => {
    return knex('raid_teams').insert({name});
  },

  //Characters

  getCharacters: () => {
    return knex('characters').select();
  },

  getCharactersByName: (namesArray) => {
    return knex('characters').whereIn('name', namesArray)
  },

  addCharacter: (name) => {
    const dkp = 10;//initial balance for joining
    return knex('characters').insert({name, dkp})
  },

  adjustDKP: (name, amount) => {
    return knex('characters').where({name}).update({dkp: amount});
  },

  //Ledger

  getLedger: () => {
    return knex('ledger').select();
  },

  getLedgerByRaidTeam: (raid_team) => {
    return knex('ledger').where({raid_team}).select();
  },

  addTransaction: (raid_team, character_name, item, dkp)=> {
    return knex('ledger').insert({raid_team, character_name, item, dkp});
  },

  removeTransaction: (id) => {
    return knex('ledger').where({id}).del();
  },

  //Active Sessions

  getAllActiveSessions:() => {
    return knex('active_sessions').select();
  },

  addActiveSession: (name) => {
    return knex('active_sessions').insert({name})
  },

  deleteActiveSession: (name) => {
    return knex('active_sessions').where({name}).del()
  },

  getSessionCharacters: (sessionName) => {
    return knex(`${sessionName}_characters`).select();
  },

  getSessionLedger: (sessionName) => {
    return knex(`${sessionName}_ledger`).select();
  },

  updateSessionCharacters: (sessionName, raid_team, character_name) => {

    return knex(`${sessionName}_characters`).insert({raid_team, character_name})

  },

  updateSessionLedger: (sessionName, raid_team, character_id, item, dkp ) => {

    return knex(`${sessionName}_ledger`).insert({raid_team, character_name, item, dkp})
  }

}

export default db;

