/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import faker from 'faker';
import app from '../../../index';
import models from '../../../models';
import { STATUS, MESSAGE, FIELD } from '../../../helpers/constants';
import { env } from '../../../helpers/utils';

chai.use(chaiHttp);
describe('Forgot password endpoint', () => {
  it('should return an error if email is not supplied', (done) => {
    const user = {
      email: '',
      password: faker.internet.password(),
      username: faker.internet.userName(),
    };
    chai
      .request(app)
      .post('/api/v1/users/forgot_password')
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
          .to.equal(MESSAGE.PASSWORD_REQUEST_FAILED);
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
      .post('/api/v1/users/forgot_password')
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
          .to.equal(MESSAGE.PASSWORD_REQUEST_FAILED);
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
  it('should return an error if user is not registered with the provided email', async () => {
    const user = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      username: faker.internet.userName(),
    };
    chai
      .request(app)
      .post('/api/v1/users/forgot_password')
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
          .to.equal(MESSAGE.PASSWORD_REQUEST_FAILED);
        expect(res.body)
          .to.haveOwnProperty('status')
          .to.equal(false);
        expect(res.body)
          .to.haveOwnProperty('data')
          .to.be.an('array')
          .to.deep.include({
            field: FIELD.EMAIL,
            message: MESSAGE.EMAIL_NOT_EXISTS
          });
      });
  });
  it('should send an email reset link for registered user', async () => {
    const user = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      username: faker.internet.userName(),
    };
    await models.User.create(user);
    chai
      .request(app)
      .post('/api/v1/users/forgot_password')
      .send(user)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(STATUS.OK);
        expect(res.body).to.be.an('object');
        expect(res.body)
          .to.haveOwnProperty('code')
          .to.equal(STATUS.OK);
        expect(res.body)
          .to.haveOwnProperty('message')
          .to.equal(MESSAGE.PASSWORD_REQUEST_SUCCESSFUL);
        expect(res.body)
          .to.haveOwnProperty('status')
          .to.equal(true);
        expect(res.body)
          .to.haveOwnProperty('data')
          .to.be.an('array').to.be.empty;
      });
  });
});
describe('Reset password endpoint', () => {
  it('should return an error if password field is not provided', (done) => {
    const pword = faker.internet.password();
    const user = {
      password: '',
      confirmPassword: pword,
    };
    chai
      .request(app)
      .patch('/api/v1/users/reset_password')
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
          .to.equal(MESSAGE.PASSWORD_REQUEST_FAILED);
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
      });
    done();
  });
  it('should return an error if confirmPassword field is not provided', (done) => {
    const pword = faker.internet.password();
    const user = {
      password: pword,
      confirmPassword: '',
    };
    chai
      .request(app)
      .patch('/api/v1/users/reset_password')
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
          .to.equal(MESSAGE.PASSWORD_REQUEST_FAILED);
        expect(res.body)
          .to.haveOwnProperty('status')
          .to.equal(false);
        expect(res.body)
          .to.haveOwnProperty('data')
          .to.be.an('array')
          .to.deep.include({
            field: FIELD.CONFIRM_PASSWORD,
            message: MESSAGE.CONFIRM_PASSWORD_EMPTY
          });
      });
    done();
  });
  it('should return an error if password and confirmPassword fields do not match', (done) => {
    const user = {
      password: faker.internet.password(),
      confirmPassword: faker.internet.password(),
    };
    chai
      .request(app)
      .patch('/api/v1/users/reset_password')
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
          .to.equal(MESSAGE.PASSWORD_REQUEST_FAILED);
        expect(res.body)
          .to.haveOwnProperty('status')
          .to.equal(false);
        expect(res.body)
          .to.haveOwnProperty('data')
          .to.be.an('array');
      });
    done();
  });
  it('should return an error if authentication token is invalid or not provided', (done) => {
    const pword = faker.internet.password();
    const user = {
      password: pword,
      confirmPassword: pword,
    };
    chai
      .request(app)
      .patch('/api/v1/users/reset_password?token=INVALID_TOKEN')
      .send(user)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(STATUS.UNATHORIZED);
        expect(res.body).to.be.an('object');
        expect(res.body)
          .to.haveOwnProperty('code')
          .to.equal(STATUS.UNATHORIZED);
        expect(res.body)
          .to.haveOwnProperty('message')
          .to.equal(MESSAGE.PASSWORD_LINK_EXPIRED);
        expect(res.body)
          .to.haveOwnProperty('status')
          .to.equal(false);
        expect(res.body)
          .to.haveOwnProperty('data')
          .to.be.an('array');
      });
    done();
  });
  it('should return an error if token is valid but user is not registered', (done) => {
    const pword = faker.internet.password();
    const email = faker.internet.email();
    const user = {
      password: pword,
      confirmPassword: pword,
    };
    const token = jwt.sign({ email }, env('APP_KEY'));
    chai
      .request(app)
      .patch(`/api/v1/users/reset_password?token=${token}`)
      .send(user)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(STATUS.FORBIDDEN);
        expect(res.body).to.be.an('object');
        expect(res.body)
          .to.haveOwnProperty('code')
          .to.equal(STATUS.FORBIDDEN);
        expect(res.body)
          .to.haveOwnProperty('message')
          .to.equal(MESSAGE.PASSWORD_LINK_EXPIRED);
        expect(res.body)
          .to.haveOwnProperty('status')
          .to.equal(false);
        expect(res.body)
          .to.haveOwnProperty('data')
          .to.be.an('array');
      });
    done();
  });
  it('should successfully reset the password for valid token and registered user', async () => {
    const pword = faker.internet.password();
    const user = {
      email: faker.internet.email(),
      username: faker.internet.userName(),
      password: pword,
      confirmPassword: pword,
    };
    await models.User.create(user);
    const token = jwt.sign({ email: user.email }, env('APP_KEY'));
    chai
      .request(app)
      .patch(`/api/v1/users/reset_password?token=${token}`)
      .send(user)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(STATUS.OK);
        expect(res.body).to.be.an('object');
        expect(res.body)
          .to.haveOwnProperty('code')
          .to.equal(STATUS.OK);
        expect(res.body)
          .to.haveOwnProperty('message')
          .to.equal(MESSAGE.PASSWORD_RESET_SUCCESSFUL);
        expect(res.body)
          .to.haveOwnProperty('status')
          .to.equal(true);
        expect(res.body)
          .to.haveOwnProperty('data')
          .to.be.an('array');
      });
  });
});
