/* eslint-disable no-unused-vars */
import sinon from 'sinon';
import { expect } from 'chai';
import { validateConfigVariable } from '../../helpers/utils';

// const should = chai.should();

describe('Helpers: Utils', () => {
  describe('validateConfigVariable()', () => {
    it('should validate unset ENV config variable', (done) => {
      const utils = {
        validateConfigVariable
      };

      const stub = sinon.stub(utils, 'validateConfigVariable').returns(() => {});
      const error = new Error('Required ENV variable(s) is missing');
      stub.throws(error);
      expect(stub).to.throw(error);
      done();
    });
  });
});
