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
    if(typeof namesArray === 'string'){
      return knex('characters').where('name', namesArray)
    }
    return knex('characters').whereIn('name', namesArray)
  },

  getCharacterById: (id) => {
    return knex('characters').where({id})
  },

  addCharacter: (name) => {
    const dkp = 10;//initial balance for joining
    return knex('characters').insert({name, dkp})
  },

  updateCharacterRaidTeam: (name, raid_team) => {
    return knex('characters').where({name}).update({raid_team});
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

  addLedgerTransaction: (raid_team, character_name, item, itemId, dkp)=> {
    return knex('ledger').insert({raid_team, character_name, item, itemId, dkp});
  },

  removeLedgerTransaction: (id) => {
    return knex('ledger').where({id}).del();
  },

  //Active Sessions

  getAllActiveSessions:() => {
    return knex('active_sessions').select();
  },

  getActiveSessionByID:(id) => {
    return knex('active_sessions').where({id}).select();
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

  insertSessionLedger: (sessionName, raid_team, character_id, item, itemId, dkp ) => {
    return knex(`${sessionName}_ledger`).insert({raid_team, character_id, item, itemId, dkp})
  },

  updateSessionLedger: (sessionName, id, raid_team, character_id, item, itemId, dkp) => {
    return knex(`${sessionName}_ledger`).where({id}).update({raid_team, character_id, item, itemId, dkp})
  },

  deleteSessionLedgerEntry: (sessionName, id) => {
    return knex(`${sessionName}_ledger`).where({id}).del()
  }

}

export default db;

