const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(bodyParser())
app.use(cors())

app.use('/auth',require('../controller/authController'));
app.use('/user',require('../controller/insert'));
app.use('/search',require('../controller/search'));
app.use('/report',require('../controller/report'));
module.exports = app;