const { BadRequest } = require('http-errors');
const { buildModelMock, FakeClient, buildSequelizeMock } = require('../utils/test-utils');
const balancesService = require('./balances.service');

const profileModelMock = buildModelMock();
const jobModelMock = buildModelMock();
const sequelizeMock = buildSequelizeMock();

describe('balances service', () => {
  describe('deposit', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should not deposit above the limit', async () => {
      expect.assertions(2);

      const fakeClient = FakeClient(1, 'Hello', 100);
      profileModelMock.findByPk.mockResolvedValue(fakeClient);
      jobModelMock.sum.mockResolvedValue(100);

      try {
        await balancesService.depositBalance({
          profile: fakeClient,
          Profile: profileModelMock,
          Job: jobModelMock,
          sequelize: sequelizeMock,
          amount: 100,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequest);
        expect(error.message).toBe('You exceeded the amount that you can deposit');
      }
    });

    it('should throw an error when no amount provided', async () => {
      expect.assertions(2);

      const fakeClient = FakeClient(1, 'Hello', 100);
      profileModelMock.findByPk.mockResolvedValue(fakeClient);
      jobModelMock.sum.mockResolvedValue(100);

      try {
        await balancesService.depositBalance({
          profile: fakeClient,
          Profile: profileModelMock,
          Job: jobModelMock,
          sequelize: sequelizeMock,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequest);
        expect(error.message).toBe('You need to provide a deposit amount');
      }
    });

    it('should deposit, commit and return client', async () => {
      const fakeClient = FakeClient(1, 'Hello', 10);
      profileModelMock.findByPk.mockResolvedValue(fakeClient);
      jobModelMock.sum.mockResolvedValue(200);

      const commitSpy = jest.fn();
      sequelizeMock.transaction.mockImplementation(() => {
        return {
          commit: commitSpy,
        };
      });

      const client = await balancesService.depositBalance({
        profile: fakeClient,
        Profile: profileModelMock,
        Job: jobModelMock,
        sequelize: sequelizeMock,
        amount: 25,
      });

      expect(sequelizeMock.transaction).toBeCalled();
      expect(commitSpy).toBeCalled();
      expect(client).toBe(fakeClient);
    });

    it('should rollback in case of error', async () => {
      expect.assertions(2);

      const err = new Error('oh no');
      jobModelMock.sum.mockRejectedValue(err);

      const rollbackSpy = jest.fn();
      sequelizeMock.transaction.mockImplementation(() => {
        return {
          rollback: rollbackSpy,
        };
      });

      try {
        await balancesService.depositBalance({
          profile: {},
          Profile: profileModelMock,
          Job: jobModelMock,
          sequelize: sequelizeMock,
          amount: 25,
        });
      } catch (error) {
        expect(error).toBe(err);
        expect(rollbackSpy).toBeCalled();
      }
    });
  });
});
