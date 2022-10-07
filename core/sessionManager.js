import knex from "../database/dbConnection.js";
import db from "../database/controllers.js";

export async function createSession(sessionName, sessionData) {

  await knex.schema.createTable(`${sessionName}_ledger`, (table) => {
    table.increments("id").primary();
    table.integer("raid_team").references("id").inTable("raid_teams");
    table.integer("character_id").references("id").inTable(`characters`);
    table.string("item").notNullable();
    table.string("itemId").notNullable();
    table.integer("dkp").notNullable();
    table.timestamps(true, true);
  });

  await db.addActiveSession(sessionName);
  let seedData = await checkForNewCharacters(sessionData);

  seedData = await db.getCharactersByName(sessionData);

  //add session raiders to session table
  await seedData.forEach((row) => {
    db.insertSessionLedger(sessionName, row.raid_team, row.id, 'Attendance DKP', '0', 10).catch(
      (err) => console.error(err)
    );
  });
}

export async function stopSession(sessionName) {

  let ledgerUpdate = await db.getSessionLedger(sessionName);

  ledgerUpdate.sort((a,b) => {
    return b.id - a.id;
  })

  ledgerUpdate.forEach(async (entry) => {
    await db.addLedgerTransaction(entry.raid_team, entry.character_id, entry.item, entry.itemId, entry.dkp)
  })

  let dkpUpdate = ledgerUpdate.filter((entry) => entry.itemId === '0');

  dkpUpdate.forEach(async (entry) => {
    let character = await db.getCharacterById(entry.id);
    character = character[0];
    let dkpAdjust = parseInt(entry.dkp);
    dkpAdjust = character.dkp + dkpAdjust;
    await db.adjustDKP(character.name, dkpAdjust);
  })
  await knex.schema.dropTableIfExists(`${sessionName}_ledger`);
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

export async function addItemBidtoRaidLedger(charName, itemId, itemName, dkpAmount, sessionName) {
  let dkpSpent = parseInt(dkpAmount)
  let character = await db.getCharactersByName(charName)
  character = character[0]
  let newdkpAmount = character.dkp + dkpSpent
  if(newdkpAmount > 250){
    newdkpAmount = 250;
  }
  let update = await db.insertSessionLedger(sessionName, character.raid_team, character.id, itemName, itemId, dkpAmount)
  await db.adjustDKP(charName, newdkpAmount);

  return db.getSessionLedger(sessionName);

}

export async function removeTransactionFromRaidLedger(id, sessionName){

}

export async function updateSessionLedger(sessionId, update){
  let {id, raid_team, character_id, item, itemId, dkp} = update;
  let session = await db.getActiveSessionByID(sessionId);
  session = session[0];
  return await db.updateSessionLedger(session.name, id, raid_team, character_id, item, itemId, dkp);
}

export async function deleteSessionLedgerEntry(sessionId, update){
  let {id, raid_team, character_id, item, itemId, dkp} = update;
  let session = await db.getActiveSessionByID(sessionId);
  session = session[0];

  await db.deleteSessionLedgerEntry(session.name, id);

  if(itemId !== '0'){
    dkp = parseInt(dkp);
    dkp = dkp * -1;
    console.log(dkp);
    let character = await db.getCharacterById(character_id);
    character = character[0];
    let newdkpAmount = character.dkp + dkp;


    await db.adjustDKP(character.name, newdkpAmount);

    return await db.getSessionLedger(session.name);

  }

  return await db.getSessionLedger(session.name);


}

