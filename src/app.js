const express = require('express');
const { sequelize } = require('./model');
const { getProfile, paramToInt, errorHandler, queryToDate } = require('./middleware');
const contractsController = require('./contracts/contract.controller');
const jobsController = require('./jobs/jobs.controller');
const balancesController = require('./balances/balances.controller');
const adminController = require('./admin/admin.controller');

const app = express();

app.use(express.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

app.get('/contracts/:id', getProfile, paramToInt('id'), contractsController.getById);
app.get('/contracts', getProfile, contractsController.getAll);

// TODO: pagination?
app.get('/jobs/unpaid', getProfile, jobsController.getAllUnpaid);
//TODO: only clients can access this endpoint
app.post('/jobs/:job_id/pay', getProfile, paramToInt('job_id'), jobsController.payJob);

// TODO: I don't think we need this userId here
app.post('/balances/deposit/:userId', getProfile, paramToInt('userId'), balancesController.deposit);

// TODO: security for these endpoints ???
app.get('/admin/best-profession', queryToDate('start', 'end'), adminController.findBestProfession);
app.get('/admin/best-clients', queryToDate('start', 'end'), adminController.findBestClients);

// Notice:
// lack of pattern for path param, snake_case and camelCase

app.use(errorHandler);

module.exports = app;
