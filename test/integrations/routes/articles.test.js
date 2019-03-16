/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import faker from 'faker';
import chaiHttp from 'chai-http';
import app from '../../../index';
import models from '../../../models';
import { STATUS } from '../../../helpers/constants';
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
            expect(res.body.message).to.equal('an article with that title already exist');
            done();
          });
      });
    });
  });

  describe('GET: /api/v1/articles', () => {
    it('Should return all articles', (done) => {
      chai
        .request(app)
        .get('/api/v1/articles')
        .set({ Authorization: `Bearer ${authToken}` })
        .end((err, res) => {
          expect(res).to.have.status(STATUS.OK);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.OK);
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
