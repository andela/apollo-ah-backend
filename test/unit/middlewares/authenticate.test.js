/* eslint-disable no-unused-vars */
import sinon from 'sinon';
import chai from 'chai';
import authenticate from '../../../middlewares/authenticate';

const should = chai.should();

describe('middlewares', () => {
  describe('authenticate()', () => {
    it('should validate token and respond with payload', (done) => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImNyZWF0ZWRBdCI6IjIwMTktMDMtMDdUMjM6MzU6MDEuMTIyWiIsInVwZGF0ZWRBdCI6IjIwMTktMDMtMDdUMjM6MzU6MDEuMTIyWiIsImlkIjoyOCwiZW1haWwiOiJNYXJjb3MuRG9ubmVsbHlAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkWmw1TjVJNkJwMUhZZUk4aDFsRE1PLjJMbU1QSFd4VlVub1N4Lm9yNldJY0xkNEFlN1RDTGUifSwiaWF0IjoxNTUyMDAxNzAxfQ.k7h4KI_-KSOieTDDARuESmkJCRmCag_JJSIbvi58k4o';
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
      const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImNyZWF0ZWRBdCI6IjIwMTktMDMtMDdUMjM6MzU6MDEuMTIyWiIsInVwZGF0ZWRBdCI6IjIwMTktMDMtMDdUMjM6Mz';
      const callback = sinon.spy();
      const request = {
        headers: {
          authorization: `Bearer ${invalidToken}`,
        },
      };
      const response = {};
      authenticate(request, response, callback);
      callback.calledOnce.should.equal(true);
      done();
    });
  });
});
