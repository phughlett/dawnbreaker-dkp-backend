import knex from "knex"
import knexfile from '../knexfile.js'

const envrionment = process.env.NODE_ENV || 'development';
const config = knexfile[envrionment]

const myKnex = knex(config)
export default myKnex;