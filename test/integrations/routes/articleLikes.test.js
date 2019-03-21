/* eslint-disable prefer-destructuring */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import { STATUS } from '../../../helpers/constants';
import app from '../../../index';


chai.use(chaiHttp);

const {
  CREATED,
  OK,
} = STATUS;

let authpayload;
let authToken;

const dummyUser5 = {
  email: faker.internet.email(),
  password: 'i2345678',
  username: faker.name.firstName(),
  roleId: 2,
};

const article = {
  title: faker.lorem.words(),
  description: faker.lorem.words(),
  body: faker.lorem.words(),
  categoryId: 1,
};
describe('article like and dislike endpoint', () => {
  let slug;
  before(async () => {
    authpayload = await chai.request(app)
      .post('/api/v1/users/')
      .send(dummyUser5);
    authToken = authpayload.body.data.token;

    const articleResult = await chai
      .request(app)
      .post('/api/v1/articles')
      .set({ Authorization: `Bearer ${authToken}` })
      .send({ ...article });
    slug = articleResult.body.data.slug;
  });

  it('should successfully like an article', (done) => {
    chai
      .request(app)
      .post(`/api/v1/articles/${slug}/likes`)
      .set({ Authorization: `Bearer ${authToken}` })
      .end((err, res) => {
        expect(res).to.have.status(CREATED);
        expect(res.body.message).to.equal('successfully liked article');
        done();
      });
  });

  it('should successfully dislike an article', (done) => {
    chai
      .request(app)
      .post(`/api/v1/articles/${slug}/dislikes`)
      .set({ Authorization: `Bearer ${authToken}` })
      .end((err, res) => {
        expect(res).to.have.status(OK);
        expect(res.body.message).to.equal('successfully disliked article');
        done();
      });
  });
});
