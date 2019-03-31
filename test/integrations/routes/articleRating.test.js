import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../server';
import models from '../../../server/models';
import { auth } from '../../helpers';

chai.use(chaiHttp);

const dummyUser = {
  email: 'faker4678@email.com',
  password: 'i2345678',
  username: 'heron419'
};

describe('Article Rating API endpoint', () => {
  let authToken;
  const createUser = async () => {
    try {
      const user = await models.User.create(dummyUser);
      return user;
    } catch (error) {
      return error;
    }
  };

  before(async () => {
    await createUser();
    const response = await auth(dummyUser);
    authToken = response.body.token;
  });
  // const token = process.env.JWT_TOKEN;
  describe('/rating Post Endpoint', () => {
    it('should rate an article', async () => {
      const rateArticle = {
        stars: 5,
      };
      const res = await chai.request(app)
        .post('/api/v1/articles/2/ratings')
        .set({ Authorization: `Bearer ${authToken}` })
        .send(rateArticle);
      expect(res.body.code).to.equal(201);
      expect(res.body.data).to.be.an('object');
      expect(res.body.message).to.equal('success');
      expect(res.body.status).to.equal(true);
    });

    it('should return a error for invalid rating input', async () => {
      const rateArticle = {
        stars: 8,
      };
      const res = await chai.request(app)
        .post('/api/v1/articles/2/ratings')
        .set({ Authorization: `Bearer ${authToken}` })
        .send(rateArticle);
      expect(res.body.code).to.equal(400);
      // eslint-disable-next-line no-unused-expressions
      expect(res.body.data).to.be.empty;
      expect(res.body.message).to.equal('Input cannot be less than 1 or greater than 5');
      expect(res.body.status).to.equal(false);
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

    it('should return error for non-existing article', async () => {
      const res = await chai.request(app)
        .get('/api/v1/articles/b/ratings');
      expect(res.body.code).to.equal(404);
      expect(res.body.message).to.equal('ARTICLE NOT FOUND');
      expect(res.body.status).to.equal('Failure');
    });
  });
});
