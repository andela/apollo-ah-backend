/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../server';
import models from '../../../server/models';
import { STATUS, MESSAGE, CLAPS_LIMIT } from '../../../server/helpers/constants';
import { auth } from '../../helpers';

chai.use(chaiHttp);

describe('Article claps endpoint: /api/articles/:slug/claps', () => {
  let userToken;
  let article;
  let articleSlug;
  let ownArticleSlug;

  before(async () => {
    const { Op } = models.Sequelize;
    const user = await models.User.findByPk(2, { raw: true });
    user.password = 'secret';
    const response = await auth(user);
    userToken = response.body.token;

    // Get article belonging to user
    article = await models.Article.findOne({
      where: { authorId: user.id },
      // limit: 1,
      raw: true,
    });
    ownArticleSlug = article.slug;

    // Get article not belonging to user
    article = await models.Article.findOne({
      where: {
        authorId: {
          [Op.not]: user.id
        }
      },
      // limt: 1,
      raw: true,
    });
    articleSlug = article.slug;
  });

  describe('POST: /api/v1/articles/:slug', () => {
    it('Should perform an article clap', (done) => {
      chai
        .request(app)
        .post(`/api/v1/articles/${articleSlug}/claps`)
        .set({ Authorization: `Bearer ${userToken}` })
        .send({ claps: 10 })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(STATUS.CREATED);
          expect(res.body).to.be.an('object');
          expect(res.body)
            .to.haveOwnProperty('message')
            .to.equal(MESSAGE.SUCCESS_MESSAGE);
          expect(res.body.data)
            .to.haveOwnProperty('claps')
            .to.equal(10);
          done();
        });
    });
    it('Should update (increment) an article claps', (done) => {
      chai
        .request(app)
        .post(`/api/v1/articles/${articleSlug}/claps`)
        .set({ Authorization: `Bearer ${userToken}` })
        .send({ claps: 20 })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(STATUS.OK);
          expect(res.body).to.be.an('object');
          expect(res.body)
            .to.haveOwnProperty('message')
            .to.equal(MESSAGE.SUCCESS_MESSAGE);
          expect(res.body.data)
            .to.haveOwnProperty('claps')
            .to.equal(30);
          done();
        });
    });
    it('throws validation error when claps is not provided', (done) => {
      chai
        .request(app)
        .post(`/api/v1/articles/${articleSlug}/claps`)
        .set({ Authorization: `Bearer ${userToken}` })
        .send({})
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(STATUS.BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body.data[0])
            .to.haveOwnProperty('message')
            .to.equal('Claps must not be empty');
          done();
        });
    });
    it('throws validation error for invalid claps param', (done) => {
      chai
        .request(app)
        .post(`/api/v1/articles/${articleSlug}/claps`)
        .set({ Authorization: `Bearer ${userToken}` })
        .send({ claps: 'invalid' })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(STATUS.BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body.data[0])
            .to.haveOwnProperty('message')
            .to.equal('Claps must be a valid integer');
          done();
        });
    });
    it('throws validation error when claps exceeds 100', (done) => {
      chai
        .request(app)
        .post(`/api/v1/articles/${articleSlug}/claps`)
        .set({ Authorization: `Bearer ${userToken}` })
        .send({ claps: 101 })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(STATUS.BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body.data[0])
            .to.haveOwnProperty('message')
            .to.equal(`Claps must not exceed ${CLAPS_LIMIT}`);
          done();
        });
    });
    it('throws forbidden error when user tries to clap owned article', (done) => {
      chai
        .request(app)
        .post(`/api/v1/articles/${ownArticleSlug}/claps`)
        .set({ Authorization: `Bearer ${userToken}` })
        .send({ claps: 20 })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(STATUS.FORBIDDEN);
          expect(res.body).to.be.an('object');
          expect(res.body.data)
            .to.haveOwnProperty('message')
            .to.equal(MESSAGE.CLAP_FORBIDDEN);
          done();
        });
    });
    it('Should throw validation error when claps is empty', (done) => {
      chai
        .request(app)
        .post(`/api/v1/articles/${articleSlug}/claps`)
        .set({ Authorization: `Bearer ${userToken}` })
        .send({ claps: '' })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(STATUS.BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body.data[0])
            .to.haveOwnProperty('message')
            .to.equal('Claps must not be empty');
          done();
        });
    });
    it('Should throw validation error when claps is not a valid integer', (done) => {
      chai
        .request(app)
        .post(`/api/v1/articles/${articleSlug}/claps`)
        .set({ Authorization: `Bearer ${userToken}` })
        .send({ claps: 'NOT VALID' })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(STATUS.BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body.data[0])
            .to.haveOwnProperty('message')
            .to.equal('Claps must be a valid integer');
          done();
        });
    });
  });

  describe('GET: /api/v1/articles/:slug/claps', () => {
    it("Should return a single article's claps", (done) => {
      chai
        .request(app)
        .get(`/api/v1/articles/${articleSlug}/claps`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(STATUS.OK);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('data').to.have.lengthOf(1);
          done();
        });
    });
    it("Should return an article's claps by authenticated user", (done) => {
      chai
        .request(app)
        .get(`/api/v1/articles/${articleSlug}/claps/7`)
        .set({ Authorization: `Bearer ${userToken}` })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(STATUS.OK);
          expect(res.body).to.be.an('object');
          expect(res.body)
            .to.haveOwnProperty('data');
          done();
        });
    });
    it('Should return an error if userId is not an integer', (done) => {
      chai
        .request(app)
        .get(`/api/v1/articles/${articleSlug}/claps/NOT_VALID`)
        .set({ Authorization: `Bearer ${userToken}` })
        .end((err, res) => {
          expect(res).to.have.status(STATUS.BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body)
            .to.haveOwnProperty('data')
            .to.be.an('array');
          expect(res.body.data[0]).to.haveOwnProperty('message')
            .to.equal('User Id must be a valid integer');
          done();
        });
    });
  });
});
