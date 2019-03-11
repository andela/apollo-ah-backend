import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../index';

chai.use(chaiHttp);

describe('API endpoint: /api/auth', () => {

  describe('/facebook Auth Endpoint', () => {
    it('should redirect to facebook authentication page', async () => {
      const response = await chai.request(app)
        .get('/api/v1/auth/facebook');
        expect(response.res.connection.servername).to.equal('m.facebook.com');
        expect(response.statusCode).to.equal(200);
        expect(response.res.statusMessage).to.equal('OK');
        expect(response.body).to.be.empty;
    });

    it('should return error for wrong facebook authentication endpoint', async () => {
      const response = await chai.request(app)
        .get('/v1/auth/facebook');
        expect(response.res.connection.servername).to.be.undefined;
        expect(response.statusCode).to.equal(404);
        expect(response.res.statusMessage).to.equal('Not Found');
    })
  });

  describe('/gooogle Auth Endpoint', () => {
    it('should redirect to google authentication page', async () =>{
      const response = await chai.request(app)
      .get('/api/v1/auth/google');
      expect(response.res.connection.servername).to.equal('accounts.google.com');
      expect(response.statusCode).to.equal(200);
      expect(response.res.statusMessage).to.equal('OK');
      expect(response.body).to.be.empty;
      expect(response.res.text).to.be.a('string');
    });

    it('should return error for wrong google authentication endpoint', async () => {
      const response = await chai.request(app)
        .get('/auth/google');
        expect(response.res.connection.servername).to.be.undefined;
        expect(response.statusCode).to.equal(404);
        expect(response.res.statusMessage).to.equal('Not Found');
    });
  });

  describe('/twitter Auth Endpoint', () => {
    it('should redirect to twitter authentication page', async () =>{
      const response = await chai.request(app)
      .get('/api/v1/auth/twitter');
      expect(response.res.connection.servername).to.equal('api.twitter.com');
      expect(response.statusCode).to.equal(200);
      expect(response.res.statusMessage).to.equal('OK');
      expect(response.body).to.be.empty;
      expect(response.res.text).to.be.a('string');
    });

    it('should return error for wrong twitter authentication endpoint', async () => {
      const response = await chai.request(app)
        .get('/twitter');
        expect(response.res.connection.servername).to.be.undefined;
        expect(response.statusCode).to.equal(404);
        expect(response.res.statusMessage).to.equal('Not Found');
    });
  });
});
