import knex from "../database/dbConnection.js";
import db from "../database/controllers.js";

export async function createSession(sessionName, sessionData) {
  await knex.schema.createTable(`${sessionName}_characters`, (table) => {
    table.increments("id").primary();
    table.integer("raid_team").references("id").inTable("raid_teams");
    table.string("character_name");
    table.timestamps(true, true);
  });

  await knex.schema.createTable(`${sessionName}_ledger`, (table) => {
    table.increments("id").primary();
    table.integer("raid_team").references("id").inTable("raid_teams");
    table.integer("character_id").references('id').inTable(`${sessionName}_characters`);
    table.string("item").notNullable();
    table.integer("dkp").notNullable();
    table.timestamps(true, true);
  });

  await db.addActiveSession(sessionName);
  let seedData = await checkForNewCharacters(sessionData);

  seedData = await db.getCharactersByName(sessionData)

  //add session raiders to session table
  await seedData.forEach((row) => {
    db.updateSessionCharacters(
      sessionName,
      row.raid_team,
      row.name
    )
      .catch((err) => console.error(err));
  });
}

export async function stopSession(sessionName) {
  await knex.schema.dropTableIfExists(`${sessionName}_ledger`);
  await knex.schema.dropTableIfExists(`${sessionName}_characters`);
}

export async function checkForNewCharacters(sessionData) {
  console.log("Checking for New Characters...");
  let characterList = [];
  characterList = await db.getCharacters();

  //check for new raiders and add them to the database if they aren't found
  sessionData.forEach((character) => {
    let matchedName = characterList.filter((match) => {
      return match.name === character;
    });

    if (matchedName.length === 0) {
      db.addCharacter(character)
        .then(() => console.log("Added new character: ", character))
        .catch((err) =>
          console.error(
            "Error adding character while initiating session: ",
            err
          )
        );
    }
  });
  console.log("New Character Check Complete.");

  characterList = await db.getCharacters();
  return characterList;
}
