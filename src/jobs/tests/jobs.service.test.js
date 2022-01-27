const jobsService = require('../jobs.service');
const { buildModelMock, FakeClient, FakeContractor } = require('../../utils/test-utils');

const contractModelMock = buildModelMock();
const jobModelMock = buildModelMock();
const profileModelMock = buildModelMock();

const buildSequelizeMock = () => ({
  transaction: jest.fn(() => ({
    rollback: jest.fn(),
    commit: jest.fn(),
  })),
});

describe('jobs service', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('getAllUnpaidJobs', () => {
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

  describe('payJob', () => {
    it('should throw an error when no balance', async () => {
      expect.assertions(2);

      try {
        const fakeClient = FakeClient(1, 'test', 100);
        const fakeJobId = 1;
        const fakeJob = {
          id: 1,
          price: 200,
          Contract: {
            ClientId: fakeClient.id,
          },
        };

        jobModelMock.findOne.mockResolvedValue(fakeJob);
        profileModelMock.findByPk.mockResolvedValue(fakeClient);

        await jobsService.payJob({
          profile: fakeClient,
          jobId: fakeJobId,
          Contract: contractModelMock,
          Job: jobModelMock,
          Profile: profileModelMock,
          sequelize: buildSequelizeMock(),
        });
      } catch (error) {
        expect(error.status).toBe(403);
        expect(error.message).toBe('Insufficient balance');
      }
    });

    it('should throw job already paid', async () => {
      expect.assertions(2);
      const fakeClient = FakeClient(1, 'test');
      const fakeJobId = 1;
      const fakeJob = {
        id: fakeJobId,
        paid: true,
      };

      jobModelMock.findOne.mockResolvedValue(fakeJob);

      try {
        await jobsService.payJob({
          profile: fakeClient,
          jobId: fakeJobId,
          Contract: contractModelMock,
          Job: jobModelMock,
          Profile: profileModelMock,
          sequelize: buildSequelizeMock(),
        });
      } catch (error) {
        expect(error.status).toBe(400);
        expect(error.message).toBe('Job already paid');
      }
    });

    it('should throw job not fund', async () => {
      expect.assertions(2);

      try {
        const fakeClient = FakeClient(1, 'test', 500);
        const fakeJobId = 1;

        await jobsService.payJob({
          profile: fakeClient,
          jobId: fakeJobId,
          Contract: contractModelMock,
          Job: jobModelMock,
          Profile: profileModelMock,
          sequelize: buildSequelizeMock(),
        });
      } catch (error) {
        expect(error.status).toBe(404);
        expect(error.message).toBe('Job not found or contract already terminated');
      }
    });

    it('should return the paid job', async () => {
      const fakeJobId = 1;
      const fakeClient = FakeClient(1, 'client');
      const fakeContractor = FakeContractor(1, 'contractor');

      fakeClient.balance = 220;
      fakeContractor.balance = 200;

      const fakeJob = {
        id: 1,
        paid: false,
        price: 200,
        description: 'development',
        Contract: {
          status: 'new',
          save: jest.fn(),
        },
        save: jest.fn(),
      };

      jobModelMock.findOne.mockResolvedValue(fakeJob);
      profileModelMock.findByPk.mockResolvedValueOnce(fakeClient);
      profileModelMock.findByPk.mockResolvedValueOnce(fakeContractor);

      const paidJob = await jobsService.payJob({
        profile: fakeClient,
        jobId: fakeJobId,
        Contract: contractModelMock,
        Job: jobModelMock,
        Profile: profileModelMock,
        sequelize: buildSequelizeMock(),
      });

      expect(paidJob).toHaveProperty('description');
      expect(paidJob.paid).toBe(true);
      expect(fakeClient.balance).toBe(20);
      expect(fakeContractor.balance).toBe(400);
      expect(fakeJob.Contract.status).toBe('in_progress');
    });
  });
});
