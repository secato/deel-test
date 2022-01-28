const { Forbidden, NotFound, BadRequest } = require('http-errors');
const { Op } = require('sequelize');
const { getFilterByProfileType } = require('../utils/database');

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

    // Thought: if last payment, then update contract status to terminated
    // That would be automatic or a manual process later?
    // In the UI we could display the number of jobs done and total
    // like 9/10 jobs done and once it reaches 10/10 we could have a "terminate" action
    // where the client can leave a comment

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

module.exports = { getAllUnpaidJobs, payJob };
