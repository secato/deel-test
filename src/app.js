const express = require('express');
const bodyParser = require('body-parser');
const { isHttpError } = require('http-errors');

const { sequelize } = require('./model');
const { getProfile } = require('./middleware/getProfile');
const { paramToInt } = require('./middleware/paramToInt');
const contractsController = require('./contracts/contract.controller');
const jobsController = require('./jobs/jobs.controller');

const app = express();

app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

app.get('/contracts/:id', getProfile, paramToInt('id'), contractsController.getById);
app.get('/contracts', getProfile, contractsController.getAll);

// TODO: pagination?
app.get('/jobs/unpaid', getProfile, jobsController.getAllUnpaid);
app.post('/jobs/:job_id/pay', getProfile, paramToInt('job_id'), jobsController.payJob);

// TODO: add error handler
app.use((error, req, res, next) => {
  if (isHttpError(error)) {
    const { status, message } = error;
    return res.status(status).json({ error: message });
  }

  console.error(error);
  res.status(500).json({ error: 'oh no' });
});
module.exports = app;
