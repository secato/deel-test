async function getById(req, res) {
  const { Contract } = req.app.get('models');
  const { id } = req.params;
  const profile = req.profile;

  // TODO: refactor this
  const profileFilter = profile.type === 'client' ? 'ClientId' : 'ContractorId';

  const contract = await Contract.findOne({
    where: {
      id,
      [profileFilter]: profile.id,
    },
  });

  if (!contract) return res.status(404).end();

  res.json(contract);
}

module.exports = { getById };
