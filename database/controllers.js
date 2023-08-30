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

  getCharactersByRaid: (raid_team) => {
    return knex('characters').where({raid_team})
  },

  addCharacter: (name) => {
    const dkp = 10;//initial balance for joining
    return knex('characters').insert({name, dkp})
  },

  deleteCharacter: (name) => {
    return knex('characters').where({name}).del()
  },

  updateCharacter: (name, raid_team, dkp, characterClass, role) => {
    return knex('characters').where({name}).update({raid_team, dkp, characterClass, role});
  },

  adjustDKP: (name, amount) => {
    return knex('characters').where({name}).update({dkp: amount});
  },

  getCharactersWithDKP: () => {

    return knex('characters').where('dkp', '>', 0)

  },

  getUnassignedWithDKP: () => {
    return knex('characters').whereNot('dkp', '=', 0).andWhere('raid_team', null)
  },

  //Ledger

  getLedger: () => {
    return knex('ledger').select();
  },

  addLedgerTransaction: (raid_team, character_name, item, itemId, dkp)=> {
    return knex('ledger').insert({raid_team, character_name, item, itemId, dkp});
  },

  removeLedgerTransaction: (id) => {
    return knex('ledger').where({id}).del();
  },

  removeCharacterLedgerTransactions: (character_name) => {
    return knex('ledger').where({character_name}).del();
  },

  updateLedgerTransaction: (id, update) => {
    let {raid_team, character_name, item, itemId, dkp} = update
    let updated_at = new Date();
    return knex('ledger').where({id}).update({raid_team, character_name, item, itemId, dkp, updated_at})
  },

  getLedgerBetweenDates: (start, end) => {
    return knex('ledger').where('created_at', '<', start).andWhere('created_at', '>', end)
  },

  getLedgerEntryById: (id) => {
    return knex('ledger').where({id})
  },

  getLedgerDataForCharacter: (character_name) => {
    return knex('ledger').where({character_name})
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

  checkifCharacterInSession: (sessionName, character_id) => {
    return knex(`${sessionName}_ledger`).select().where({character_id});
  },

  getSessionLedger: (sessionName) => {
    return knex(`${sessionName}_ledger`).select();
  },

  insertSessionLedger: (sessionName, raid_team, character_id, item, itemId, dkp ) => {
    return knex(`${sessionName}_ledger`).insert({raid_team, character_id, item, itemId, dkp})
  },

  updateSessionLedger: (sessionName, id, raid_team, character_id, item, itemId, dkp) => {
    let updated_at = new Date()
    return knex(`${sessionName}_ledger`).where({id}).update({raid_team, character_id, item, itemId, dkp, updated_at})
  },

  deleteSessionLedgerEntry: (sessionName, id) => {
    return knex(`${sessionName}_ledger`).where({id}).del()
  }

}

export default db;

