/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import faker from 'faker';
import chaiHttp from 'chai-http';
import app from '../../../index';
import models from '../../../models';
import logger from '../../../helpers/logger';
import { STATUS } from '../../../helpers/constants';

logger.log('The test is running');
chai.use(chaiHttp);

const {
  CREATED,
  BAD_REQUEST,
} = STATUS;

let authpayload;
let authpayload2;
let articlePayload;

let dummyUser = {
  email: faker.internet.email(),
  password: 'i2345678',
  username: 'error-test'
};

let dummyUser2 = {
  email: faker.internet.email(),
  password: 'p98765435667',
  username: 'murderer-inc'
};

let dummyArticle2;

const dummyArticle = {
  title: faker.lorem.sentence(),
  description: faker.lorem.sentences(),
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

const createUser2 = async () => {
  try {
    const user = await models.User.create(dummyUser2);
    dummyUser2 = user;
    return dummyUser2;
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

    createUser2();
    authpayload2 = await chai.request(app)
      .post('/api/v1/users/login')
      .send(dummyUser2);
    dummyUser2.token = authpayload2.body.token;

    articlePayload = await chai.request(app)
      .post('/api/v1/articles')
      .send({
        title: 'some gibberish',
        description: 'more gibberish',
        body: faker.lorem.paragraphs()
      })
      .set({ Authorization: `Bearer ${dummyUser2.token}` });

    dummyArticle2 = articlePayload.body.data;
    // return dummyUser;
  });

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
            expect(res).to.have.status(BAD_REQUEST);
            expect(res.body).to.be.an('object');
            expect(res.body).to.haveOwnProperty('code').to.equal(BAD_REQUEST);
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
            expect(res).to.have.status(BAD_REQUEST);
            expect(res.body).to.be.an('object');
            expect(res.body).to.haveOwnProperty('code').to.equal(BAD_REQUEST);
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
            expect(res).to.have.status(BAD_REQUEST);
            expect(res.body).to.be.an('object');
            expect(res.body).to.haveOwnProperty('code').to.equal(BAD_REQUEST);
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
            expect(res).to.have.status(BAD_REQUEST);
            expect(res.body).to.be.an('object');
            expect(res.body).to.haveOwnProperty('code').to.equal(BAD_REQUEST);
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
            expect(res).to.have.status(BAD_REQUEST);
            expect(res.body).to.be.an('object');
            expect(res.body).to.haveOwnProperty('code').to.equal(BAD_REQUEST);
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
            expect(res).to.have.status(BAD_REQUEST);
            expect(res.body).to.be.an('object');
            expect(res.body).to.haveOwnProperty('code').to.equal(BAD_REQUEST);
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
            expect(res).to.have.status(BAD_REQUEST);
            expect(res.body).to.be.an('object');
            expect(res.body).to.haveOwnProperty('code').to.equal(BAD_REQUEST);
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
            expect(res).to.have.status(BAD_REQUEST);
            expect(res.body).to.be.an('object');
            expect(res.body).to.haveOwnProperty('code').to.equal(BAD_REQUEST);
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
            expect(res).to.have.status(BAD_REQUEST);
            expect(res.body).to.be.an('object');
            expect(res.body).to.haveOwnProperty('code').to.equal(BAD_REQUEST);
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
          title: faker.random.words(),
          description: 'dehjfjdh',
          body: 'sentence'
        };
        chai
          .request(app)
          .post('/api/v1/articles')
          .send(article)
          .set({ Authorization: `Bearer ${dummyUser.token}` })
          .end((err, res) => {
            expect(res).to.have.status(CREATED);
            expect(res.body).to.be.an('object');
            expect(res.body).to.haveOwnProperty('code').to.equal(CREATED);
            expect(res.body.data.slug).to.be.a('string');
            done();
          });
      });
    });
  });

  describe('GET: /api/v1/articles/:slug', () => {
    it('Should return an error if the article id is a string', (done) => {
      chai
        .request(app)
        .get('/api/v1/articles/uyo')
        .set({ Authorization: `Bearer ${dummyUser.token}` })
        .end((err, res) => {
          expect(res).to.have.status(STATUS.NOT_FOUND);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.NOT_FOUND);
          expect(res.body.message).to.be.equal('no article with slug: uyo found');
          done();
        });
    });
  });

  describe('GET: /api/v1/articles/:slug', () => {
    it('Should return an error if article id is less than 0', (done) => {
      chai
        .request(app)
        .get(`/api/v1/articles/${-4}`)
        .set({ Authorization: `Bearer ${dummyUser.token}` })
        .end((err, res) => {
          expect(res).to.have.status(STATUS.NOT_FOUND);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.NOT_FOUND);
          expect(res.body.message).to.be.equal('no article with slug: -4 found');
          done();
        });
    });
  });

  describe('PUT: /api/v1/articles/:articleId', () => {
    it('Should return an error if no article id is provided', (done) => {
      chai
        .request(app)
        .put(`/api/v1/articles/${'   '}`)
        .set({ Authorization: `Bearer ${dummyUser.token}` })
        .end((err, res) => {
          expect(res).to.have.status(STATUS.NOT_FOUND);

          done();
        });
    });
  });

  describe('PUT: /api/v1/articles/:articleId', () => {
    it('Should return an error if the article id is a string', (done) => {
      chai
        .request(app)
        .put('/api/v1/articles/uyo')
        .set({ Authorization: `Bearer ${dummyUser.token}` })
        .end((err, res) => {
          expect(res).to.have.status(STATUS.BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.BAD_REQUEST);
          expect(res.body.message).to.be.equal('article Id is not a number');
          done();
        });
    });
  });

  describe('PUT: /api/v1/articles/:articleId', () => {
    it('Should return an error if article id is less than 0', (done) => {
      chai
        .request(app)
        .put(`/api/v1/articles/${-4}`)
        .set({ Authorization: `Bearer ${dummyUser.token}` })
        .end((err, res) => {
          expect(res).to.have.status(STATUS.BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.BAD_REQUEST);
          expect(res.body.message).to.be.equal('article Id is not valid');
          done();
        });
    });
  });

  describe('PUT: /api/v1/articles/:articleId', () => {
    it('Should return an error if authorId is incorrect', (done) => {
      chai
        .request(app)
        .put(`/api/v1/articles/${dummyArticle2.id}`)
        .set({ Authorization: `Bearer ${dummyUser.token}` })
        .end((err, res) => {
          expect(res).to.have.status(STATUS.FORBIDDEN);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.FORBIDDEN);
          expect(res.body.message).to.be.equal('you do not have the right to update this article');
          done();
        });
    });
  });

  describe('DELETE: /api/v1/article/:articleId', () => {
    it('Should return an error if no article id is provided', (done) => {
      chai
        .request(app)
        .delete(`/api/v1/articles/${'   '}`)
        .set({ Authorization: `Bearer ${dummyUser.token}` })
        .end((err, res) => {
          expect(res).to.have.status(STATUS.NOT_FOUND);
          done();
        });
    });
  });

  describe('DELETE: /api/v1/article/:articleId', () => {
    it('Should return an error if the article id is a string', (done) => {
      chai
        .request(app)
        .delete('/api/v1/articles/uyo')
        .set({ Authorization: `Bearer ${dummyUser.token}` })
        .end((err, res) => {
          expect(res).to.have.status(STATUS.BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.BAD_REQUEST);
          expect(res.body.message).to.be.equal('article Id was not provided');
          done();
        });
    });
  });

  describe('DELETE: /api/v1/articles/:articleId', () => {
    it('Should return an error if article id is less than 0', (done) => {
      chai
        .request(app)
        .delete(`/api/v1/articles/${-4}`)
        .set({ Authorization: `Bearer ${dummyUser.token}` })
        .end((err, res) => {
          expect(res).to.have.status(STATUS.BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.BAD_REQUEST);
          expect(res.body.message).to.be.equal('article Id is not valid');
          done();
        });
    });
  });

  describe('DELETE: /api/v1/articles/:articleId', () => {
    it('Should return an error if authorId is incorrect', (done) => {
      chai
        .request(app)
        .delete(`/api/v1/articles/${dummyArticle2.id}`)
        .set({ Authorization: `Bearer ${dummyUser.token}` })
        .end((err, res) => {
          expect(res).to.have.status(STATUS.FORBIDDEN);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.FORBIDDEN);
          expect(res.body.message).to.be.equal('you do not have the right to delete this article');
          done();
        });
    });
  });
});
