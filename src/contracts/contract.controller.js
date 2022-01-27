const contractService = require('./contract.service');

async function getById(req, res) {
  const { Contract } = req.app.get('models');
  const { id } = req.params;
  const profile = req.profile;

  const contract = await contractService.getById({ id, profile, Contract });

  if (!contract) return res.status(404).end();

  res.json(contract);
}

async function getAll(req, res) {
  const { Contract } = req.app.get('models');
  const profile = req.profile;

  const contracts = await contractService.getAllNotTerminated({ profile, Contract });

  res.json(contracts);
}

module.exports = { getById, getAll };
