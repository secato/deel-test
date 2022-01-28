const adminService = require('./admin.service');
const { buildModelMock, buildSequelizeMock } = require('../utils/test-utils');

const jobModelMock = buildModelMock();
const mockedSequelize = buildSequelizeMock();

describe('admin service', () => {
  describe('best professions', () => {
    it('should return an array', async () => {
      const results = [{}, {}];
      jobModelMock.findAll.mockResolvedValue(results);

      const bestProfessions = await adminService.findBestProfession({
        Job: jobModelMock,
        sequelize: mockedSequelize,
      });

      expect(bestProfessions).toBe(results);
      expect(mockedSequelize.col).toBeCalledWith('profession');
      expect(mockedSequelize.col).toBeCalledWith('price');
      expect(jobModelMock.findAll).toBeCalledWith(
        expect.objectContaining({
          limit: 1,
          where: expect.objectContaining({
            paid: true,
          }),
        })
      );
    });
  });

  describe('best clients', () => {
    it('should return a list of best clients', async () => {
      const results = [{}, {}];
      const startDate = new Date();
      const endDate = new Date();
      const limit = 3;

      mockedSequelize.query.mockResolvedValue(results);

      const bestClients = await adminService.findBestClients({
        startDate,
        endDate,
        limit,
        sequelize: mockedSequelize,
      });

      expect(bestClients).toBe(results);
      expect(mockedSequelize.query).toBeCalledWith(
        expect.stringContaining('SELECT'),
        expect.objectContaining({
          replacements: expect.objectContaining({
            startDate,
            endDate,
            limit,
          }),
        })
      );
    });
  });
});
