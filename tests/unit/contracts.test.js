const { getById } = require('../../src/services/contracts');

const buildModelMock = () => {
  return {
    findOne: jest.fn(),
  };
};

const contractMock = buildModelMock();

const mockedReq = {
  app: {
    get: jest.fn((str) => ({
      Contract: contractMock,
    })),
  },
  params: {},
  profile: {},
};

const mockedRes = {
  status: jest.fn((num) => ({
    end: jest.fn(),
  })),
  json: jest.fn(),
};

const createFakeProfile = ({ id, firstName, type }) => ({ id, firstName, type });

describe('contracts', () => {
  describe('get contract by id', () => {
    it('should only return contracts for client if profile is client', async () => {
      const fakeId = 1;
      const fakeClientProfile = createFakeProfile({
        id: 123,
        firstName: 'test',
        type: 'client',
      });
      const fakeContract = {
        terms: 'this is a test',
        status: 'in_progress',
      };

      mockedReq.params.id = fakeId;
      mockedReq.profile = fakeClientProfile;
      contractMock.findOne.mockResolvedValue(fakeContract);

      await getById(mockedReq, mockedRes);

      expect(contractMock.findOne).toBeCalledWith({
        where: {
          id: fakeId,
          ClientId: fakeClientProfile.id,
        },
      });

      expect(mockedRes.json).toBeCalledWith(fakeContract);
    });

    it('should only return contracts for contractor if profile is contractor', async () => {
      const fakeId = 2;
      const fakeContractorProfile = createFakeProfile({
        id: 321,
        firstName: 'test',
        type: 'contractor',
      });
      const fakeContract = {
        terms: 'this is a test',
        status: 'in_progress',
      };

      mockedReq.params.id = fakeId;
      mockedReq.profile = fakeContractorProfile;
      contractMock.findOne.mockResolvedValue(fakeContract);

      await getById(mockedReq, mockedRes);

      expect(contractMock.findOne).toBeCalledWith({
        where: {
          id: fakeId,
          ContractorId: fakeContractorProfile.id,
        },
      });

      expect(mockedRes.json).toBeCalledWith(fakeContract);
    });

    it('should return not found in case the contract does not exist', async () => {
      mockedReq.params.id = 'fake';
      mockedReq.profile = {
        type: 'client',
      };

      contractMock.findOne.mockResolvedValue(undefined);

      await getById(mockedReq, mockedRes);

      expect(mockedRes.status).toBeCalledWith(404);
    });
  });
});
