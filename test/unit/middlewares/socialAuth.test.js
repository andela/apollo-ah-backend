import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../index';
import { generateOrFindUser } from '../../../auth/passport';

chai.use(chaiHttp);

describe('social authentication', () => {
  
  describe('verify callback', () => {
    const verifyCallback = {
      accessToken: 'vcjhdcyusdvchcv',
      refreshToken: undefined,
      profile: {
        id: 4,
        emails: [{value:'testing@test1.com'}]
      },
    };
    it('should hit socail authentication API', async () => {
      const facebookUserInfo = generateOrFindUser(
        verifyCallback.accessToken,
        verifyCallback.refreshToken,
        verifyCallback.profile,
      );
      expect(facebookUserInfo).to.be.empty;
      expect(typeof(facebookUserInfo)).to.equal('object');
      expect(verifyCallback.accessToken).to.be.a('string');
      expect(verifyCallback.profile).to.an('object');
    });
  });
});
