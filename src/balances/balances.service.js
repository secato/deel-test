const { BadRequest } = require('http-errors');
const { Op } = require('sequelize');

async function depositBalance({ profile, amount, sequelize, Contract, Job, Profile }) {
  if (!amount) throw new BadRequest('You need to provide a deposit amount');

  const transaction = await sequelize.transaction();
  try {
    const client = await Profile.findByPk(profile.id, { transaction });

    const toPay = await Job.sum(
      'price',
      {
        where: { paid: null },
        include: [
          {
            model: Contract,
            where: { status: { [Op.ne]: 'terminated' }, ClientId: profile.id },
            attributes: [],
          },
        ],
      },
      { transaction }
    );

    if (cannotDeposit(client, amount, toPay)) {
      throw new BadRequest('You exceeded the amount that you can deposit');
    }

    client.balance += amount;

    await client.save({ transaction });
    await transaction.commit();

    return client;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

const depositLimit = (toPay) => (toPay / 100) * 25;
const cannotDeposit = (client, amount, toPay) => client.balance + amount > depositLimit(toPay);

module.exports = { depositBalance };
