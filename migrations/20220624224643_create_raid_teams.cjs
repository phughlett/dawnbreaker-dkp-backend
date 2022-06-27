/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {

  return knex.schema.createTable('raid_teams', (table) =>{
    table.increments('id').primary();
    table.string('name').notNullable().unique();
  })


};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {

  return knex.schema.dropTableIfExists('raid_teams');

};
