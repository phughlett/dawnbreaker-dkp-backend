const knex = require('./dbConnection');

module.exports = {
  //Raid Team

  getRaidTeams: () => {
    return knex('raid_teams').select();
  },

  //Characters

  getCharacters: () => {
    return knex('characters').select();
  },

  //Ledger

  getLedger: () => {
    return knex('ledger').select();
  },

}