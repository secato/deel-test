const buildModelMock = () => {
  return {
    findOne: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
  };
};

const FakeProfile = ({ id, firstName, type, balance }) => ({
  id,
  firstName,
  balance,
  type,
  save: jest.fn(),
});

const FakeClient = (id, firstName, balance) =>
  FakeProfile({ id, firstName, balance, type: 'client' });

const FakeContractor = (id, firstName, balance) =>
  FakeProfile({ id, firstName, balance, type: 'contractor' });

module.exports = { buildModelMock, FakeClient, FakeContractor };
