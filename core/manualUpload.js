import fs from 'fs'

export default async function manualUpload(file){
  console.log(file)


  let data = fs.readFileSync(file.data, { encoding: 'utf8', flag: 'r' });


  // console.log(data)


}