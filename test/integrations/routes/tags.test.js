/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import app from '../../../index';
import models from '../../../models';
import { STATUS } from '../../../helpers/constants';
import { auth } from '../../helpers';

chai.use(chaiHttp);

let authToken;

before(async () => {
  const user = await models.User.findOne({ raw: true });
  user.password = 'secret';
  const response = await auth(user);
  authToken = response.body.token;
});

describe('Article Tags', () => {
  it('should fetch a list of tags', (done) => {
    chai
      .request(app)
      .get('/api/v1/tags')
      .set({ Authorization: `Bearer ${authToken}` })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(STATUS.OK);
        expect(res.body.data.length).to.be.greaterThan(1);
        done();
      });
  });

  it('Should create an article with tags provided', (done) => {
    const article = {
      title: faker.random.words(15),
      description: 'lorem ipsum exists',
      body: faker.lorem.paragraphs(),
      tagList: ['javascript', 'nodejs']
    };
    chai
      .request(app)
      .post('/api/v1/articles')
      .send(article)
      .set({ Authorization: `Bearer ${authToken}` })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(STATUS.CREATED);
        expect(res.body.data.title).to.equal(article.title);
        expect(res.body.data).to.haveOwnProperty('tagList');
        expect(res.body.data.tagList.length).to.equal(2);
        done();
      });
  });
});
