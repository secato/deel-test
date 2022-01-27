const { Op } = require('sequelize');

async function findBestProfession({ sequelize, startDate, endDate, Job, Contract, Profile }) {
  const bestProfessionResults = await Job.findAll({
    attributes: [
      [sequelize.col('profession'), 'profession'],
      [sequelize.fn('SUM', sequelize.col('price')), 'total'],
    ],
    where: {
      paid: true,
      paymentDate: {
        [Op.between]: [startDate, endDate],
      },
    },
    include: [
      {
        model: Contract,
        attributes: [],
        include: [
          {
            model: Profile,
            as: 'Contractor',
            attributes: [],
          },
        ],
      },
    ],
    group: ['profession'],
    order: [[sequelize.col('total'), 'DESC']],
    limit: 1,
  });

  return bestProfessionResults;
}

module.exports = { findBestProfession };
