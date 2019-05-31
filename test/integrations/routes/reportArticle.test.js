import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../server';
import models from '../../../server/models';
import { auth } from '../../helpers';
import { generateToken } from '../../../server/helpers/utils';

chai.use(chaiHttp);

describe('Report Article API endpoint', () => {
  // let authToken;

  // before(async () => {
  //   const user = await models.User.findByPk(2, { raw: true });
  //   user.password = 'secret';
  //   const response = await auth(user);
  //   authToken = response.body.token;
  // });

  // const token = process.env.JWT_TOKEN;
  describe('/reporting article Post Endpoint', () => {
    it('should report an article with report-type of "spam"', async () => {
      const reportArticle = {
        reportType: 'spam',
      };
      const usersToken = await generateToken({ email: 'user@user.com', id: 2, password: 'secret' });
      const res = await chai.request(app)
        .post('/api/v1/articles/2/report')
        .set('authorization', `Bearer ${usersToken}`)
        .send(reportArticle);
      expect(res.body.code).to.equal(201);
      expect(res.body.data).to.be.an('object');
      expect(res.body.message).to.equal('success');
      expect(res.body.status).to.equal(true);
    });

    it('should report an article with report-type of "rules violation"', async () => {
      const reportArticle = {
        reportType: 'rules violation',
      };
      const usersToken = await generateToken({ email: 'user@user.com', id: 2, password: 'secret' });
      const res = await chai.request(app)
        .post('/api/v1/articles/3/report')
        .set('authorization', `Bearer ${usersToken}`)
        .send(reportArticle);
      expect(res.body.code).to.equal(201);
      expect(res.body.data).to.be.an('object');
      expect(res.body.message).to.equal('success');
      expect(res.body.status).to.equal(true);
    });

    it('should return an error for invalid report type', async () => {
      const reportArticle = {
        reportType: 'rules break',
      };
      const usersToken = await generateToken({ email: 'user@user.com', id: 2, password: 'secret' });
      const res = await chai.request(app)
        .post('/api/v1/articles/2/report')
        .set('authorization', `Bearer ${usersToken}`)
        .send(reportArticle);
      expect(res.body.code).to.equal(400);
      expect(res.body.data).to.be.an('array');
      expect(res.body.message).to.equal('Report type can only include one of the following spam, plagiarism, rules violation or others');
      expect(res.body.status).to.equal(false);
    });

    it('should not allow user to report an article more than once and return an error', async () => {
      const reportArticle = {
        reportType: 'plagiarism',
      };
      const usersToken = await generateToken({ email: 'user@user.com', id: 2, password: 'secret' });
      const res = await chai.request(app)
        .post('/api/v1/articles/2/report')
        .set('authorization', `Bearer ${usersToken}`)
        .send(reportArticle);
      expect(res.body.code).to.equal(403);
      expect(res.body.data).to.be.an('object');
      expect(res.body.message).to.equal('You cannot report an article more than once');
      expect(res.body.status).to.equal(false);
    });

    it('should not accept report-type of "others" if there is no comment accompanying it', async () => {
      const reportArticle = {
        reportType: 'others',
      };
      const usersToken = await generateToken({ email: 'admin@admin.com', id: 2, password: 'secret' });
      const res = await chai.request(app)
        .post('/api/v1/articles/2/report')
        .set('authorization', `Bearer ${usersToken}`)
        .send(reportArticle);
      expect(res.body.code).to.equal(400);
      expect(res.body.data).to.be.an('array');
      expect(res.body.message).to.equal('Please include description of your report');
      expect(res.body.status).to.equal(false);
    });
    it('should only accept report-type of "others" if there is comment accompanying it', async () => {
      const reportArticle = {
        reportType: 'others',
        comment: 'Harassment'
      };
      const usersToken = await generateToken({ email: 'admin@admin.com', id: 1, password: 'secret' });
      const res = await chai.request(app)
        .post('/api/v1/articles/4/report')
        .set('authorization', `Bearer ${usersToken}`)
        .send(reportArticle);
      expect(res.body.code).to.equal(201);
      expect(res.body.data).to.be.an('object');
      expect(res.body.message).to.equal('success');
      expect(res.body.status).to.equal(true);
    });
  });

  describe('/reporting article Get Endpoint', () => {
    it('should get a reported article', async () => {
      const usersToken = await generateToken({ email: 'user@user.com', id: 2, password: 'secret' });
      const res = await chai.request(app)
        .get('/api/v1/articles/2/report')
        .set('authorization', `Bearer ${usersToken}`);
      expect(res.body.code).to.equal(200);
      expect(res.body.message).to.equal('success');
      expect(res.body.status).to.equal(true);
    });

    it('should return error for non-existing article', async () => {
      const usersToken = await generateToken({ email: 'user@user.com', id: 2, password: 'secret' });
      const res = await chai.request(app)
        .get('/api/v1/articles/b/report')
        .set('authorization', `Bearer ${usersToken}`);
      expect(res.body.code).to.equal(404);
      expect(res.body.message).to.equal('ARTICLE NOT FOUND');
      expect(res.body.status).to.equal('Failure');
    });
  });
});
