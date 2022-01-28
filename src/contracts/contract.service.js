const { Op } = require('sequelize');
const { getFilterByProfileType } = require('../utils/database');

async function getById({ profile, Contract, id }) {
  const profileFilter = getFilterByProfileType(profile);
  const contract = await Contract.findOne({ where: { id, ...profileFilter } });

  return contract;
}

async function getAllNotTerminated({ profile, Contract }) {
  const profileFilter = getFilterByProfileType(profile);

  const contracts = await Contract.findAll({
    where: { ...profileFilter, [Op.not]: { status: 'terminated' } },
  });

  return contracts;
}

module.exports = { getById, getAllNotTerminated };
