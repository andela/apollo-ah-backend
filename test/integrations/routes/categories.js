/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../server';

chai.use(chaiHttp);

describe.only('Categories tests', () => {
  it('should get all the article categories', async () => {
    const response = await chai
      .request(app)
      .get('/api/v1/categories');
    expect(response).to.have.status(200);
    expect(response.body).to.be.an('object');
    expect(response.body.data).to.be.an('array');
  });
});
