import logger from '../helpers/logger';
import models from '../models/index';
import Mail from '../helpers/sendMail';

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
    const userSetting = await models.Setting.findOne({ where: { user_id: id } });
    return userSetting;
  }

  /**
   * This function gets a user setting
   * @param {Number} id - The message to be sent
   * @returns {Object} - returns user object
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
   * @param {String} message - The message to be sent
   * @param {Array} userIds - The users to send notifications to
   * @returns {Boolean} - returns boolean
   */
  static async create(message, userIds) {
    // switch to check if the whole operation is done
    let done = 0;
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
          // set state to not done
          done = 0;
          // check if the user can recieve email notification
          if (dataValues.canEmail) {
            // set state to not done
            done = 0;
            // get the email of the user
            // eslint-disable-next-line no-await-in-loop
            const email = await this.getEmail(id);
            // send the user an email notification
            const sent = this.sendMailNotification(email, message);
            if (sent) {
              done = 1;
            }
          }
          // send default in app mail
          try {
            // eslint-disable-next-line no-await-in-loop
            await models.Notification.create({ message, user_id: id });
            done = 1;
          } catch (e) {
            done = 0;
            logger.log(e);
          }
        } else {
          done = 0;
        }
      }
    }
    if (done === 1) {
      return true;
    }
    return false;
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
}
export default NotificationsController;
