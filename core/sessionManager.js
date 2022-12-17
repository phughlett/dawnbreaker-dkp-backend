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

export async function processSession(sessionName) {

  let ledgerUpdate = await db.getSessionLedger(sessionName);

  ledgerUpdate.sort((a,b) => {
    return b.id - a.id;
  })

  ledgerUpdate.forEach(async (entry) => {
    await db.addLedgerTransaction(entry.raid_team, entry.character_id, entry.item, entry.itemId, entry.dkp)
  })

  let dkpUpdate = ledgerUpdate.filter((entry) => entry.itemId === '0');


  for(let i = 0; i< dkpUpdate.length; ++i){
    let entry = dkpUpdate[i]
    let character = await db.getCharacterById(entry.id);
    character = character[0];
    let dkpAdjust = parseInt(entry.dkp);
    console.log(character)
    dkpAdjust = character.dkp + dkpAdjust;
    await db.adjustDKP(character.name, dkpAdjust);
  }

  await knex.schema.dropTableIfExists(`${sessionName}_ledger`);
}

export async function cancelSession(sessionName){
  await knex.schema.dropTableIfExists(`${sessionName}_ledger`);

}

export async function checkForNewCharacters(sessionData) {

  if(typeof sessionData === 'string'){
    sessionData = [sessionData]
  }
  console.log("Checking for New Characters...");
  let characterList = [];
  characterList = await db.getCharacters();

  for(let i = 0; i< sessionData.length; ++i){
    let character = sessionData[i];
    let matchedName = characterList.filter((match) => match.name === character)
    if(matchedName.length === 0){
      await db.addCharacter(character)
      console.log("Added new character: ", character)
    }

  }

  console.log("New Character Check Complete.")




  return db.getCharacters();

}

export async function addCharacterToSession(sessionName, character){
  const databaseCharacterCheck = await db.getCharactersByName(character)

  if(databaseCharacterCheck.length === 0){
    let characterList = await checkForNewCharacters(character);
  }

  character = await db.getCharactersByName(character);
  character = character[0]
  console.log(character)



  let sessionCharacterCheck = await db.checkifCharacterInSession(sessionName, character.id)
  if(sessionCharacterCheck.length > 0) throw 'Character already in Session!'

  await db.insertSessionLedger(sessionName, character.raid_team, character.id, 'Attendance DKP', '0', 10).catch(err => console.error(err))

  return db.getSessionLedger(sessionName);
}


export async function addItemBidtoRaidLedger(charName, itemId, itemName, dkpAmount, sessionName) {
  let character = await db.getCharactersByName(charName)
  if (character.length === 0) throw 'Character does not exist!'
  character = character[0]

  let charId = character.id;
  const sessionChars = await db.checkifCharacterInSession(sessionName, charId);
  if(sessionChars.length === 0) throw 'Character not in session!'


  let dkpSpent = parseInt(dkpAmount)
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
  //TODO update character DKP
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

