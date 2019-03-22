/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import faker from 'faker';
import chaiHttp from 'chai-http';
import app from '../../../index';
import { STATUS } from '../../../helpers/constants';

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
  it('Should fetch user stats', (done) => {
    chai
      .request(app)
      .get(`/api/v1/users/${dummyUser.id}/stats`)
      .set({ Authorization: `Bearer ${authToken}` })
      .end((err, res) => {
        expect(res).to.have.status(STATUS.OK);
        expect(res.body).to.be.an('object');
        expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.OK);
        expect(res.body.data).to.haveOwnProperty('articles');
        expect(res.body.data).to.haveOwnProperty('bookmarked');
        expect(res.body.data).to.haveOwnProperty('liked');
        expect(res.body.data).to.haveOwnProperty('comments');
        expect(res.body.message).to.equal('stats successfully fetched');
        done();
      });
  });
});
