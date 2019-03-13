/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import faker from 'faker';
import Bluebird from 'bluebird';
import chaiHttp from 'chai-http';
import app from '../../../index';
import models from '../../../models';
import { STATUS } from '../../../helpers/constants';

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
        const article = { ...dummyArticle };
        article.title = '';
        chai
          .request(app)
          .post('/api/v1/articles')
          .send(article)
          .set({ Authorization: `Bearer ${dummyUser.token}` })
          .end((err, res) => {
            expect(res).to.have.status(STATUS.BAD_REQUEST);
            expect(res.body).to.be.an('object');
            expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.BAD_REQUEST);
            expect(res.body.message).to.equal('title cannot be empty');
            done();
          });
      });
    });
  });

  describe('POST: /api/v1/articles', () => {
    describe('create an article without a description', () => {
      it('Should return an error', (done) => {
        const article = { ...dummyArticle };
        article.description = '';
        chai
          .request(app)
          .post('/api/v1/articles')
          .send(article)
          .set({ Authorization: `Bearer ${dummyUser.token}` })
          .end((err, res) => {
            expect(res).to.have.status(STATUS.BAD_REQUEST);
            expect(res.body).to.be.an('object');
            expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.BAD_REQUEST);
            expect(res.body.message).to.equal('description cannot be empty');
            done();
          });
      });
    });
  });

  describe('POST: /api/v1/articles', () => {
    describe('create an article without the body', () => {
      it('Should return an error', (done) => {
        const article = { ...dummyArticle };
        article.body = '';
        chai
          .request(app)
          .post('/api/v1/articles')
          .send(article)
          .set({ Authorization: `Bearer ${dummyUser.token}` })
          .end((err, res) => {
            expect(res).to.have.status(STATUS.BAD_REQUEST);
            expect(res.body).to.be.an('object');
            expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.BAD_REQUEST);
            expect(res.body.message).to.equal('body cannot be empty');
            done();
          });
      });
    });
  });

  describe('POST: /api/v1/articles', () => {
    describe('create an article with a body of numbers', () => {
      it('Should return an error', (done) => {
        const article = { ...dummyArticle };
        article.body = 78909;
        chai
          .request(app)
          .post('/api/v1/articles')
          .send(article)
          .set({ Authorization: `Bearer ${dummyUser.token}` })
          .end((err, res) => {
            expect(res).to.have.status(STATUS.BAD_REQUEST);
            expect(res.body).to.be.an('object');
            expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.BAD_REQUEST);
            expect(res.body.message).to.equal('body must be a string');
            done();
          });
      });
    });
  });

  describe('POST: /api/v1/articles', () => {
    describe('create an article with a title of numbers', () => {
      it('Should return an error', (done) => {
        const article = { ...dummyArticle };
        article.title = 897867;
        chai
          .request(app)
          .post('/api/v1/articles')
          .send(article)
          .set({ Authorization: `Bearer ${dummyUser.token}` })
          .end((err, res) => {
            expect(res).to.have.status(STATUS.BAD_REQUEST);
            expect(res.body).to.be.an('object');
            expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.BAD_REQUEST);
            expect(res.body.message).to.equal('title must be a string');
            done();
          });
      });
    });
  });

  describe('POST: /api/v1/articles', () => {
    describe('create an article with a description of numbers', () => {
      it('Should return an error', (done) => {
        const article = { ...dummyArticle };
        article.description = 7877665;
        chai
          .request(app)
          .post('/api/v1/articles')
          .send(article)
          .set({ Authorization: `Bearer ${dummyUser.token}` })
          .end((err, res) => {
            expect(res).to.have.status(STATUS.BAD_REQUEST);
            expect(res.body).to.be.an('object');
            expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.BAD_REQUEST);
            expect(res.body.message).to.equal('description must be a string');
            done();
          });
      });
    });
  });

  describe('POST: /api/v1/articles', () => {
    describe('create an article with a body of empty string', () => {
      it('Should return an error', (done) => {
        const article = { ...dummyArticle };
        article.body = '    ';
        chai
          .request(app)
          .post('/api/v1/articles')
          .send(article)
          .set({ Authorization: `Bearer ${dummyUser.token}` })
          .end((err, res) => {
            expect(res).to.have.status(STATUS.BAD_REQUEST);
            expect(res.body).to.be.an('object');
            expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.BAD_REQUEST);
            expect(res.body.message).to.equal('body cannot be empty');
            done();
          });
      });
    });
  });

  describe('POST: /api/v1/articles', () => {
    describe('create an article with a title of empty string', () => {
      it('Should return an error', (done) => {
        const article = { ...dummyArticle };
        article.title = '     ';
        chai
          .request(app)
          .post('/api/v1/articles')
          .send(article)
          .set({ Authorization: `Bearer ${dummyUser.token}` })
          .end((err, res) => {
            expect(res).to.have.status(STATUS.BAD_REQUEST);
            expect(res.body).to.be.an('object');
            expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.BAD_REQUEST);
            expect(res.body.message).to.equal('title cannot be empty');
            done();
          });
      });
    });
  });

  describe('POST: /api/v1/articles', () => {
    describe('create an article with a description of empty string', () => {
      it('Should return an error', (done) => {
        const article = { ...dummyArticle };
        article.description = '    ';
        chai
          .request(app)
          .post('/api/v1/articles')
          .send(article)
          .set({ Authorization: `Bearer ${dummyUser.token}` })
          .end((err, res) => {
            expect(res).to.have.status(STATUS.BAD_REQUEST);
            expect(res.body).to.be.an('object');
            expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.BAD_REQUEST);
            expect(res.body.message).to.equal('description cannot be empty');
            done();
          });
      });
    });
  });

  describe('POST: /api/v1/articles', () => {
    describe('verify slugs are being created from the title', () => {
      it('Should create an article with a slug', (done) => {
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
            expect(res).to.have.status(STATUS.CREATED);
            expect(res.body).to.be.an('object');
            expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.CREATED);
            expect(res.body.data.slug).to.be.a('string');
            done();
          });
      });
    });
  });
});
