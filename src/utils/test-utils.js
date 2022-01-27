const buildModelMock = () => {
  return {
    findOne: jest.fn(),
    findAll: jest.fn(),
  };
};

const FakeClient = (id, firstName, type = 'client') => ({ id, firstName, type });
const FakeContractor = (id, firstName, type = 'contractor') => ({ id, firstName, type });

module.exports = { buildModelMock, FakeClient, FakeContractor };
