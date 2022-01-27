async function getAllUnpaidJobs({ profile, Contract, Job }) {
  const profileFilter = getFilterByProfileType(profile);

  const unpaidJobs = await Job.findAll({
    where: {
      paid: null,
    },
    include: {
      model: Contract,
      where: {
        status: 'in_progress',
        ...profileFilter,
      },
      attributes: [],
    },
  });

  return unpaidJobs;
}

// TODO: duplicate
function getFilterByProfileType(profile) {
  return profile.type === 'client' ? { ClientId: profile.id } : { ContractorId: profile.id };
}

module.exports = { getAllUnpaidJobs };
