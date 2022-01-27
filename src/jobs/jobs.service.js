const { Forbidden, NotFound, BadRequest } = require('http-errors');
const { Op } = require('sequelize');

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

async function payJob({ profile, jobId, Contract, Job, Profile, sequelize }) {
  const transaction = await sequelize.transaction();

  try {
    const job = await Job.findOne(
      {
        where: { id: jobId },
        include: [
          {
            model: Contract,
            where: { status: { [Op.ne]: 'terminated' }, ClientId: profile.id },
          },
        ],
      },
      { transaction }
    );

    if (!job) throw new NotFound('Job not found or contract already terminated');
    if (job.paid) throw new BadRequest('Job already paid');

    const client = await Profile.findByPk(job.Contract.ClientId, { transaction });
    const contractor = await Profile.findByPk(job.Contract.ContractorId, { transaction });

    if (!clientCanPay(client, job)) throw new Forbidden('Insufficient balance');

    job.paid = true;
    job.paymentDate = new Date();
    client.balance -= job.price;
    contractor.balance += job.price;

    if (job.Contract.status === 'new') {
      job.Contract.status = 'in_progress';
    }

    // TODO: if last payment, then update contract status to terminated

    await job.save({ transaction });
    await job.Contract.save({ transaction });
    await client.save({ transaction });
    await contractor.save({ transaction });
    await transaction.commit();

    return job;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

function clientCanPay(client, job) {
  return client.balance >= job.price;
}

// TODO: duplicate
function getFilterByProfileType(profile) {
  return profile.type === 'client' ? { ClientId: profile.id } : { ContractorId: profile.id };
}

module.exports = { getAllUnpaidJobs, payJob };
