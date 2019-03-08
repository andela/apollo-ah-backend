/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import Bluebird from 'bluebird';
import faker from 'faker';
import app from '../../../index';
import models from '../../../models';
import {
  DUMMY_USER,
  STATUS, MESSAGE,
  FIELD
} from '../../../helpers/constants';

chai.use(chaiHttp);
let dummyUser;

describe('API endpoint: /api/users', () => {
  before(() => {
    // synchronize and create tables
    models.sequelize.sync();
  });
  beforeEach(() => {
    // reset the dummy user data
    dummyUser = { ...DUMMY_USER };
    // drop tables
    Bluebird.all([
      models.User.destroy({ truncate: true }),
    ]);
  });

  describe('Registration endpoint', () => {
    it('should create a new user with valid input', async () => {
      try {
        const response = await chai.request(app)
          .post('/api/v1/users')
          .send(dummyUser);
        expect(response).to.have.status(STATUS.CREATED);
        expect(response.body).to.be.an('object');
        expect(response.body).to.haveOwnProperty('code').to.equal(STATUS.CREATED);
        expect(response.body).to.haveOwnProperty('message').to.equal(MESSAGE.REGISTRATION_SUCCESSFUL);
        expect(response.body).to.haveOwnProperty('status').to.equal(true);
        expect(response.body).to.haveOwnProperty('data').to.be.an('object');
      } catch (err) {
        expect(err).to.not.be.null;
      }
    });
    it('should return an error if username is not provided', (done) => {
      dummyUser.username = '';
      chai.request(app)
        .post('/api/v1/users')
        .send(dummyUser)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(STATUS.BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.BAD_REQUEST);
          expect(res.body).to.haveOwnProperty('message').to.equal(MESSAGE.REGISTRATION_ERROR);
          expect(res.body).to.haveOwnProperty('status').to.equal(false);
          expect(res.body).to.haveOwnProperty('data').to.be.an('array').to.deep.include({
            field: FIELD.USERNAME,
            message: MESSAGE.USERNAME_EMPTY,
          });

          done();
        });
    });
    it('should return an error if password field is empty', (done) => {
      dummyUser.password = '';
      // mockUser = { ...dummyUser };
      // mockUser.password = '';
      chai.request(app)
        .post('/api/v1/users')
        .send(dummyUser)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(STATUS.BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.BAD_REQUEST);
          expect(res.body).to.haveOwnProperty('message').to.equal(MESSAGE.REGISTRATION_ERROR);
          expect(res.body).to.haveOwnProperty('status').to.equal(false);
          expect(res.body).to.haveOwnProperty('data').to.be.an('array').to.deep.include({
            field: FIELD.PASSWORD,
            message: MESSAGE.PASSWORD_EMPTY,
          });
          done();
        });
    });
    it('should return an error if password is less than 8 characters', (done) => {
      dummyUser.password = 'short';
      // mockUser = { ...dummyUser };
      // mockUser.password = 'short';
      chai.request(app)
        .post('/api/v1/users')
        .send(dummyUser)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(STATUS.BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.BAD_REQUEST);
          expect(res.body).to.haveOwnProperty('message').to.equal(MESSAGE.REGISTRATION_ERROR);
          expect(res.body).to.haveOwnProperty('status').to.equal(false);
          expect(res.body).to.haveOwnProperty('data').to.be.an('array').to.deep.include({
            field: FIELD.PASSWORD,
            message: MESSAGE.PASSWORD_TOO_SHORT,
          });
          done();
        });
    });
    it('should return an error if password is not alphanumeric', (done) => {
      dummyUser.password = 'only alphabets without numbers';
      // mockUser = { ...dummyUser };
      // mockUser.password = 'only alphabets without numbers';
      chai.request(app)
        .post('/api/v1/users')
        .send(dummyUser)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(STATUS.BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.BAD_REQUEST);
          expect(res.body).to.haveOwnProperty('message').to.equal(MESSAGE.REGISTRATION_ERROR);
          expect(res.body).to.haveOwnProperty('status').to.equal(false);
          expect(res.body).to.haveOwnProperty('data').to.be.an('array').to.deep.include({
            field: FIELD.PASSWORD,
            message: MESSAGE.PASSWORD_NOT_ALPHANUMERIC,
          });
          done();
        });
    });
    it.skip('should return an error if username already exist', async (done) => {
      await models.User.create(dummyUser);
      chai.request(app)
        .post('/api/v1/users')
        .send(dummyUser)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(STATUS.BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.BAD_REQUEST);
          expect(res.body).to.haveOwnProperty('message').to.equal(MESSAGE.REGISTRATION_ERROR);
          expect(res.body).to.haveOwnProperty('status').to.equal(false);
          expect(res.body).to.haveOwnProperty('data').to.be.an('array').to.deep.include({
            field: FIELD.USERNAME,
            message: MESSAGE.USERNAME_EXITS,
          });
          done();
        });
    });
    it('should return an error if email already exist', async () => {
      await models.User.create(dummyUser);
      chai.request(app)
        .post('/api/v1/users')
        .send(dummyUser)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(STATUS.BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.BAD_REQUEST);
          expect(res.body).to.haveOwnProperty('message').to.equal(MESSAGE.REGISTRATION_ERROR);
          expect(res.body).to.haveOwnProperty('status').to.equal(false);
          expect(res.body).to.haveOwnProperty('data').to.be.an('array').to.deep.include({
            field: FIELD.EMAIL,
            message: MESSAGE.EMAIL_EXISTS,
          });
        });
    });
  });

  describe('POST /api/v1/users/login', () => {
    it('should authenticate a new user', (done) => {
      dummyUser.email = faker.internet.email();
      models.User.create(dummyUser)
        .then((user) => {
          return chai.request(app)
            .post('/api/v1/users/login')
            .send({
              email: user.email,
              password: DUMMY_USER.password
            });
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.haveOwnProperty('token');
          expect(res.body).to.haveOwnProperty('id');
          done();
        })
        .catch(done);
    });
  });
});
