/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import app from '../../../server';
import { STATUS } from '../../../server/helpers/constants';

chai.use(chaiHttp);

describe('API endpoint: /api/auth', () => {
  describe('/facebook Auth Endpoint', () => {
    it('should redirect to facebook authentication page', async () => {
      const response = await chai.request(app)
        .get('/api/v1/auth/facebook');
      expect(response.res.connection.servername).to.contain('facebook.com');
      expect(response.statusCode).to.equal(200);
      expect(response.res.statusMessage).to.equal('OK');
      // eslint-disable-next-line no-unused-expressions
      expect(response.body).to.be.empty;
    });

    it('should return error for wrong facebook authentication endpoint', async () => {
      const response = await chai.request(app)
        .get('/v1/auth/facebook');
      expect(response.res.connection.servername).to.equal(undefined);
      expect(response.statusCode).to.equal(404);
      expect(response.res.statusMessage).to.equal('Not Found');
    });
  });

  describe('/gooogle Auth Endpoint', () => {
    it('should redirect to google authentication page', async () => {
      const response = await chai.request(app)
        .get('/api/v1/auth/google');
      expect(response.res.connection.servername).to.equal('accounts.google.com');
      expect(response.statusCode).to.equal(200);
      expect(response.res.statusMessage).to.equal('OK');
      // eslint-disable-next-line no-unused-expressions
      expect(response.body).to.be.empty;
      expect(response.res.text).to.be.a('string');
    });

    it('should return error for wrong google authentication endpoint', async () => {
      const response = await chai.request(app)
        .get('/auth/google');
      expect(response.res.connection.servername).to.equal(undefined);
      expect(response.statusCode).to.equal(404);
      expect(response.res.statusMessage).to.equal('Not Found');
    });
  });

  describe('/twitter Auth Endpoint', () => {
    it('should redirect to twitter authentication page', async () => {
      const response = await chai.request(app)
        .get('/api/v1/auth/twitter');
      expect(response.res.connection.servername).to.equal('api.twitter.com');
      expect(response.statusCode).to.equal(200);
      expect(response.res.statusMessage).to.equal('OK');
      // eslint-disable-next-line no-unused-expressions
      expect(response.body).to.be.empty;
      expect(response.res.text).to.be.a('string');
    });

    it('should return error for wrong twitter authentication endpoint', async () => {
      const response = await chai.request(app)
        .get('/twitter');
      expect(response.res.connection.servername).to.equal(undefined);
      expect(response.statusCode).to.equal(404);
      expect(response.res.statusMessage).to.equal('Not Found');
    });
  });

  describe('API endpoint: auth/social', () => {
    it('should register user and respond with user payload', (done) => {
      const payload = {
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        email: faker.internet.email(),
        socialType: 'facebook',
        socialId: 3212313213,
      };

      chai
        .request(app)
        .post('/api/v1/auth/social')
        .send(payload)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(STATUS.OK);
          expect(res.body)
            .to.haveOwnProperty('user')
            .to.have.keys(['id', 'email', 'token']);
          done();
        });
    });
    it('should return an error if payload is invalid', (done) => {
      const payload = {
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        email: 'invalid email',
        socialType: 'invalid provider',
        socialId: 'invalid',
      };

      chai
        .request(app)
        .post('/api/v1/auth/social')
        .send(payload)
        .end((err, res) => {
          expect(res).to.have.status(STATUS.BAD_REQUEST);
          expect(res.body)
            .to.haveOwnProperty('data')
            .to.be.an('array')
            .to.be.lengthOf(3);
          done();
        });
    });
  });
});
