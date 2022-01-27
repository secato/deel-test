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

module.exports = { getAllUnpaid };
