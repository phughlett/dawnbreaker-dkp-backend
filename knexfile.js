// Update with your config settings.
require('dotenv').config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'postgresql',
    connection: process.env.CONNECTION_STRING
  },

  staging: {

  },

  production: {

  }

};
