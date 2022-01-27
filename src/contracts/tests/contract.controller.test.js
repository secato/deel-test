const contractService = require('../contract.service');
const contractController = require('../contract.controller');

jest.mock('../contract.service.js');

const reqMock = {
  app: {
    get: jest.fn((str) => ({})),
  },
  params: {},
  profile: {},
};

const resMock = {
  status: jest.fn((status) => ({
    end: jest.fn(),
  })),

  json: jest.fn(),
};

describe('get contract by id', () => {
  it('should return 404 when no contract with the specified id', async () => {
    contractService.getById.mockResolvedValue(null);

    await contractController.getById(reqMock, resMock);

    expect(resMock.status).toBeCalledWith(404);
  });

  it('should return the contract', async () => {
    const fakeId = 1;
    const fakeContract = { terms: 'bla' };
    const fakeProfile = { firstName: 'test' };

    const requestMock = { ...reqMock };
    requestMock.params.id = fakeId;
    requestMock.profile = fakeProfile;

    contractService.getById.mockResolvedValue(fakeContract);

    await contractController.getById(requestMock, resMock);

    expect(resMock.json).toBeCalledWith(fakeContract);
    expect(contractService.getById).toBeCalledWith({
      id: 1,
      profile: fakeProfile,
      Contract: undefined,
    });
  });
});

describe('get all non terminated contracts', () => {
  it('should return the contracts', async () => {
    const results = [{}, {}];
    contractService.getAllNotTerminated.mockResolvedValue(results);

    await contractController.getAll(reqMock, resMock);

    expect(resMock.json).toBeCalledWith(results);
  });
});
