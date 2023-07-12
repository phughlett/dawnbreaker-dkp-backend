import db from "../database/controllers.js";


export async function dkpDecay() {
  const DKP_DECAY = 21;
  let today = new Date();
  let decay = getDateDifference(today, DKP_DECAY);
  console.log('Today: ', today)
  console.log('Decay Date',decay)

  //Get the characters and filter out those who are at 0
  let characters = await db.getCharacters();
  let charactersWithDKP = characters.filter(char => char.dkp > 0)

  //Get the last 21 days of ledger and filter out DKP decay to determine who has raided in the past 3 weeks
  let ledgerCheck = await db.getLedgerBetweenDates(today, decay)
  ledgerCheck = ledgerCheck.filter(entry => entry.item !== "DKP Decay")

  //Finds the raiders with dkp who do not appear on the ledger
  let decayList = operation(charactersWithDKP, ledgerCheck)

  for(let i = 0; i < decayList.length; ++i){
    let decayAmount = 20//standard is 20, will change person has < 20 to get them to 0
    let char = decayList[i];

    console.log('DKP Decaying: ', char.name);

    if(char.dkp < 20){
      decayAmount = char.dkp;
    }

    let dkpDecayAmount = char.dkp - decayAmount;

    if(dkpDecayAmount < 0){
      dkpDecayAmount = 0;
    }

    await db.adjustDKP(char.name, dkpDecayAmount);
    await db.addLedgerTransaction(char.raid_team, char.id, "DKP Decay", 0, -decayAmount)
  }


}


function getDateDifference(startDate,numberOfDays ) {
  let result = new Date(startDate);
  result.setDate(result.getDate() - numberOfDays)
  return result
}

const operation = (list1, list2, isUnion = false) =>
    list1.filter(
        (set => a => isUnion === set.has(a.id))(new Set(list2.map(b => b.character_name)))
    );

// Following functions are to be used:
// const inBoth = (list1, list2) => operation(list1, list2, true),
//       inFirstOnly = operation,
//       inSecondOnly = (list1, list2) => inFirstOnly(list2, list1);


export async function dkpSquish(squishAmount = 85){

  let squishPercentage = squishAmount / 100

  let charsWithDkp = await db.getCharactersWithDKP()

  for(let i = 0; i < charsWithDkp.length; ++i){
    let char = charsWithDkp[i];
    let dkpSquishTotal = (Math.ceil(char.dkp * squishPercentage)) - 10;

    let newCharDkp = char.dkp - dkpSquishTotal
    await db.addLedgerTransaction(char.raid_team, char.id, `DKP Squish ${squishAmount}% + 10`, 0, -dkpSquishTotal)
    await db.adjustDKP(char.name, newCharDkp)
  }

  return db.getCharacters()


}

export async function oldCharacterRemoval(){
  const CHARACTER_DECAY = 60;

  let today = new Date();
  let charDecayDate = getDateDifference(today, CHARACTER_DECAY);
  console.log('Today: ', today)
  console.log('Character Decay Date: ',charDecayDate)

  let characters = await db.getCharacters();
  let ledgerCheck = await db.getLedgerBetweenDates(today, charDecayDate)

  //Finds the raiders who do not appear on the ledger within the past 60 days
  let charDecayList = operation(characters, ledgerCheck)

  for(let i = 0; i < charDecayList.length; ++i){
    let decayChar = charDecayList[i]
    console.log('Deleting char: ', decayChar)
    await db.removeCharacterLedgerTransactions(decayChar.id)
    await db.deleteCharacter(decayChar.name)
  }

}
