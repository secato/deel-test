const { Op, QueryTypes } = require('sequelize');

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

async function findBestClients({ limit, sequelize, startDate, endDate }) {
  const bestClients = await sequelize.query(
    `
  SELECT
    p.id,
    p.firstName,
    p.lastName,
    SUM(j.price) as paid
  FROM
    Jobs j,
    Contracts c ,
    Profiles p
  WHERE
    j.paid = TRUE
    AND j.paymentDate BETWEEN :startDate AND :endDate
    AND j.ContractId = c.id
    AND c.ClientId = p.id
  GROUP BY
    p.id 
  ORDER BY
    paid DESC
  LIMIT :limit;
  `,
    {
      type: QueryTypes.SELECT,
      replacements: {
        startDate,
        endDate,
        limit,
      },
    }
  );

  return bestClients;
}

module.exports = { findBestProfession, findBestClients };
