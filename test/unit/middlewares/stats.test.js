/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import faker from 'faker';
import chaiHttp from 'chai-http';
import app from '../../../server';
import { STATUS } from '../../../server/helpers/constants';

chai.use(chaiHttp);

let authpayload;
let authToken;

const dummyUser = {
  email: faker.internet.email(),
  password: 'i2345678',
  username: faker.name.firstName()
};

before(async () => {
  authpayload = await chai
    .request(app)
    .post('/api/v1/users')
    .send(dummyUser);
  authToken = authpayload.body.data.token;
  dummyUser.id = authpayload.body.data.id;
});

describe('Stats Endpoint: /api/v1/users/:id/stats', () => {
  it('Should return an error when user id is an empty string', (done) => {
    chai
      .request(app)
      .get(`/api/v1/users/${'      '}/stats`)
      .set({ Authorization: `Bearer ${authToken}` })
      .end((err, res) => {
        expect(res).to.have.status(STATUS.BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.BAD_REQUEST);
        expect(res.body.message).to.equal('the provided params is invalid');
        done();
      });
  });
  it('Should return an error when user id and params id and params id don\'t match', (done) => {
    chai
      .request(app)
      .get(`/api/v1/users/${dummyUser.id + 300}/stats`)
      .set({ Authorization: `Bearer ${authToken}` })
      .end((err, res) => {
        expect(res).to.have.status(STATUS.FORBIDDEN);
        expect(res.body).to.be.an('object');
        expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.FORBIDDEN);
        expect(res.body.message).to.equal('You are not authorized to view this stat');
        done();
      });
  });
});
