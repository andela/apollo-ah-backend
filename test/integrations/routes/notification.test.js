/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import app from '../../../server';

chai.use(chaiHttp);
let userToken;

// this creates a user and its associate settigs first before tests
before(async () => {
  const user = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    username: faker.internet.userName(),
  };
  const response = await chai
    .request(app)
    .post('/api/v1/users')
    .send(user);
  userToken = response.body.data.token;
});

describe('Notifications endpoints', () => {
  it('should get all of a users notification', async () => {
    const response = await chai
      .request(app)
      .get('/api/v1/notification')
      .set({ Authorization: `Bearer ${userToken}` });
    expect(response).to.have.status(200);
    expect(response.body).to.be.an('object');
    expect(response.body).to.haveOwnProperty('code');
    expect(response.body).to.haveOwnProperty('data');
  });

  it('should not get notifications of an unauthenticated user', async () => {
    const response = await chai
      .request(app)
      .get('/api/v1/notification')
      .set({ Authorization: 'dkk' });
    expect(response).to.have.status(401);
    expect(response.body).to.be.an('object');
  });
});
