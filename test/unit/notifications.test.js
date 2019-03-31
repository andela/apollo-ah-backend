import { expect } from 'chai';
import NotificationsController from '../../server/controllers/notificationsController';
import models from '../../server/models';

describe('Notifications Tests', () => {
  it('should send users test notification', async () => {
    const userData = await models.User.findAll({ attributes: ['id'] });
    const userIdsArray = [];
    userData.forEach((data) => {
      const { dataValues } = data;
      const userIds = dataValues;
      userIdsArray.push(userIds.id);
    });
    try {
      await NotificationsController.create('Just be vool', userIdsArray);
    } catch (e) {
      expect(e).to.eql(null);
    }
  });

  it('should not send users notifications without message', async () => {
    const userData = await models.User.findAll({ attributes: ['id'] });
    const userIdsArray = [];
    userData.forEach((data) => {
      const { dataValues } = data;
      const userIds = dataValues;
      userIdsArray.push(userIds.id);
    });
    try {
      await NotificationsController.create(userIdsArray);
    } catch (e) {
      expect(e).to.not.eql(null);
    }
  });
});
