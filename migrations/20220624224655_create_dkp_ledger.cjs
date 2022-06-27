/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {

  return knex.schema.createTable('ledger', (table) =>{
    table.increments('id').primary();
    table.integer('raid_team').references('id').inTable('raid_teams')
    table.integer('character_name').references('id').inTable('characters').notNullable();
    table.string('item').notNullable();
    table.integer('dkp').notNullable();
    table.timestamps(true, true);
  })

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {

  return knex.schema.dropTableIfExists('ledger');

};
