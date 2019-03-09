/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import faker from 'faker';
import Bluebird from 'bluebird';
import chaiHttp from 'chai-http';
import app from '../../../index';
import models from '../../../models';
import logger from '../../../helpers/logger';

logger.log('The test is running');
chai.use(chaiHttp);

let authpayload;

let dummyUser = {
  email: 'faker@email.com',
  password: 'i2345678',
  username: 'heron419'
};

const dummyArticle = {
  title: 'Hello world',
  description: 'lorem ipsum exists',
  body: faker.lorem.paragraphs(),
};

const createUser = async () => {
  try {
    const user = await models.User.create(dummyUser);
    dummyUser = user;
    return dummyUser;
  } catch (error) {
    return error;
  }
};

describe('API endpoint: /api/articles (Routes)', () => {
  before(async () => {
    models.sequelize.sync();
    createUser();
    authpayload = await chai.request(app)
      .post('/api/v1/users/login')
      .send(dummyUser);
    dummyUser.token = authpayload.body.token;
    return dummyUser;
  });
  after(() => Bluebird.all([models.Article.destroy({ truncate: true })]));

  describe('POST: /api/v1/articles', () => {
    it('Should create an article', (done) => {
      chai
        .request(app)
        .post('/api/v1/articles')
        .send(dummyArticle)
        .set({ Authorization: `Bearer ${dummyUser.token}` })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(typeof res.body).to.equal('object');
          expect(res.body.title).to.equal(dummyArticle.title);
          done();
        });
    });
  });

  describe('POST: /api/v1/articles', () => {
    describe('A user tries to create a new article with an existing title', () => {
      it('Should create an article', (done) => {
        chai
          .request(app)
          .post('/api/v1/articles')
          .send(dummyArticle)
          .set({ Authorization: `Bearer ${dummyUser.token}` })
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(res.body.errors.body[0]).to.equal('an article with that title already exist');
            done();
          });
      });
    });
  });
});
