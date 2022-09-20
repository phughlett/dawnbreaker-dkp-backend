import express from 'express';
import morgan from 'morgan';
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app = express()


//routes
import raidTeamRoute from './routes/raidTeam.js'
import characterRoute from './routes/characters.js'
import sessionRoute from './routes/session.js'


app.use(cors())
app.use(express.json());
app.use(cookieParser())
app.use(morgan('tiny'));
app.use('/raidteam', raidTeamRoute);
app.use('/character', characterRoute);
app.use('/session', sessionRoute);


app.get('/', (req, res) => {
  res.status(200).send('Dawnbreaker DKP')
})


export default app;