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

// Contracts endpoints
app.get('/contracts/:id', getProfile, paramToInt('id'), contractsController.getById);
app.get('/contracts', getProfile, contractsController.getAll);

// Jobs endpoints
// Thought: it would be good to add pagination here
app.get('/jobs/unpaid', getProfile, jobsController.getAllUnpaid);
app.post('/jobs/:job_id/pay', getProfile, paramToInt('job_id'), jobsController.payJob);

// Balances endpoints
// Thought: I don't think we need this userId here, the "logged" user would be enough
app.post('/balances/deposit/:userId', getProfile, paramToInt('userId'), balancesController.deposit);

// Admin endpoints
// Thought: What would be the security for these endpoints since we don't have admin profile
app.get('/admin/best-profession', queryToDate('start', 'end'), adminController.findBestProfession);
app.get('/admin/best-clients', queryToDate('start', 'end'), adminController.findBestClients);

app.use(errorHandler);

module.exports = app;
