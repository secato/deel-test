const adminService = require('./admin.service');

async function findBestProfession(req, res, next) {
  const sequelize = req.app.get('sequelize');
  const { Job, Contract, Profile } = req.app.get('models');
  const { start, end } = req.query;

  try {
    const bestProfession = await adminService.findBestProfession({
      sequelize,
      Job,
      Contract,
      Profile,
      startDate: start,
      endDate: end,
    });

    res.json(bestProfession);
  } catch (error) {
    next(error);
  }
}

module.exports = { findBestProfession };
