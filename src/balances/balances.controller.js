const balancesService = require('./balances.service');

async function deposit(req, res, next) {
  const { Contract, Job, Profile } = req.app.get('models');
  const sequelize = req.app.get('sequelize');
  const { userId } = req.params;
  const { amount } = req.body;
  const profile = req.profile;

  try {
    const client = await balancesService.depositBalance({
      profile,
      amount,
      sequelize,
      Contract,
      Job,
      Profile,
    });

    res.json(client);
  } catch (error) {
    next(error);
  }
}

module.exports = { deposit };
