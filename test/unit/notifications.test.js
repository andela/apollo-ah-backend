import { expect } from 'chai';
import UsersController from '../../controllers/users';
import NotificationsController from '../../controllers/notificationsController';
import models from '../../models/index';

describe.only('Notifications Tests', () => {
  it('should send users test notification', async () => {
    const result = await UsersController.sendUsersTestNotification();
    expect(result).to.eql(true);
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
