// Update with your config settings.
import 'dotenv/config';

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const knexfile = {

  development: {
    client: 'postgresql',
    connection: process.env.CONNECTION
  },

  staging: {
    client: 'postgresql',
    connection: process.env.CONNECTION
  },

  production: {

  }

};

export default knexfile;


