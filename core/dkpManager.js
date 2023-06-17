import db from "../database/controllers.js";


export async function dkpDecay() {
  let today = new Date();
  let decay = getDecayDay(today);
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


function getDecayDay(date) {
  const DKP_DECAY_LENGTH = 21;


  let result = new Date(date);
  result.setDate(result.getDate() - DKP_DECAY_LENGTH)
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
    let dkpSquishTotal = Math.ceil(char.dkp * squishPercentage);

    let newCharDkp = char.dkp - dkpSquishTotal
    await db.addLedgerTransaction(char.raid_team, char.id, `DKP Squish ${squishAmount}%`, 0, -dkpSquishTotal)
    await db.adjustDKP(char.name, newCharDkp)
  }

  return db.getCharacters()


}