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

  addCharacter: (name, raid_team) => {
    const dkp = 10;//initial balance for joining
    return knex('characters').insert({name, raid_team, dkp})
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

  addActiveSession: (name) => {
    return knex('active_sessions').insert({name})
  },

  deleteActiveSession: (name) => {
    return knex('active_sessions').where({name}).del()
  }

}

export default db;

