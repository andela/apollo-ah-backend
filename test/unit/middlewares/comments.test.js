/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import faker from 'faker';
import chaiHttp from 'chai-http';
import app from '../../../server';
import models from '../../../server/models';
import logger from '../../../server/helpers/logger';
import { STATUS } from '../../../server/helpers/constants';

logger.log('The test is running');
chai.use(chaiHttp);

let authpayload;
let authToken;
let newSlug;
let newComment;

let dummyUser = {
  email: faker.internet.email(),
  password: 'iOpur7879w89we',
  username: faker.name.firstName()
};

const dummyArticle = {
  title: faker.lorem.sentence(),
  description: faker.lorem.sentence(),
  body: faker.lorem.paragraphs(),
  categoryId: 1,
};

const dummyComment = { body: faker.lorem.sentence() };

const createUser = async () => {
  try {
    const user = await models.User.create(dummyUser);
    dummyUser = user;
    return dummyUser;
  } catch (error) {
    return error;
  }
};

before(async () => {
  createUser();
  authpayload = await chai
    .request(app)
    .post('/api/v1/users/login')
    .send(dummyUser);
  authToken = authpayload.body.token;

  const newArticle = await chai
    .request(app)
    .post('/api/v1/articles/')
    .send(dummyArticle)
    .set({ Authorization: `Bearer ${authToken}` });
  newSlug = newArticle.body.data.slug;

  const articleComment = await chai
    .request(app)
    .post(`/api/v1/articles/${newSlug}/comments/`)
    .send(dummyComment)
    .set({ Authorization: `Bearer ${authToken}` });
  newComment = articleComment.body.data;
});

