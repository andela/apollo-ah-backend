/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import logger from '../../../server/helpers/logger';
import app from '../../../server';

chai.use(chaiHttp);
let userToken;

// this creates a user and its associate settigs first before tests
before(async () => {
  const user = {
    email: faker.internet.email(),
    password: 'secret12345',
    username: faker.internet.userName(),
  };
  try {
    const response = await chai
      .request(app)
      .post('/api/v1/users')
      .send(user);
    userToken = await response.body.data.token;
  } catch (e) {
    logger.log(e);
  }
  return userToken;
});

describe('Settings endpoints Tests', () => {
  it('should update a users setting', async () => {
    const setting = {
      canEmail: false,
      canNotify: true
    };
    const response = await chai
      .request(app)
      .put('/api/v1/setting')
      .set({ Authorization: `Bearer ${userToken}` })
      .send(setting);
    expect(response).to.have.status(200);
    expect(response.body).to.be.an('object');
    expect(response.body).to.haveOwnProperty('code');
    expect(response.body).to.haveOwnProperty('data');
  });
  it('should not update an un authenticated user settings', async () => {
    const setting = {
      canEmail: false,
      canNotify: true
    };
    const response = await chai
      .request(app)
      .put('/api/v1/setting')
      .set({ Authorization: '' })
      .send(setting);
    expect(response).to.have.status(401);
    expect(response.body).to.be.an('object');
  });
  it('should not update an a user settings with a bad request', async () => {
    const setting = {
      canEmail: false,
      canNotify: 'wello'
    };
    const response = await chai
      .request(app)
      .put('/api/v1/setting')
      .set({ Authorization: `Bearer ${userToken}` })
      .send(setting);
    expect(response).to.have.status(400);
    expect(response.body).to.be.an('object');
    expect(response.body).to.haveOwnProperty('code');
    expect(response.body).to.haveOwnProperty('status');
    expect(response.body).to.haveOwnProperty('data').to.be.an('array');
  });

  it('should not update an a user settings with a bad (empty) request', async () => {
    const setting = {
    };
    const response = await chai
      .request(app)
      .put('/api/v1/setting')
      .set({ Authorization: `Bearer ${userToken}` })
      .send(setting);
    expect(response).to.have.status(400);
    expect(response.body).to.be.an('object');
  });

  it('should get a users setting', async () => {
    const response = await chai
      .request(app)
      .get('/api/v1/setting')
      .set({ Authorization: `Bearer ${userToken}` });
    expect(response).to.have.status(200);
    expect(response.body).to.be.an('object');
    expect(response.body).to.haveOwnProperty('status');
    expect(response.body).to.haveOwnProperty('code');
  });

  it('should not get settings for an unauthenticated user', async () => {
    const setting = {
      canEmail: false,
      canNotify: true
    };
    const response = await chai
      .request(app)
      .get('/api/v1/setting')
      .set({ Authorization: 'dkk' })
      .send(setting);
    expect(response).to.have.status(401);
    expect(response.body).to.be.an('object');
  });
});
