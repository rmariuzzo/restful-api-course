'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const server = express();

const db = require('../database');

server.use(bodyParser.json());
server.use((request, response, next) => {
    db.instance.read();
    response.header('Access-Control-Allow-Origin', '*');
    next();
});

module.exports = server;