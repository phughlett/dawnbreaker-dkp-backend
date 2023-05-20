import app from './app.js';
import fs from 'fs'
import https from 'https'

const PORT = process.env.PORT || 8080;

// https
//   .createServer(
// 		// Provide the private and public key to the server by reading each
// 		// file's content with the readFileSync() method.
//     {
//       key: fs.readFileSync("/src/key/privkey.pem"),
//       cert: fs.readFileSync("/src/key/fullchain.pem"),
//     },
//     app
//   ).listen(PORT, () => {
//     console.log(`Server is listening on port ${PORT}`);
//   })

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
})

