/* eslint-disable no-unused-vars */
import sinon from 'sinon';
import chai from 'chai';
import Mail from '../../helpers/sendMail';
import Logger from '../../helpers/logger';

const should = chai.should();

describe('Mail class test', () => {
  it('should send a mail to a user', async () => {
    const data = {
      email: 'jerry@gmail.com',
      subject: 'Account confirmation',
      mailContext: {
        link: 'melli.com'
      },
      template: 'signup'
    };
    try {
      await Mail.sendMail(data);
    } catch (e) {
      Logger.log(e);
    }
  });
  it('should not send a mail', async () => {
    const data = {
      email: null,
      subject: 'Account confirmation',
      mailContext: {
        name: 'melli.com'
      },
      template: 'signup'
    };
    try {
      await Mail.sendMail(data);
    } catch (e) {
      Logger.log(e);
    }
  });
});
