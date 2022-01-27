const contractService = require('../contract.service');

const buildModelMock = () => {
  return {
    findOne: jest.fn(),
    findAll: jest.fn(),
  };
};

const contractModelMock = buildModelMock();

const FakeClient = (id, firstName, type = 'client') => ({ id, firstName, type });
const FakeContractor = (id, firstName, type = 'contractor') => ({ id, firstName, type });

describe('contracts', () => {
  describe('get contract by id', () => {
    it('should only return contracts for client if profile is client', async () => {
      const fakeId = 1;
      const fakeClientProfile = FakeClient(123, 'test');
      const fakeContract = {
        terms: 'this is a test',
        status: 'in_progress',
      };

      contractModelMock.findOne.mockResolvedValue(fakeContract);

      const contract = await contractService.getById({
        profile: fakeClientProfile,
        Contract: contractModelMock,
        id: fakeId,
      });

      expect(contract).toBe(fakeContract);
      expect(contractModelMock.findOne).toBeCalledWith({
        where: {
          id: fakeId,
          ClientId: fakeClientProfile.id,
        },
      });
    });

    it('should only return contracts for contractor if profile is contractor', async () => {
      const fakeId = 2;
      const fakeContractorProfile = FakeContractor(321, 'test');
      const fakeContract = {
        terms: 'this is a test',
        status: 'in_progress',
      };

      contractModelMock.findOne.mockResolvedValue(fakeContract);

      const contract = await contractService.getById({
        Contract: contractModelMock,
        id: fakeId,
        profile: fakeContractorProfile,
      });

      expect(contract).toBe(fakeContract);
      expect(contractModelMock.findOne).toBeCalledWith({
        where: {
          id: fakeId,
          ContractorId: fakeContractorProfile.id,
        },
      });
    });

    it('should return null when contract not found', async () => {
      contractModelMock.findOne.mockResolvedValue(null);

      const contract = await contractService.getById({
        Contract: contractModelMock,
        id: 'anything',
        profile: {},
      });

      expect(contract).toBe(null);
    });
  });

  describe('get all contracts', () => {
    it('should return all contracts per client', async () => {
      const fakeClientProfile = FakeClient(1, 'test');

      contractModelMock.findAll.mockResolvedValue([]);

      const contracts = await contractService.getAllNotTerminated({
        profile: fakeClientProfile,
        Contract: contractModelMock,
      });

      expect(contracts.length).toBe(0);
    });
  });
});
