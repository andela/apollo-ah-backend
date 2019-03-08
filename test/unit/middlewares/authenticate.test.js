/* eslint-disable no-unused-vars */
import sinon from 'sinon';
import chai from 'chai';
import authenticate from '../../../middlewares/authenticate';

const should = chai.should();

describe('middlewares', () => {
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
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlzQ29uZmlybWVkIjpmYWxzZSwiY3JlYXRlZEF0IjoiMjAxOS0wMy0wOFQyMDo0MTo1Ni4zMTlaIiwidXBkYXRlZEF0IjoiMjAxOS0wMy0wOFQyMDo0MTo1Ni4zMTlaIiwiaWQiOjExMSwi';

      const callback = sinon.spy();
      const request = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      const response = {};
      authenticate(request, response, callback);
      callback.calledOnce.should.equal(true);
      done();
    });
  });
});
