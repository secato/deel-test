const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model');
const { getProfile } = require('./middleware/getProfile');
const { parseId } = require('./middleware/parseId');
const contractsController = require('./contracts/contract.controller');
const jobsController = require('./jobs/jobs.controller');
const app = express();

app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

app.get('/contracts/:id', getProfile, parseId, contractsController.getById);

// TODO: pagination?
app.get('/contracts', getProfile, contractsController.getAll);

app.get('/jobs/unpaid', getProfile, jobsController.getAllUnpaid);

// TODO: add error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'oh no' });
});
module.exports = app;
