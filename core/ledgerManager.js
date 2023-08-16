import db from "../database/controllers.js";


export async function processLedgerUpdate(update){

  let character = await db.getCharacterById(update.character_name)
  let originalEntry = await db.getLedgerEntryById(update.id)
  character = character[0]
  originalEntry = originalEntry[0]

  let dkpDiff = originalEntry.dkp - update.dkp
  if(update.itemId === 0){
    dkpDiff = dkpDiff*-1//if it is for DKP award the character gets more dkp
  }

  let newCharacterDKP =  (character.dkp + dkpDiff)
  if(newCharacterDKP > 250){
    newCharacterDKP = 250
  }
  await db.adjustDKP(character.name, newCharacterDKP)//change dkp to new amount


  await db.updateLedgerTransaction(update.id, update)
  return db.getLedger()
}

export async function processLedgerDelete(update){

  let character = await db.getCharacterById(update.character_name)
  character = character[0]
  let newCharacterDKP =  (character.dkp + (update.dkp*-1))//reverse the effect of the entry
  if(newCharacterDKP > 250){
    newCharacterDKP = 250
  }


  await db.adjustDKP(character.name, newCharacterDKP)//change dkp to new amount
  await db.removeLedgerTransaction(update.id)
  return db.getLedger()
}

export async function processLedgerAdd(update){

  let character = await db.getCharacterById(update.character_name)
  if (character.length === 0) throw "Character does not exist!";

  character = character[0]

  if (update.raid_team === ''){
    update.raid_team = null
  }

  let newCharacterDKP =  (character.dkp + parseInt(update.dkp))
  if(newCharacterDKP > 250){
    newCharacterDKP = 250
  }
  await db.adjustDKP(character.name, newCharacterDKP)//change dkp to new amount


  await db.addLedgerTransaction(update.raid_team, update.character_name, update.item, update.itemId, update.dkp)
  return db.getLedger()
}

export async function getCharacterLedger(charName){

  let character = await db.getCharactersByName(charName)

  if (character.length === 0) throw "Character does not exist!";

  character = character[0]

  return db.getLedgerDataForCharacter(character.id)

}
