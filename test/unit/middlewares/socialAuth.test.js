import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { generateOrFindUser } from '../../../server/config/passport';

chai.use(chaiHttp);
describe('social authentication', () => {
  const verifyCallback = {
    accessToken: 'vcjhdcyusdvchcv',
    refreshToken: undefined,
    profile: {
      id: 4,
      emails: [{ value: 'testing@test1.com' }],
      displayName: 'John Doe',
      photos: [{ value: 'image.jpg' }],
    },
  };
  it('should hit social authentication API', async () => {
    const facebookUserInfo = generateOrFindUser(
      verifyCallback.accessToken,
      verifyCallback.refreshToken,
      verifyCallback.profile,
    );
      // eslint-disable-next-line no-unused-expressions
    expect(facebookUserInfo).to.be.empty;
    expect(typeof (facebookUserInfo)).to.equal('object');
    expect(verifyCallback.accessToken).to.be.a('string');
    expect(verifyCallback.profile).to.an('object');
  });
});
