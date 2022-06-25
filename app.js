const express = require("express")
const morgan = require("morgan")
const cors = require('cors')
const app = express()

//routes
const raidTeamsRoute = require('./routes/raidTeam')
const characterRoute = require('./routes/characters')

app.use(express.json());
app.use(morgan('tiny'));
app.use('/raidteam', raidTeamsRoute);
app.use('/character', characterRoute);


app.get('/', (req, res) => {
  res.status(200).send('Dawnbreaker DKP')
})


module.exports = app;