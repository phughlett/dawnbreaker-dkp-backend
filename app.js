import express from 'express';
import morgan from 'morgan';
import cors from 'cors'
const app = express()


//routes
import raidTeamRoute from './routes/raidTeam.js'
import characterRoute from './routes/characters.js'
import sessionRoute from './routes/session.js'
// const raidTeamsRoute = require('./routes/raidTeam')
// const characterRoute = require('./routes/characters')
// const sessionRoute = require('./routes/session')

app.use(cors())
app.use(express.json());
app.use(morgan('tiny'));
app.use('/raidteam', raidTeamRoute);
app.use('/character', characterRoute);
app.use('/session', sessionRoute);


app.get('/', (req, res) => {
  res.status(200).send('Dawnbreaker DKP')
})


export default app;