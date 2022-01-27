const { Op } = require('sequelize');

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

function getFilterByProfileType(profile) {
  return profile.type === 'client' ? { ClientId: profile.id } : { ContractorId: profile.id };
}

module.exports = { getById, getAllNotTerminated };
