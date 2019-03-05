/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import Bluebird from 'bluebird';
import faker from 'faker';
import app from '../../../index';
import models from '../../../models';

chai.use(chaiHttp);

const dummyUser = {
  username: faker.name.firstName(),
  email: faker.internet.email(),
  password: 'secret',
};

describe('API endpoint: /api/users', () => {
  before(() => {
    // synchronize and create tables
    models.sequelize.sync();
  });

  beforeEach(() => {
    // drop tables
    Bluebird.all([
      models.User.destroy({ truncate: true }),
    ]);
  });

  context('POST /api/users', () => {
    it('should create a new user', (done) => {
      chai.request(app)
        .post('/api/users')
        .send(dummyUser)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          expect(res.body).to.haveOwnProperty('token');
          expect(res.body).to.haveOwnProperty('id');
          done();
        });
    });
  });

  context('POST /api/users/login', () => {
    it('should authenticate a new user', async () => {
      const user = await models.User.create(dummyUser);

      chai.request(app)
        .post('/api/users/login')
        .send({
          username: user.dataValues.username,
          password: 'secret'
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.haveOwnProperty('token');
          expect(res.body).to.haveOwnProperty('id');
        });
    });
  });
});
