/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import faker from 'faker';
import chaiHttp from 'chai-http';
import app from '../../../server';
import logger from '../../../server/helpers/logger';
import { STATUS } from '../../../server/helpers/constants';

logger.log('The test is running');
chai.use(chaiHttp);

let authpayload;
let authToken;
let newSlug;
let commentId;
let newCommentId;

const dummyUser54 = {
  email: faker.internet.email(),
  password: 'i2345678',
  username: faker.name.firstName()
};

const dummyArticle = {
  title: faker.lorem.sentence(),
  description: faker.lorem.sentence(),
  body: faker.lorem.paragraphs(),
  categoryId: 1,
};

const dummyComment = {
  body: faker.lorem.sentence(),
};

before(async () => {
  authpayload = await chai
    .request(app)
    .post('/api/v1/users')
    .send(dummyUser54);
  authToken = authpayload.body.data.token;

  const newArticle = await chai
    .request(app)
    .post('/api/v1/articles/')
    .send(dummyArticle)
    .set({ Authorization: `Bearer ${authToken}` });
  newSlug = newArticle.body.data.slug;
  dummyArticle.id = newArticle.body.data.id;

  const newComment = await chai
    .request(app)
    .post(`/api/v1/articles/${newSlug}/comments`)
    .send(dummyComment)
    .set({ Authorization: `Bearer ${authToken}` });
  newCommentId = newComment.body.data.id;
});

describe('API endpoint: /api/articles/:slug/comments (Routes)', () => {
  it('Should create a comment', (done) => {
    const comment = { body: faker.lorem.sentence() };
    chai
      .request(app)
      .post(`/api/v1/articles/${newSlug}/comments`)
      .send(comment)
      .set({ Authorization: `Bearer ${authToken}` })
      .end((err, res) => {
        commentId = res.body.data.id;
        expect(res).to.have.status(STATUS.CREATED);
        expect(res.body).to.be.an('object');
        expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.CREATED);
        expect(res.body.message).to.equal('comment successfully created');
        done();
      });
  });

  it('Should create a comment as an anonymous user', (done) => {
    const comment = { body: faker.lorem.sentence(), isAnonymousUser: true };
    chai
      .request(app)
      .post(`/api/v1/articles/${newSlug}/comments`)
      .send(comment)
      .set({ Authorization: `Bearer ${authToken}` })
      .end((err, res) => {
        expect(res).to.have.status(STATUS.CREATED);
        expect(res.body).to.be.an('object');
        expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.CREATED);
        expect(res.body.message).to.equal('comment successfully created');
        done();
      });
  });

  it('Should get all comments', (done) => {
    chai
      .request(app)
      .get(`/api/v1/articles/${newSlug}/comments`)
      .set({ Authorization: `Bearer ${authToken}` })
      .end((err, res) => {
        expect(res).to.have.status(STATUS.OK);
        expect(res.body).to.be.an('object');
        expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.OK);
        expect(res.body.data.articles[0]).to.haveOwnProperty('CommentHistories');
        expect(res.body.message).to.equal('comments successfully fetched');
        done();
      });
  });

  it('Should update a comment', (done) => {
    const comment = { body: faker.lorem.sentence() };
    chai
      .request(app)
      .put(`/api/v1/articles/${newSlug}/comments/${commentId}`)
      .send(comment)
      .set({ Authorization: `Bearer ${authToken}` })
      .end((err, res) => {
        expect(res).to.have.status(STATUS.CREATED);
        expect(res.body).to.be.an('object');
        expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.CREATED);
        expect(res.body.message).to.equal('comment successfully updated');
        done();
      });
  });

  it('Should update a comment the second time', (done) => {
    const comment = { body: faker.lorem.sentence() };
    chai
      .request(app)
      .put(`/api/v1/articles/${newSlug}/comments/${commentId}`)
      .send(comment)
      .set({ Authorization: `Bearer ${authToken}` })
      .end((err, res) => {
        expect(res).to.have.status(STATUS.CREATED);
        expect(res.body).to.be.an('object');
        expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.CREATED);
        expect(res.body.message).to.equal('comment successfully updated');
        done();
      });
  });

  it('Should update a comment the third time', (done) => {
    const comment = { body: faker.lorem.sentence() };
    chai
      .request(app)
      .put(`/api/v1/articles/${newSlug}/comments/${commentId}`)
      .send(comment)
      .set({ Authorization: `Bearer ${authToken}` })
      .end((err, res) => {
        expect(res).to.have.status(STATUS.CREATED);
        expect(res.body).to.be.an('object');
        expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.CREATED);
        expect(res.body.message).to.equal('comment successfully updated');
        done();
      });
  });

  it('Should update a comment the fourth time', (done) => {
    const comment = { body: faker.lorem.sentence() };
    chai
      .request(app)
      .put(`/api/v1/articles/${newSlug}/comments/${commentId}`)
      .send(comment)
      .set({ Authorization: `Bearer ${authToken}` })
      .end((err, res) => {
        expect(res).to.have.status(STATUS.CREATED);
        expect(res.body).to.be.an('object');
        expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.CREATED);
        expect(res.body.message).to.equal('comment successfully updated');
        done();
      });
  });

  it('Should update a comment the fifth time', (done) => {
    const comment = { body: faker.lorem.sentence() };
    chai
      .request(app)
      .put(`/api/v1/articles/${newSlug}/comments/${commentId}`)
      .send(comment)
      .set({ Authorization: `Bearer ${authToken}` })
      .end((err, res) => {
        expect(res).to.have.status(STATUS.CREATED);
        expect(res.body).to.be.an('object');
        expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.CREATED);
        expect(res.body.message).to.equal('comment successfully updated');
        done();
      });
  });

  it('Should not edit a comment after 5 edits', (done) => {
    const comment = { body: faker.lorem.sentence() };
    chai
      .request(app)
      .put(`/api/v1/articles/${newSlug}/comments/${commentId}`)
      .send(comment)
      .set({ Authorization: `Bearer ${authToken}` })
      .end((err, res) => {
        expect(res).to.have.status(STATUS.BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.BAD_REQUEST);
        done();
      });
  });

  it('Should get all comments with their history', (done) => {
    chai
      .request(app)
      .get(`/api/v1/articles/${newSlug}/comments`)
      .set({ Authorization: `Bearer ${authToken}` })
      .end((err, res) => {
        expect(res).to.have.status(STATUS.OK);
        expect(res.body).to.be.an('object');
        expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.OK);
        expect(res.body.data.articles[0]).to.haveOwnProperty('CommentHistories');
        expect(res.body.message).to.equal('comments successfully fetched');
        done();
      });
  });

  it('Should delete a comment', (done) => {
    chai
      .request(app)
      .delete(`/api/v1/articles/${newSlug}/comments/${commentId}`)
      .set({ Authorization: `Bearer ${authToken}` })
      .end((err, res) => {
        expect(res).to.have.status(STATUS.OK);
        expect(res.body).to.be.an('object');
        expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.OK);
        expect(res.body.message).to.equal('comment was successfully deleted');
        done();
      });
  });
});

