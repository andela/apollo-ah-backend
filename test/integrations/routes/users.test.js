/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
/**
 * @todo To be removed pending acceptance of current user test
 */
// import Bluebird from 'bluebird';
import app from '../../../index';
import models from '../../../models';
import { newUser } from '../../helpers/testData';
import { STATUS, MESSAGE, FIELD } from '../../../helpers/constants';


chai.use(chaiHttp);
describe('Registration endpoint', () => {
  it('should create a new user with valid input', async () => {
    try {
      const response = await chai
        .request(app)
        .post('/api/v1/users')
        .send(newUser);
      expect(response).to.have.status(STATUS.OK);
      expect(response.body).to.be.an('object');
      expect(response.body)
        .to.haveOwnProperty('code')
        .to.equal(STATUS.OK);
      expect(response.body)
        .to.haveOwnProperty('message')
        .to.equal(MESSAGE.REGISTRATION_SUCCESSFUL);
      expect(response.body)
        .to.haveOwnProperty('status')
        .to.equal(true);
      expect(response.body)
        .to.haveOwnProperty('data')
        .to.be.an('object');
    } catch (err) {
      expect(err).to.not.be.null;
    }
  });
  it('should return an error if username is not provided', (done) => {
    chai
      .request(app)
      .post('/api/v1/users')
      .send({ ...newUser, username: '' })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(STATUS.BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res.body)
          .to.haveOwnProperty('code')
          .to.equal(STATUS.BAD_REQUEST);
        expect(res.body)
          .to.haveOwnProperty('message')
          .to.equal(MESSAGE.REGISTRATION_ERROR);
        expect(res.body)
          .to.haveOwnProperty('status')
          .to.equal(false);
        expect(res.body)
          .to.haveOwnProperty('data')
          .to.be.an('array')
          .to.deep.include({
            field: FIELD.USERNAME,
            message: MESSAGE.USERNAME_EMPTY
          });

        done();
      });
  });
  it('should return an error if password field is empty', (done) => {
    chai
      .request(app)
      .post('/api/v1/users')
      .send({ ...newUser, password: '' })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(STATUS.BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res.body)
          .to.haveOwnProperty('code')
          .to.equal(STATUS.BAD_REQUEST);
        expect(res.body)
          .to.haveOwnProperty('message')
          .to.equal(MESSAGE.REGISTRATION_ERROR);
        expect(res.body)
          .to.haveOwnProperty('status')
          .to.equal(false);
        expect(res.body)
          .to.haveOwnProperty('data')
          .to.be.an('array')
          .to.deep.include({
            field: FIELD.PASSWORD,
            message: MESSAGE.PASSWORD_EMPTY
          });
        done();
      });
  });
  it('should return an error if password is less than 8 characters', (done) => {
    chai
      .request(app)
      .post('/api/v1/users')
      .send({ ...newUser, password: 'short' })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(STATUS.BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res.body)
          .to.haveOwnProperty('code')
          .to.equal(STATUS.BAD_REQUEST);
        expect(res.body)
          .to.haveOwnProperty('message')
          .to.equal(MESSAGE.REGISTRATION_ERROR);
        expect(res.body)
          .to.haveOwnProperty('status')
          .to.equal(false);
        expect(res.body)
          .to.haveOwnProperty('data')
          .to.be.an('array')
          .to.deep.include({
            field: FIELD.PASSWORD,
            message: MESSAGE.PASSWORD_TOO_SHORT
          });
        done();
      });
  });
  it('should return an error if password contains only letters', (done) => {
    chai
      .request(app)
      .post('/api/v1/users')
      .send({ ...newUser, password: 'password without numbers' })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(STATUS.BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res.body)
          .to.haveOwnProperty('code')
          .to.equal(STATUS.BAD_REQUEST);
        expect(res.body)
          .to.haveOwnProperty('message')
          .to.equal(MESSAGE.REGISTRATION_ERROR);
        expect(res.body)
          .to.haveOwnProperty('status')
          .to.equal(false);
        expect(res.body)
          .to.haveOwnProperty('data')
          .to.be.an('array')
          .to.deep.include({
            field: FIELD.PASSWORD,
            message: MESSAGE.PASSWORD_NOT_ALPHANUMERIC
          });
        done();
      });
  });
  it('should return an error if password contains only numbers', (done) => {
    chai
      .request(app)
      .post('/api/v1/users')
      .send({ ...newUser, password: '7509634876' })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(STATUS.BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res.body)
          .to.haveOwnProperty('code')
          .to.equal(STATUS.BAD_REQUEST);
        expect(res.body)
          .to.haveOwnProperty('message')
          .to.equal(MESSAGE.REGISTRATION_ERROR);
        expect(res.body)
          .to.haveOwnProperty('status')
          .to.equal(false);
        expect(res.body)
          .to.haveOwnProperty('data')
          .to.be.an('array')
          .to.deep.include({
            field: FIELD.PASSWORD,
            message: MESSAGE.PASSWORD_NOT_ALPHANUMERIC
          });
        done();
      });
  });
  it('should return an error if username already exist', async () => {
    const user = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      username: faker.internet.userName().toLowerCase(),
      firstname: '',
      lastname: '',
      gender: '',
      bio: '',
    };
    const { dataValues: { id } } = await models.User.create(user);
    user.userId = id;
    await models.Profile.create(user);
    user.email = faker.internet.email();
    chai
      .request(app)
      .post('/api/v1/users')
      .send(user)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(STATUS.BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res.body)
          .to.haveOwnProperty('code')
          .to.equal(STATUS.BAD_REQUEST);
        expect(res.body)
          .to.haveOwnProperty('message')
          .to.equal(MESSAGE.REGISTRATION_ERROR);
        expect(res.body)
          .to.haveOwnProperty('status')
          .to.equal(false);
        expect(res.body)
          .to.haveOwnProperty('data')
          .to.be.an('array')
          .to.deep.include({
            field: FIELD.USERNAME,
            message: MESSAGE.USERNAME_EXITS
          });
      });
  });
  it('should return an error if email is not supplied', (done) => {
    chai
      .request(app)
      .post('/api/v1/users')
      .send({ ...newUser, email: '' })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(STATUS.BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res.body)
          .to.haveOwnProperty('code')
          .to.equal(STATUS.BAD_REQUEST);
        expect(res.body)
          .to.haveOwnProperty('message')
          .to.equal(MESSAGE.REGISTRATION_ERROR);
        expect(res.body)
          .to.haveOwnProperty('status')
          .to.equal(false);
        expect(res.body)
          .to.haveOwnProperty('data')
          .to.be.an('array')
          .to.deep.include({
            field: FIELD.EMAIL,
            message: MESSAGE.EMAIL_EMPTY
          });
      });
    done();
  });
  it('should return an error if email is supplied but invalid', (done) => {
    chai
      .request(app)
      .post('/api/v1/users')
      .send({ ...newUser, email: 'INVALID_EMAIL' })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(STATUS.BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res.body)
          .to.haveOwnProperty('code')
          .to.equal(STATUS.BAD_REQUEST);
        expect(res.body)
          .to.haveOwnProperty('message')
          .to.equal(MESSAGE.REGISTRATION_ERROR);
        expect(res.body)
          .to.haveOwnProperty('status')
          .to.equal(false);
        expect(res.body)
          .to.haveOwnProperty('data')
          .to.be.an('array')
          .to.deep.include({
            field: FIELD.EMAIL,
            message: MESSAGE.EMAIL_INVALID
          });
      });
    done();
  });
  it('should return an error if email already exist', async () => {
    const user = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      username: faker.internet.userName(),
    };
    await models.User.create(user);
    chai
      .request(app)
      .post('/api/v1/users')
      .send(user)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(STATUS.BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res.body)
          .to.haveOwnProperty('code')
          .to.equal(STATUS.BAD_REQUEST);
        expect(res.body)
          .to.haveOwnProperty('message')
          .to.equal(MESSAGE.REGISTRATION_ERROR);
        expect(res.body)
          .to.haveOwnProperty('status')
          .to.equal(false);
        expect(res.body)
          .to.haveOwnProperty('data')
          .to.be.an('array')
          .to.deep.include({
            field: FIELD.EMAIL,
            message: MESSAGE.EMAIL_EXISTS
          });
      });
  });
});

describe('POST /api/v1/users/login', () => {
  it('should authenticate a new user', async () => {
    const user = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    await models.User.create(user);
    chai
      .request(app)
      .post('/api/v1/users/login')
      .send(user)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(STATUS.OK);
        expect(res.body).to.haveOwnProperty('token');
        expect(res.body).to.haveOwnProperty('id');
      });
  });
});
