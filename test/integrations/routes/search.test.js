/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import faker from 'faker';
import chaiHttp from 'chai-http';
import app from '../../../index';
import models from '../../../models';
import {
  STATUS, MESSAGE, PAGE_LIMIT, FIELD
} from '../../../helpers/constants';
import { model } from 'mongoose';

chai.use(chaiHttp);


describe.only('GET: /api/v1/articles', () => {
  before(async () => {
    try {
      const { dataValues: { id } } = await models.User.create({
        email: faker.internet.email(),
        password: faker.internet.password(),
        username: faker.internet.userName(),
      });
      await models.Profile.create({
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        username: faker.internet.userName(),
        userId: id,
        bio: faker.lorem.word(),
      });
      await models.Article.create({
        title: faker.lorem.words(3),
        description: faker.lorem.words(4),
        body: faker.lorem.sentences(5),
        categoryId: 1,
        authorId: id,
        slug: faker.random.word(),
      });
    } catch (error) {
      console.log(error);
    }
  });
  it('Should return  error if size parameter is not a number', (done) => {
    chai
      .request(app)
      .get('/api/v1/articles')
      .query({ page: 1, size: 'INVALID' })
      .end((err, res) => {
        expect(res).to.have.status(STATUS.BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res.body).to.haveOwnProperty('code').equal(STATUS.BAD_REQUEST);
        expect(res.body).to.haveOwnProperty('message').equal('Validation error occurred');
        expect(res.body).to.haveOwnProperty('status').to.equal(false);
        expect(res.body).to.haveOwnProperty('data')
          .to.be.an('array')
          .to.deep.include(
            {
              field: FIELD.PAGINATION_LIMIT,
              message: MESSAGE.PAGE_LIMIT_INVALID,
            }
          );
        done();
      });
  });
  it(`Should return  error if size parameter more than ${PAGE_LIMIT}`, (done) => {
    chai
      .request(app)
      .get('/api/v1/articles')
      .query({ page: 1, size: PAGE_LIMIT + 1 })
      .end((err, res) => {
        expect(res).to.have.status(STATUS.BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res.body).to.haveOwnProperty('code').equal(STATUS.BAD_REQUEST);
        expect(res.body).to.haveOwnProperty('message').equal('Validation error occurred');
        expect(res.body).to.haveOwnProperty('status').to.equal(false);
        expect(res.body).to.haveOwnProperty('data')
          .to.be.an('array')
          .to.deep.include(
            {
              field: FIELD.PAGINATION_LIMIT,
              message: MESSAGE.PAGE_LIMIT_EXCEEDED,
            }
          );
        done();
      });
  });
  it.only(`Should return first ${PAGE_LIMIT} articles if size parameter is not provided`, (done) => {
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
  it('Should return all articles if size parameter is valid', (done) => {
    chai
      .request(app)
      .get('/api/v1/articles')
      .query({ page: 1, size: 1 })
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
        expect(res.body).to.haveOwnProperty('message').equal(MESSAGE.ARTICLES_NOT_FOUND);
        expect(res.body).to.haveOwnProperty('status').to.equal(false);
        expect(res.body).to.haveOwnProperty('data').to.be.an('array');
        done();
      });
  });
});
