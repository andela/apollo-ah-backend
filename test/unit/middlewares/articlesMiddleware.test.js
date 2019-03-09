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
  username: 'error-test'
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

describe('API endpoint: /api/articles (Middleware test)', () => {
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
    describe('create an article without a title', () => {
      it('Should return an error', (done) => {
        dummyArticle.title = '';
        chai
          .request(app)
          .post('/api/v1/articles')
          .send(dummyArticle)
          .set({ Authorization: `Bearer ${dummyUser.token}` })
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(typeof res.body).to.equal('object');
            done();
          });
      });
    });
  });

  describe('POST: /api/v1/articles', () => {
    describe('create an article without a description', () => {
      it('Should return an error', (done) => {
        dummyArticle.description = '';
        chai
          .request(app)
          .post('/api/v1/articles')
          .send(dummyArticle)
          .set({ Authorization: `Bearer ${dummyUser.token}` })
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(typeof res.body).to.equal('object');
            done();
          });
      });
    });
  });

  describe('POST: /api/v1/articles', () => {
    describe('create an article without the body', () => {
      it('Should return an error', (done) => {
        dummyArticle.body = '';
        chai
          .request(app)
          .post('/api/v1/articles')
          .send(dummyArticle)
          .set({ Authorization: `Bearer ${dummyUser.token}` })
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(typeof res.body).to.equal('object');
            done();
          });
      });
    });
  });

  describe('POST: /api/v1/articles', () => {
    describe('create an article with a body of numbers', () => {
      it('Should return an error', (done) => {
        dummyArticle.body = 1234;
        chai
          .request(app)
          .post('/api/v1/articles')
          .send(dummyArticle)
          .set({ Authorization: `Bearer ${dummyUser.token}` })
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(typeof res.body).to.equal('object');
            done();
          });
      });
    });
  });

  describe('POST: /api/v1/articles', () => {
    describe('create an article with a title of numbers', () => {
      it('Should return an error', (done) => {
        dummyArticle.title = 1234;
        chai
          .request(app)
          .post('/api/v1/articles')
          .send(dummyArticle)
          .set({ Authorization: `Bearer ${dummyUser.token}` })
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(typeof res.body).to.equal('object');
            done();
          });
      });
    });
  });

  describe('POST: /api/v1/articles', () => {
    describe('create an article with a description of numbers', () => {
      it('Should return an error', (done) => {
        dummyArticle.description = 1234;
        chai
          .request(app)
          .post('/api/v1/articles')
          .send(dummyArticle)
          .set({ Authorization: `Bearer ${dummyUser.token}` })
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(typeof res.body).to.equal('object');
            done();
          });
      });
    });
  });

  describe('POST: /api/v1/articles', () => {
    describe('create an article with a body of empty string', () => {
      it('Should return an error', (done) => {
        dummyArticle.body = '     ';
        chai
          .request(app)
          .post('/api/v1/articles')
          .send(dummyArticle)
          .set({ Authorization: `Bearer ${dummyUser.token}` })
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(typeof res.body).to.equal('object');
            done();
          });
      });
    });
  });

  describe('POST: /api/v1/articles', () => {
    describe('create an article with a title of empty string', () => {
      it('Should return an error', (done) => {
        dummyArticle.title = '     ';
        chai
          .request(app)
          .post('/api/v1/articles')
          .send(dummyArticle)
          .set({ Authorization: `Bearer ${dummyUser.token}` })
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(typeof res.body).to.equal('object');
            done();
          });
      });
    });
  });

  describe('POST: /api/v1/articles', () => {
    describe('create an article with a description of empty string', () => {
      it('Should return an error', (done) => {
        dummyArticle.description = '     ';
        chai
          .request(app)
          .post('/api/v1/articles')
          .send(dummyArticle)
          .set({ Authorization: `Bearer ${dummyUser.token}` })
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(typeof res.body).to.equal('object');
            done();
          });
      });
    });
  });

  describe('POST: /api/v1/articles', () => {
    describe('verify slugs are being created from the title', () => {
      it('Should return an error', (done) => {
        const article = {
          title: 'no errors allowed',
          description: 'dehjfjdh',
          body: 'sentence'
        };
        chai
          .request(app)
          .post('/api/v1/articles')
          .send(article)
          .set({ Authorization: `Bearer ${dummyUser.token}` })
          .end((err, res) => {
            expect(res.status).to.equal(201);
            expect(typeof res.body).to.equal('object');
            expect(res.body.slug).to.be.a('string');
            done();
          });
      });
    });
  });
});
