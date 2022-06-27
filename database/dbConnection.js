import knex from "knex"
import knexfile from '../knexfile.js'

const myKnex = knex(knexfile[process.env.NODE_ENV] || knexfile.development)
export default myKnex;