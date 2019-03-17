/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import faker from 'faker';
import chaiHttp from 'chai-http';
import app from '../../../index';
import models from '../../../models';
import { STATUS, MESSAGE, PAGE_LIMIT } from '../../../helpers/constants';
import { auth } from '../../helpers';

chai.use(chaiHttp);

let authpayload;
let authToken;

const dummyUser = {
  email: 'faker4678@email.com',
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
    return user;
  } catch (error) {
    return error;
  }
};

before(async () => {
  await createUser();
  authpayload = await auth(dummyUser);
  authToken = authpayload.body.token;
});

describe('API endpoint: /api/articles (Routes)', () => {
  // after(() => Bluebird.all([models.Article.destroy({ truncate: false })]));

  describe('POST: /api/v1/articles', () => {
    it('Should create an article', (done) => {
      const fakeArticle = {
        title: faker.random.words(15),
        description: 'lorem ipsum exists',
        body: faker.lorem.paragraphs(),
      };
      chai
        .request(app)
        .post('/api/v1/articles')
        .send(fakeArticle)
        .set({ Authorization: `Bearer ${authToken}` })
        .end((err, res) => {
          dummyArticle.id = res.body.data.id;
          dummyArticle.slug = res.body.data.slug;
          expect(res).to.have.status(STATUS.CREATED);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.CREATED);
          expect(res.body.data.title).to.equal(fakeArticle.title);
          done();
        });
    });
  });

  describe('POST: /api/v1/articles', () => {
    describe('A user tries to create a new article with an existing title', () => {
      before((done) => {
        chai
          .request(app)
          .post('/api/v1/articles')
          .send(dummyArticle)
          .set({ Authorization: `Bearer ${authToken}` })
          .end((err, res) => done());
      });
      it('Should return an error', (done) => {
        chai
          .request(app)
          .post('/api/v1/articles')
          .send(dummyArticle)
          .set({ Authorization: `Bearer ${authToken}` })
          .end((err, res) => {
            expect(res).to.have.status(STATUS.FORBIDDEN);
            expect(res.body).to.be.an('object');
            expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.FORBIDDEN);
            expect(res.body.message).to.equal(MESSAGE.ARTICLE_EXIST);
            done();
          });
      });
    });
  });

  describe('GET: /api/v1/articles', () => {
    it(`Should return first ${PAGE_LIMIT} articles if page parameter is not provided`, (done) => {
      chai
        .request(app)
        .get('/api/v1/articles')
        .set({ Authorization: `Bearer ${authToken}` })
        .end((err, res) => {
          expect(res).to.have.status(STATUS.OK);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').equal(STATUS.OK);
          expect(res.body).to.haveOwnProperty('message').equal(MESSAGE.ARTICLES_FOUND);
          expect(res.body).to.haveOwnProperty('status').to.equal(true);
          expect(res.body).to.haveOwnProperty('data').to.be.an('object');
          expect(res.body.data).to.haveOwnProperty('articles').to.be.an('array');
          expect(res.body.data).to.haveOwnProperty('page');
          expect(res.body.data.page).to.haveOwnProperty('first').to.equal(1);
          expect(res.body.data.page).to.haveOwnProperty('current').to.equal(1);
          expect(res.body.data.page).to.haveOwnProperty('last').to.be.a('number');
          done();
        });
    });
    it(`Should return first ${PAGE_LIMIT} articles if page parameter is not a number`, (done) => {
      chai
        .request(app)
        .get('/api/v1/articles')
        .query({ page: 'NOT_A_NUMBER' })
        .end((err, res) => {
          expect(res).to.have.status(STATUS.OK);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').equal(STATUS.OK);
          expect(res.body).to.haveOwnProperty('message').equal(MESSAGE.ARTICLES_FOUND);
          expect(res.body).to.haveOwnProperty('status').to.equal(true);
          expect(res.body).to.haveOwnProperty('data').to.be.an('object');
          expect(res.body.data).to.haveOwnProperty('articles').to.be.an('array');
          expect(res.body.data).to.haveOwnProperty('page');
          expect(res.body.data.page).to.haveOwnProperty('first').to.equal(1);
          expect(res.body.data.page).to.haveOwnProperty('current').to.equal(1);
          expect(res.body.data.page).to.haveOwnProperty('last').to.be.a('number');
          done();
        });
    });
    it('Should return all articles in that page if page parameter is valid', (done) => {
      chai
        .request(app)
        .get('/api/v1/articles')
        .query({ page: 1 })
        .end((err, res) => {
          expect(res).to.have.status(STATUS.OK);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').equal(STATUS.OK);
          expect(res.body).to.haveOwnProperty('message').equal(MESSAGE.ARTICLES_FOUND);
          expect(res.body).to.haveOwnProperty('status').to.equal(true);
          expect(res.body).to.haveOwnProperty('data').to.be.an('object');
          expect(res.body.data).to.haveOwnProperty('articles').to.be.an('array');
          expect(res.body.data).to.haveOwnProperty('page');
          expect(res.body.data.page).to.haveOwnProperty('first').to.equal(1);
          expect(res.body.data.page).to.haveOwnProperty('current').to.equal(1);
          expect(res.body.data.page).to.haveOwnProperty('last').to.be.a('number');
          done();
        });
    });
    it(`Should return first ${PAGE_LIMIT} articles if page parameter is a negetive number`, (done) => {
      chai
        .request(app)
        .get('/api/v1/articles')
        .query({ page: -2 })
        .end((err, res) => {
          expect(res).to.have.status(STATUS.OK);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.OK);
          expect(res.body).to.haveOwnProperty('message').equal(MESSAGE.ARTICLES_FOUND);
          expect(res.body).to.haveOwnProperty('status').to.equal(true);
          expect(res.body).to.haveOwnProperty('data').to.be.an('object');
          expect(res.body.data).to.haveOwnProperty('articles').to.be.an('array');
          expect(res.body.data).to.haveOwnProperty('page');
          expect(res.body.data.page).to.haveOwnProperty('first').to.equal(1);
          expect(res.body.data.page).to.haveOwnProperty('current').to.equal(1);
          expect(res.body.data.page).to.haveOwnProperty('last').to.be.a('number');
          done();
        });
    });
    it('Should not return any articles if page parameter is larger than available articles', (done) => {
      chai
        .request(app)
        .get('/api/v1/articles')
        .query({ page: 100 })
        .end((err, res) => {
          expect(res).to.have.status(STATUS.NOT_FOUND);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.NOT_FOUND);
          expect(res.body).to.haveOwnProperty('code').equal(STATUS.NOT_FOUND);
          expect(res.body).to.haveOwnProperty('message').equal(MESSAGE.ARTICLES_NOT_FOUND);
          expect(res.body).to.haveOwnProperty('status').to.equal(false);
          expect(res.body).to.haveOwnProperty('data').to.be.an('array');
          done();
        });
    });
  });

  describe('GET: /api/v1/articles/:slug', () => {
    it('Should return a single article', (done) => {
      chai
        .request(app)
        .get(`/api/v1/articles/${dummyArticle.slug}`)
        .set({ Authorization: `Bearer ${authToken}` })
        .end((err, res) => {
          expect(res).to.have.status(STATUS.OK);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.OK);
          done();
        });
    });
  });

  describe('PUT: /api/v1/article/:articleId', () => {
    it('Should update a single article', (done) => {
      chai
        .request(app)
        .put(`/api/v1/articles/${dummyArticle.id}`)
        .set({ Authorization: `Bearer ${authToken}` })
        .send({ title: faker.lorem.sentence() })
        .end((err, res) => {
          expect(res).to.have.status(STATUS.OK);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.OK);
          done();
        });
    });
  });

  describe('DELETE: /api/v1/article/:articleId', () => {
    it('Should delete a single article', (done) => {
      chai
        .request(app)
        .delete(`/api/v1/articles/${dummyArticle.id}`)
        .set({ Authorization: `Bearer ${authToken}` })
        .end((err, res) => {
          expect(res).to.have.status(STATUS.OK);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.OK);
          done();
        });
    });
  });
});