describe('API endpoint: /api/articles/:slug/comments (Middlewares)', () => {
  describe('POST: creates a comment', () => {
    it('Should return an error when slug is an empty string', (done) => {
      const comment = { body: faker.lorem.paragraph() };
      chai
        .request(app)
        .post(`/api/v1/articles/${'     '}/comments`)
        .send(comment)
        .set({ Authorization: `Bearer ${authToken}` })
        .end((err, res) => {
          expect(res).to.have.status(STATUS.BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.BAD_REQUEST);
          expect(res.body.message).to.equal('slug not provided');
          done();
        });
    });

    it('Should return an error when slug is invalid', (done) => {
      const comment = { body: faker.lorem.sentence() };
      chai
        .request(app)
        .post(`/api/v1/articles/${89876}/comments`)
        .send(comment)
        .set({ Authorization: `Bearer ${authToken}` })
        .end((err, res) => {
          expect(res).to.have.status(STATUS.NOT_FOUND);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.NOT_FOUND);
          expect(res.body.message).to.equal('No article with that slug exist');
          done();
        });
    });

    it('Should return an error when body is not provided', (done) => {
      const comment = { body: '    ' };
      chai
        .request(app)
        .post(`/api/v1/articles/${newSlug}/comments`)
        .send(comment)
        .set({ Authorization: `Bearer ${authToken}` })
        .end((err, res) => {
          expect(res).to.have.status(STATUS.BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.BAD_REQUEST);
          expect(res.body.message).to.equal('body not provided');
          done();
        });
    });

    it('Should return an error if user field is not a boolean', (done) => {
      const comment = { body: faker.lorem.sentences() };
      chai
        .request(app)
        .post(`/api/v1/articles/${newSlug}/comments`)
        .send({ ...comment, isAnonymousUser: 'anonkjfjhfds' })
        .set({ Authorization: `Bearer ${authToken}` })
        .end((err, res) => {
          expect(res).to.have.status(STATUS.BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.BAD_REQUEST);
          expect(res.body.message).to.equal('user field only accepts boolean');
          done();
        });
    });
  });

  describe('GET all comments', () => {
    it('Should return an error if article does not exist', (done) => {
      chai
        .request(app)
        .get(`/api/v1/articles/${newSlug + 345}/comments`)
        .set({ Authorization: `Bearer ${authToken}` })
        .end((err, res) => {
          expect(res).to.have.status(STATUS.NOT_FOUND);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.NOT_FOUND);
          expect(res.body.message).to.equal('No article with that slug exist');
          done();
        });
    });
    it('Should return an error when slug is an empty string', (done) => {
      chai
        .request(app)
        .get(`/api/v1/articles/${'     '}/comments`)
        .set({ Authorization: `Bearer ${authToken}` })
        .end((err, res) => {
          expect(res).to.have.status(STATUS.BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.BAD_REQUEST);
          expect(res.body.message).to.equal('slug not provided');
          done();
        });
    });
    it('Should return an error when slug is invalid', (done) => {
      chai
        .request(app)
        .get('/api/v1/articles/non-exisitng-slug/comments')
        .set({ Authorization: `Bearer ${authToken}` })
        .end((err, res) => {
          expect(res).to.have.status(STATUS.NOT_FOUND);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.NOT_FOUND);
          expect(res.body.message).to.equal('No article with that slug exist');
          done();
        });
    });
  });

  describe('PUT: updates a single comment', () => {
    it('Should return an error when slug is an empty string', (done) => {
      const comment = { body: faker.lorem.paragraph() };
      chai
        .request(app)
        .put(`/api/v1/articles/${'     '}/comments/${newComment.id}`)
        .send(comment)
        .set({ Authorization: `Bearer ${authToken}` })
        .end((err, res) => {
          expect(res).to.have.status(STATUS.BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.BAD_REQUEST);
          expect(res.body.message).to.equal('slug not provided');
          done();
        });
    });
    it('Should return an error when comment ID is not a number', (done) => {
      const comment = { body: faker.lorem.paragraph() };
      chai
        .request(app)
        .put(`/api/v1/articles/${newSlug}/comments/${'uyo'}`)
        .send(comment)
        .set({ Authorization: `Bearer ${authToken}` })
        .end((err, res) => {
          expect(res).to.have.status(STATUS.BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.BAD_REQUEST);
          expect(res.body.message).to.equal('the comment id is invalid');
          done();
        });
    });
    it('Should return an error when comment body is empty', (done) => {
      const comment = { body: '  ' };
      chai
        .request(app)
        .put(`/api/v1/articles/${newSlug}/comments/${newComment.id}`)
        .send(comment)
        .set({ Authorization: `Bearer ${authToken}` })
        .end((err, res) => {
          expect(res).to.have.status(STATUS.BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.BAD_REQUEST);
          expect(res.body.message).to.equal('comment body not provided');
          done();
        });
    });
    it('Should return an error if user field is not a boolean', (done) => {
      const comment = { body: faker.lorem.paragraph(), isAnonymousUser: 'sdiuydsghsd' };
      chai
        .request(app)
        .put(`/api/v1/articles/${newSlug}/comments/${newComment.id}`)
        .send(comment)
        .set({ Authorization: `Bearer ${authToken}` })
        .end((err, res) => {
          expect(res).to.have.status(STATUS.BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.BAD_REQUEST);
          expect(res.body.message).to.equal('user field only accepts booleans');
          done();
        });
    });
    it('Should return an error when slug is invalid', (done) => {
      const comment = { body: faker.lorem.paragraph() };
      chai
        .request(app)
        .put(`/api/v1/articles/${newSlug + 456}/comments/${newComment.id}`)
        .set({ Authorization: `Bearer ${authToken}` })
        .send(comment)
        .end((err, res) => {
          expect(res).to.have.status(STATUS.NOT_FOUND);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.NOT_FOUND);
          expect(res.body.message).to.equal('No article with that slug exist');
          done();
        });
    });
    it('Should return an error if body is not provided', (done) => {
      chai
        .request(app)
        .put(`/api/v1/articles/${newSlug}/comments/${newComment.id}`)
        .send({ body: '' })
        .set({ Authorization: `Bearer ${authToken}` })
        .end((err, res) => {
          expect(res).to.have.status(STATUS.BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.BAD_REQUEST);
          expect(res.body.message).to.equal('comment body not provided');
          done();
        });
    });
    it('Should return an error when comment ID is invalid', (done) => {
      const comment = { body: faker.lorem.paragraph() };
      chai
        .request(app)
        .put(`/api/v1/articles/${newSlug}/comments/${newComment.id + 100}`)
        .set({ Authorization: `Bearer ${authToken}` })
        .send(comment)
        .end((err, res) => {
          expect(res).to.have.status(STATUS.NOT_FOUND);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.NOT_FOUND);
          expect(res.body.message).to.equal('the comment does not exist');
          done();
        });
    });
  });

  describe('DELETE: deletes a single comment', () => {
    it('Should return an error when slug is an empty string', (done) => {
      chai
        .request(app)
        .delete(`/api/v1/articles/${'     '}/comments/${newComment.id}`)
        .set({ Authorization: `Bearer ${authToken}` })
        .end((err, res) => {
          expect(res).to.have.status(STATUS.BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.BAD_REQUEST);
          expect(res.body.message).to.equal('slug not provided');
          done();
        });
    });
    it('Should return an error when comment ID is not a number', (done) => {
      chai
        .request(app)
        .delete(`/api/v1/articles/${newSlug}/comments/${'uyo'}`)
        .set({ Authorization: `Bearer ${authToken}` })
        .end((err, res) => {
          expect(res).to.have.status(STATUS.BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.BAD_REQUEST);
          expect(res.body.message).to.equal('the comment id is invalid');
          done();
        });
    });
    it('Should return an error when slug is invalid', (done) => {
      chai
        .request(app)
        .delete(`/api/v1/articles/${newSlug + 456}/comments/${newComment.id}`)
        .set({ Authorization: `Bearer ${authToken}` })
        .end((err, res) => {
          expect(res).to.have.status(STATUS.NOT_FOUND);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.NOT_FOUND);
          expect(res.body.message).to.equal('No article with that slug exist');
          done();
        });
    });
    it('Should return an error when comment ID is invalid', (done) => {
      chai
        .request(app)
        .delete(`/api/v1/articles/${newSlug}/comments/${newComment.id + 100}`)
        .set({ Authorization: `Bearer ${authToken}` })
        .end((err, res) => {
          expect(res).to.have.status(STATUS.NOT_FOUND);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.NOT_FOUND);
          expect(res.body.message).to.equal('the comment does not exist');
          done();
        });
    });
  });
});
