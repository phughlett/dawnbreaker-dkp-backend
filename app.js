import express from 'express';
import morgan from 'morgan';
import cors from 'cors'
import cookieParser from 'cookie-parser'
const fs = require("fs");
const https = require("https");


const app = express()


https
  .createServer(
		// Provide the private and public key to the server by reading each
		// file's content with the readFileSync() method.
    {
      key: fs.readFileSync("/src/key/privkey.pem"),
      cert: fs.readFileSync("/src/key/fullchain.pem"),
    },
    app
  )

//routes
import raidTeamRoute from './routes/raidTeam.js'
import characterRoute from './routes/characters.js'
import sessionRoute from './routes/session.js'
import ledgerRoute from './routes/ledger.js'


app.use(cors())
app.use(express.json());
app.use(cookieParser())
app.use(morgan('tiny'));
app.use('/raidteam', raidTeamRoute);
app.use('/characters', characterRoute);
app.use('/session', sessionRoute);
app.use('/ledger', ledgerRoute);


app.get('/', (req, res) => {
  res.status(200).send('Dawnbreaker DKP')
})


export default app;