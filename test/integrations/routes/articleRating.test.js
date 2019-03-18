import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../index';

chai.use(chaiHttp);

describe('Article Rating API endpoint', () => {
  const token = process.env.JWT_TOKEN;
  describe('/rating Post Endpoint', () => {
    const rateArticle = {
      stars: 5,
    };

    it('should create an article', async () => {
      const res = await chai.request(app)
        .post('/api/v1/articles/2/ratings')
        .set({ Authorization: `Bearer ${token}` })
        .send(rateArticle);
      expect(res.body.code).to.equal(201);
      expect(res.body.data).to.be.an('object');
      expect(res.body.status).to.equal(true);
    });
  });

  describe('/rating Get Endpoint', () => {
    it('should get a rated article', async () => {
      const res = await chai.request(app)
        .get('/api/v1/articles/2/ratings');
      expect(res.body.code).to.equal(200);
      expect(res.body.message).to.equal('success');
      expect(res.body.status).to.equal(true);
    });
  });
});