describe('API endpoint: /api/articles/:slug/comments/:id/likes (Routes)', () => {
  it('Should like a comment for the first time', (done) => {
    chai
      .request(app)
      .post(`/api/v1/articles/${newSlug}/comments/${newCommentId}/likes`)
      .set({ Authorization: `Bearer ${authToken}` })
      .end((err, res) => {
        expect(res).to.have.status(STATUS.CREATED);
        expect(res.body).to.be.an('object');
        expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.CREATED);
        expect(res.body.message).to.equal('successfully liked comment');
        done();
      });
  });

  it('Should remove liked comment', (done) => {
    chai
      .request(app)
      .post(`/api/v1/articles/${newSlug}/comments/${newCommentId}/likes`)
      .set({ Authorization: `Bearer ${authToken}` })
      .end((err, res) => {
        expect(res).to.have.status(STATUS.OK);
        expect(res.body).to.be.an('object');
        expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.OK);
        expect(res.body.message).to.equal('successfully removed like from comment');
        done();
      });
  });

  it('Should dislike a comment', (done) => {
    chai
      .request(app)
      .post(`/api/v1/articles/${newSlug}/comments/${newCommentId}/dislikes`)
      .set({ Authorization: `Bearer ${authToken}` })
      .end((err, res) => {
        expect(res).to.have.status(STATUS.CREATED);
        expect(res.body).to.be.an('object');
        expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.CREATED);
        expect(res.body.message).to.equal('successfully disliked comment');
        done();
      });
  });

  it('Should like a comment if disliked before', (done) => {
    chai
      .request(app)
      .post(`/api/v1/articles/${newSlug}/comments/${newCommentId}/likes`)
      .set({ Authorization: `Bearer ${authToken}` })
      .end((err, res) => {
        expect(res).to.have.status(STATUS.CREATED);
        expect(res.body).to.be.an('object');
        expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.CREATED);
        expect(res.body.message).to.equal('successfully liked comment');
        done();
      });
  });

  it('Should dislike a comment if liked before', (done) => {
    chai
      .request(app)
      .post(`/api/v1/articles/${newSlug}/comments/${newCommentId}/dislikes`)
      .set({ Authorization: `Bearer ${authToken}` })
      .end((err, res) => {
        expect(res).to.have.status(STATUS.CREATED);
        expect(res.body).to.be.an('object');
        expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.CREATED);
        expect(res.body.message).to.equal('successfully disliked comment');
        done();
      });
  });


  it('Should get all likes', (done) => {
    chai
      .request(app)
      .get(`/api/v1/articles/${newSlug}/comments/${newCommentId}/likes`)
      .set({ Authorization: `Bearer ${authToken}` })
      .end((err, res) => {
        expect(res).to.have.status(STATUS.OK);
        expect(res.body).to.be.an('object');
        expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.OK);
        expect(res.body.message).to.equal('likes successfully fetched');
        done();
      });
  });
});

describe('API endpoint: /api/articles/:slug/comments/:id/dislikes (Routes)', () => {
  it('Should get all dislikes', (done) => {
    chai
      .request(app)
      .get(`/api/v1/articles/${newSlug}/comments/${newCommentId}/dislikes`)
      .set({ Authorization: `Bearer ${authToken}` })
      .end((err, res) => {
        expect(res).to.have.status(STATUS.OK);
        expect(res.body).to.be.an('object');
        expect(res.body).to.haveOwnProperty('code').to.equal(STATUS.OK);
        expect(res.body.message).to.equal('dislikes successfully fetched');
        done();
      });
  });
});
