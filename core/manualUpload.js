import db from "../database/controllers.js";

export default async function manualUpload(characterArray){
  // console.log(characterArray)

  for(let i = 0; i < characterArray.length; ++i){
    let currRow = characterArray[i];
    console.log('Adding: ',currRow)

    let raid_team = null;

    if (currRow.raid_team === "Weekday"){ raid_team = 1;}
    else if (currRow.raid_team === "Weekend"){raid_team = 2;}

    await db.addCharacter(currRow.name);
    await db.updateCharacter(currRow.name, raid_team, currRow.dkp, currRow.class, null)



  }





  // console.log(data)


}