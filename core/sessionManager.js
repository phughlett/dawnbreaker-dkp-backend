import knex from '../database/dbConnection.js';

export async function createSession(sessionName){

  return knex.schema.createTable(sessionName, (table) =>{
    table.increments('id').primary();
    table.integer('raid_team').references('id').inTable('raid_teams')
    table.integer('character_name').references('id').inTable('characters').notNullable();
    table.string('item').notNullable();
    table.integer('dkp').notNullable();
    table.timestamps(true, true);
  })
}

export async function stopSession(sessionName){
  return knex.schema.dropTableIfExists(sessionName)
}