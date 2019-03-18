import logger from '../helpers/logger';
import models from '../models/index';
import Mail from '../helpers/sendMail';
import Response from '../helpers/responseHelper';
import { STATUS } from '../helpers/constants';
/**
 * @description This class represents a notification in the app
 * @class NotificationsController
 */
class NotificationsController {
  /**
   * This function gets a user setting
   * @param {Number} id - The message to be sent
   * @returns {Promise} - returns a promise
   */
  static async getSetting(id) {
    const userSetting = await models.Setting.findOne({ where: { userId: id } });
    return userSetting;
  }

  /**
   * This function gets a user setting
   * @param {Number} id - The message to be sent
   * @returns {String} - returns user email
   */
  static async getEmail(id) {
    const userData = await models.User.findOne({ where: { id } });
    const { dataValues } = userData;
    return (dataValues.email);
  }


  /**
   * This function creates a new notification
   * It checks if the user is ok with getting notifications
   * By default a user gets in-app notifications if the user wants to recieve them in general
   * It checks what type of notification a user wants to get and sends it
   * If notification is to be sent to one user, then put the id in an array.
   * @param {String} message - The message to be sent
   * @param {Array} userIds - The users to send notifications to
   * @returns {void}
   */
  static async create(message, userIds) {
    // loop through each user
    // eslint-disable-next-line no-restricted-syntax
    for (const id of userIds) {
      // for a single id
      // get the user settings
      // eslint-disable-next-line no-await-in-loop
      const userSettingsData = await this.getSetting(id);
      if (userSettingsData != null) {
        const { dataValues } = userSettingsData;
        // check if the user can recieve notification
        if (dataValues.canNotify) {
          // check if the user can recieve email notification
          if (dataValues.canEmail) {
            // get the email of the user
            // eslint-disable-next-line no-await-in-loop
            const email = await this.getEmail(id);
            // send the user an email notification
            this.sendMailNotification(email, message);
          }
          // send default in app mail
          // eslint-disable-next-line no-await-in-loop
          await this.sendInAppNotification(id, message);
        }
      }
    }
  }

  /**
   * This function sends an email notification to a user
   * @param {String} email  - The email of the user
   * @param {String} message - This is the notification message
   * @returns {Boolean} - returns a boolean
   */
  static async sendMailNotification(email, message) {
    const data = {
      email,
      subject: 'Notification',
      mailContext: {
        message
      },
      template: 'notification'
    };
    try {
      await Mail.sendMail(data);
      return true;
    } catch (e) {
      logger.log(e);
      return false;
    }
  }

  /**
   * This function sends an in-app notification to a user
   * @param {String} id  - The user id
   * @param {String} message - This is the notification message
   * @returns {void}
   */
  static async sendInAppNotification(id, message) {
    try {
      await models.Notification.create({ message, userId: id });
    } catch (e) {
      logger.log(e);
    }
    if (global.socket) {
      await global.socket.emit(`notification${id}`, { message });
    }
  }

  /**
   * This function gets an authenticated users notifications from the database
   * @param {Request} request - request object
   * @param {Response} response - response object
   * @returns {Response} response object
   */
  static async getAllNotifications(request, response) {
    // get user id
    const userId = request.user.id;
    // get users notifications
    try {
      const notificationData = await models.Notification.findAll({
        where: { userId },
        raw: true
      });
      if (notificationData == null) {
        return Response.send(response, STATUS.OK, null, 'No notifications');
      }
      return Response.send(response, STATUS.OK, notificationData, 'Successful');
    } catch (e) {
      logger.log(e);
      console.log(e);
      return Response.send(response, STATUS.BAD_REQUEST, null, 'An error occured', false);
    }
  }
}
export default NotificationsController;
