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

async function findBestClients(req, res, next) {
  try {
    const sequelize = req.app.get('sequelize');
    const { start, end, limit = 2 } = req.query;

    const bestClients = await adminService.findBestClients({
      startDate: start,
      endDate: end,
      limit,
      sequelize,
    });

    const bestClientsMapped = bestClients.map((client) => {
      return {
        id: client.id,
        fullName: `${client.firstName} ${client.lastName}`,
        paid: client.paid,
      };
    });

    res.json(bestClientsMapped);
  } catch (error) {
    next(error);
  }
}

module.exports = { findBestProfession, findBestClients };
