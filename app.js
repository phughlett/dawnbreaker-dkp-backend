import express from 'express';
import morgan from 'morgan';
import cors from 'cors'
import cookieParser from 'cookie-parser'
import upload from 'express-fileupload'



const app = express()




//routes
import raidTeamRoute from './routes/raidTeam.js'
import characterRoute from './routes/characters.js'
import sessionRoute from './routes/session.js'
import ledgerRoute from './routes/ledger.js'


app.use(cors())
app.use(express.json());
app.use(cookieParser());
app.use(upload());
app.use(morgan('tiny'));
app.use('/raidteam', raidTeamRoute);
app.use('/characters', characterRoute);
app.use('/session', sessionRoute);
app.use('/ledger', ledgerRoute);


app.get('/', (req, res) => {
  res.status(200).send('Dawnbreaker DKP')
})


export default app;