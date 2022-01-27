const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model');
const { getProfile } = require('./middleware/getProfile');
const { parseId } = require('./middleware/parseId');
const contractsController = require('./contracts/contract.controller');
const app = express();

app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

app.get('/contracts/:id', getProfile, parseId, contractsController.getById);

// TODO: pagination?
app.get('/contracts', getProfile, contractsController.getAll);

// TODO: add error handler

module.exports = app;
