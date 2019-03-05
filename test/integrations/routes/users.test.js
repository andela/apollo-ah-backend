/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import Bluebird from 'bluebird';
import faker from 'faker';
import app from '../../../index';
import models from '../../../models';

chai.use(chaiHttp);

const dummyUser = {
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

  describe('POST /api/v1/users', () => {
    it('should create a new user', (done) => {
      chai.request(app)
        .post('/api/v1/users')
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

  // describe('POST /api/v1/users/login', () => {
  //   it('should authenticate a new user', async () => {
  //     const user = await models.User.create(dummyUser);

  //     chai.request(app)
  //       .post('/api/v1/users/login')
  //       .send({
  //         email: user.dataValues.email,
  //         password: 'secret'
  //       })
  //       .end((err, res) => {
  //         expect(err).to.be.null;
  //         expect(res).to.have.status(200);
  //         expect(res.body).to.haveOwnProperty('token');
  //         expect(res.body).to.haveOwnProperty('id');
  //       });
  //   });
  // });
});
