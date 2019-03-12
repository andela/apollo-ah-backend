/* eslint-disable prefer-destructuring */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import jwt from 'jsonwebtoken';
import app from '../../../index';

chai.use(chaiHttp);

const token = `${jwt.sign({ user: { id: 1 } }, 'secret', { expiresIn: '24hrs' })}`;
const article = {
  title: faker.lorem.words(),
  description: faker.lorem.words(),
  body: faker.lorem.words()
};
describe('article like and dislike endpoint', () => {
  let slug;
  before(async () => {
    const articleResult = await chai
      .request(app)
      .post('/api/v1/articles')
      .set({ Authorization: `Bearer ${token}` })
      .send({ ...article });
    slug = articleResult.body.data.slug;
  });

  it('should successfully like an article', (done) => {
    chai
      .request(app)
      .post(`/api/v1/articles/${slug}/likes`)
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        expect(res.status).eql(201);
        expect(res.body.message).to.equal('successfully liked article');
        done();
      });
  });

  it('should successfully dislike an article', (done) => {
    chai
      .request(app)
      .post(`/api/v1/articles/${slug}/dislikes`)
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        expect(res.status).eql(200);
        expect(res.body.message).to.equal('successfully disliked article');
        done();
      });
  });
});
