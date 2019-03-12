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

let authpayload;
let authToken;
// let newArticle;

const dummyUser = {
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
    return user;
  } catch (error) {
    return error;
  }
};

before(async () => {
  // newArticle = await feedArticleToDb();
  await createUser();
  authpayload = await chai.request(app)
    .post('/api/v1/users/login')
    .send(dummyUser);
  authToken = authpayload.body.token;
  return dummyUser;
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
});
