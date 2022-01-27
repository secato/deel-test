const jobsService = require('./jobs.service');

async function getAllUnpaid(req, res, next) {
  const { Contract, Job } = req.app.get('models');
  const profile = req.profile;

  try {
    const unpaidJobs = await jobsService.getAllUnpaidJobs({ profile, Contract, Job });
    res.json(unpaidJobs);
  } catch (error) {
    next(error);
  }
}

async function payJob(req, res, next) {
  const { Contract, Job, Profile } = req.app.get('models');
  const sequelize = req.app.get('sequelize');
  const { job_id } = req.params;
  const profile = req.profile;

  try {
    const payJob = await jobsService.payJob({
      jobId: job_id,
      profile,
      Contract,
      Job,
      Profile,
      sequelize,
    });

    res.json(payJob);
  } catch (error) {
    next(error);
  }
}

module.exports = { getAllUnpaid, payJob };
