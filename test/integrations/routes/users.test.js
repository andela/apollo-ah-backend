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
import { STATUS, MESSAGE, FIELD } from '../../../helpers/constants';

chai.use(chaiHttp);
describe('Registration endpoint', () => {
  it('should create a new user with valid input', async () => {
    const user = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      username: '',
    };
    try {
      const response = await chai
        .request(app)
        .post('/api/v1/users')
        .send(user);
      expect(response).to.have.status(STATUS.CREATED);
      expect(response.body).to.be.an('object');
      expect(response.body)
        .to.haveOwnProperty('code')
        .to.equal(STATUS.CREATED);
      expect(response.body)
        .to.haveOwnProperty('message')
        .to.equal(MESSAGE.REGISTRATION_SUCCESSFUL);
      expect(response.body)
        .to.haveOwnProperty('statusjkghghjkh')
        .to.equal(true);
      expect(response.body)
        .to.haveOwnProperty('data')
        .to.be.an('object');
    } catch (err) {
      expect(err).to.not.be.null;
    }
  });
  it('should return an error if username is not provided', (done) => {
    const user = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      username: '',
    };
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
            message: MESSAGE.USERNAME_EMPTY
          });

        done();
      });
  });
  it('should return an error if password field is empty', (done) => {
    const user = {
      email: faker.internet.email(),
      password: '',
      username: faker.internet.userName(),
    };
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
            field: FIELD.PASSWORD,
            message: MESSAGE.PASSWORD_EMPTY
          });
        done();
      });
  });
  it('should return an error if password is less than 8 characters', (done) => {
    const user = {
      email: faker.internet.email(),
      password: 'short',
      username: faker.internet.userName(),
    };
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
            field: FIELD.PASSWORD,
            message: MESSAGE.PASSWORD_TOO_SHORT
          });
        done();
      });
  });
  it('should return an error if password contains only letters', (done) => {
    const user = {
      email: faker.internet.email(),
      password: 'password without numbers',
      username: faker.internet.userName(),
    };
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
            field: FIELD.PASSWORD,
            message: MESSAGE.PASSWORD_NOT_ALPHANUMERIC
          });
        done();
      });
  });
  it('should return an error if password contains only numbers', (done) => {
    const user = {
      email: faker.internet.email(),
      password: '7509634876',
      username: faker.internet.userName(),
    };
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
    user.user_id = id;
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
    const user = {
      email: '',
      password: faker.internet.password(),
      username: faker.internet.userName(),
    };
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
            message: MESSAGE.EMAIL_EMPTY
          });
      });
    done();
  });
  it('should return an error if email is supplied but invalid', (done) => {
    const user = {
      email: 'INVALID_EMAIL',
      password: faker.internet.password(),
      username: faker.internet.userName(),
    };
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
        expect(res).to.have.status(200);
        expect(res.body).to.haveOwnProperty('token');
        expect(res.body).to.haveOwnProperty('id');
      });
  });
});
