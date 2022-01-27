const jobsService = require('../jobs.service');
const { buildModelMock, FakeClient, FakeContractor } = require('../../utils/test-utils');

const contractModelMock = buildModelMock();
const jobModelMock = buildModelMock();

describe('jobs service', () => {
  it('should get all unpaid jobs', async () => {
    const fakeClient = FakeClient(1, 'test');

    const jobs = [{}, {}];
    jobModelMock.findAll.mockResolvedValue(jobs);

    const unpaidJobs = await jobsService.getAllUnpaidJobs({
      profile: fakeClient,
      Contract: contractModelMock,
      Job: jobModelMock,
    });

    expect(unpaidJobs).toBe(jobs);
  });
});
