// Update with your config settings.
import 'dotenv/config';

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const knexfile = {

  development: {
    client: 'postgresql',
    connection: process.env.CONNECTION_STRING
  },

  staging: {

  },

  production: {

  }

};

export default knexfile;


