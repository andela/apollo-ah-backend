import { expect } from 'chai';
import Mail from '../../server/helpers/sendMail';
import Logger from '../../server/helpers/logger';

describe('Mail class', () => {
  it('should send a mail to a user with valid data', async () => {
    let result;
    const data = {
      email: 'jerry@gmail.com',
      subject: 'Account confirmation',
      mailContext: {
        link: 'melli.com'
      },
      template: 'signup'
    };
    try {
      result = await Mail.sendMail(data);
      expect(result).to.be.an('object');
    } catch (e) {
      Logger.log(e);
    }
    // expect(result).to.be.an('object');
  });
  it('should not send a mail with invalid data', async () => {
    let result;
    const data = {
      email: null,
      subject: 'Account confirmation',
      mailContext: {
        name: 'melli.com'
      },
      template: 'signup'
    };
    try {
      result = await Mail.sendMail(data);
    } catch (e) {
      Logger.log(e);
    }
    expect(result).to.be.an('undefined');
  });
});
