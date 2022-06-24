/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {

  return knex.schema.createTable('characters', (table) =>{
    table.increments('id').primary();
    table.integer('raid_team').references('id').inTable('raid_teams');
    table.string('name').notNullable();
    table.integer('dkp').notNullable();
  })

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {

  return knex.schema.dropTableIfExists('characters');

};
