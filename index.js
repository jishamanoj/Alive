require('dotenv').config()
const express = require('express')
const core = require('cors')
const bodyParser = require('body-parser')
const app = express();
app.use(bodyParser())
app.use(core())

app.use('/api/',require('./routes/routing'))

module.exports = app