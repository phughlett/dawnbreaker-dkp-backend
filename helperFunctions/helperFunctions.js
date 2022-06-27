

export function initStringParser(initString){
  let characterArray = [];
  let characterString = initString.slice(17)
  characterString = characterString.slice(0,characterString.length-16)
  characterArray = characterString.split(';')
  
  return characterArray
}

