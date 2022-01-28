const { ProfileTypes } = require('./constants');

function getFilterByProfileType(profile) {
  return profile.type === ProfileTypes.CLIENT
    ? { ClientId: profile.id }
    : { ContractorId: profile.id };
}

module.exports = { getFilterByProfileType };
