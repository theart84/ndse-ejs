const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routeCounter = require('./routes/counter')

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/counter', routeCounter)

module.exports = app;
