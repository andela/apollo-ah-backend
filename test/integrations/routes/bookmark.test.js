/* eslint-disable no-const-assign */
/* eslint-disable prefer-destructuring */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import models from '../../../server/models';
import { STATUS } from '../../../server/helpers/constants';
import app from '../../../server';
import { users } from '../../helpers/testData';

const { dummyUser4 } = users;

chai.use(chaiHttp);

const {
  CREATED,
  OK,
  NOT_FOUND,
} = STATUS;

const article = {
  title: faker.lorem.words(),
  description: faker.lorem.words(),
  body: faker.lorem.words(),
  categoryId: 1,
};

const createUser = async () => {
  try {
    const { dataValues: { id } } = await models.User.create(dummyUser4);
    dummyUser4.id = id;
  } catch (error) {
    return error;
  }
};

describe('/Bookmark articles', () => {
  let slug;
  let articleId;
  before(async () => {
    try {
      await createUser();
      const authpayload = await chai.request(app)
        .post('/api/v1/users/login')
        .send(dummyUser4);
      dummyUser4.token = authpayload.body.token;
      dummyUser4.id = authpayload.body.id;

      const articleResult = await chai
        .request(app)
        .post('/api/v1/articles')
        .set({ Authorization: `Bearer ${dummyUser4.token}` })
        .send({ ...article });
      slug = articleResult.body.data.slug;
      articleId = articleResult.body.data.id;
    } catch (error) {
      return error;
    }
  });

  it('should successfully bookmark an article', (done) => {
    chai
      .request(app)
      .post(`/api/v1/articles/${slug}/bookmarks`)
      .set({ Authorization: `Bearer ${dummyUser4.token}` })
      .end((err, res) => {
        expect(res).to.have.status(CREATED);
        expect(res.body.data.userId).to.be.equals(dummyUser4.id);
        expect(res.body.data.articleId).to.be.equals(articleId);
        expect(res.body.message).to.be.equals('successfully bookmarked this article');
        done();
      });
  });

  it('should successfully unbookmark an article', (done) => {
    chai
      .request(app)
      .post(`/api/v1/articles/${slug}/bookmarks`)
      .set({ Authorization: `Bearer ${dummyUser4.token}` })
      .end((err, res) => {
        expect(res).to.have.status(OK);
        expect(res.body.message).to.be.equals('successfully unbookmarked this article');
        done();
      });
  });

  it('should throw an error if an article does not exist', (done) => {
    chai
      .request(app)
      .post(`/api/v1/articles/${slug}jhk/bookmarks`)
      .set({ Authorization: `Bearer ${dummyUser4.token}` })
      .end((err, res) => {
        expect(res).to.have.status(NOT_FOUND);
        expect(res.body.message).to.be.equals('This article does not exist');
        done();
      });
  });

  it('should return bookmarked articles', (done) => {
    chai
      .request(app)
      .get('/api/v1/bookmarks')
      .set({ Authorization: `Bearer ${dummyUser4.token}` })
      .end((err, res) => {
        expect(res).to.have.status(OK);
        expect(res.body.message).to.be.equals('Bookmarked articles');
        done();
      });
  });
});
