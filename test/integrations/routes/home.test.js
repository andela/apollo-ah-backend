/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../index';
import { MESSAGE, STATUS } from '../../../helpers/constants';

chai.use(chaiHttp);

describe('Index routes:', () => {
  describe('GET /', () => {
    it('should respond with a welcome message', (done) => {
      chai
        .request(app)
        .get('/')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(STATUS.OK);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('message').to.equal(MESSAGE.WELCOME_MESSAGE);
          done();
        });
    });

    it('should throw an error for invalid route', (done) => {
      chai
        .request(app)
        .get('/404')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('message').to.equal(MESSAGE.ROUTE_NOT_FOUND);
          done();
        });
    });
  });
});
