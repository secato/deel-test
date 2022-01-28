const request = require('supertest');
const app = require('../src/app');

/**
 * Thought:
 * Since I was running "out of time", I did only a small example of e2e test
 * In a real scenario I would need to have a way (env vars) to setup a different database
 * for test purpose only, also, with more complex database I would need to spin up a docker container
 * to run the tests as well.
 */

const { Contract } = app.get('models');
const testContractData = {
  terms: 'this is a test',
  status: 'new',
  ContractorId: 8,
  ClientId: 4,
};
let testContractInstance;

describe('contracts endpoints', () => {
  beforeAll(async () => {
    testContractInstance = await Contract.create(testContractData);
  });

  describe('GET /contracts/:id', () => {
    it('status 401 when you not provide a profile_id', (done) => {
      request(app)
        .get('/contracts/1')
        .expect(401)
        .then((res) => {
          done();
        })
        .catch((err) => done(err));
    });

    it('status 400 when id is not a number', (done) => {
      request(app)
        .get('/contracts/a')
        .set('profile_id', 1)
        .expect(400)
        .then((res) => {
          done();
        })
        .catch((err) => done(err));
    });

    it('status 200 and return the contract by id', (done) => {
      request(app)
        .get(`/contracts/${testContractInstance.id}`)
        .set('profile_id', testContractInstance.ClientId)
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('status');
          expect(res.body).toHaveProperty('terms');
          done();
        })
        .catch((err) => done(err));
    });

    it('status 404 when contract does not exist', (done) => {
      request(app)
        .get('/contracts/25')
        .set('profile_id', 1)
        .expect(404)
        .then((res) => {
          done();
        })
        .catch((err) => done(err));
    });
  });

  afterAll(async () => {
    const sequelize = app.get('sequelize');
    await testContractInstance.destroy();
    await sequelize.close();
  });
});
