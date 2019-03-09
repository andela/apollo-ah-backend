/* eslint-disable no-unused-vars */
import sinon from 'sinon';
import chai from 'chai';
import authenticate from '../../../middlewares/authenticate';

const should = chai.should();

describe.skip('middlewares', () => {
  describe('authenticate()', () => {
    it('should throw error on missing Authorization Header', (done) => {
      const callback = sinon.spy();
      const request = {
        headers: {
          authorization: '',
        },
      };
      const response = {};
      authenticate(request, response, callback);
      callback.calledOnce.should.equal(true);
      done();
    });

    it('error on invalid token format', (done) => {
      const callback = sinon.spy();
      const request = {
        headers: {
          authorization: 'Bearer',
        },
      };
      const response = {};
      authenticate(request, response, callback);
      callback.calledOnce.should.equal(true);
      done();
    });
  });
});
