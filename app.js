const express = require("express")
const morgan = require("morgan")
const cors = require('cors')
const app = express()

//routes
const raidTeams = require('./routes/raidTeam')

app.use(express.json());
app.use(morgan('tiny'));
app.use("/raidteam", raidTeams);


app.get('/', (req, res) => {
  res.status(200).send('Dawnbreaker DKP')
})


module.exports = app;