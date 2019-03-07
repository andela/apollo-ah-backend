/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import Bluebird from 'bluebird';
import faker from 'faker';
import app from '../.././index';
import models from '../../../models';

chai.use(chaiHttp);

const user = {
    firstname: "second",
	lastname: "hdhh",
	phone: "75777575757",
	bio: "hdbahjbdhabhbd",
	address: "hdhdhdhdh",
	gender: "Male",
	username: "hfhhf",
	image: "image.com"
};

describe('API endpoint: /profile', () => {
  before(() => {
    // synchronize and create tables
    models.sequelize.sync();
  });

  beforeEach(() => {
    // drop tables
    Bluebird.all([
      models.User.destroy({ truncate: true }),
    ]);
  });

  describe('POST /api/v1/profile', () => {
    it('should register a new user', (done) => {
      chai.request(app)
        .post('/api/v1/profile')
        .send(user)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(202);
          expect(res.body).to.haveOwnProperty('token');
          expect(res.body).to.haveOwnProperty('id');
          done();
        });
    });
  });
});
