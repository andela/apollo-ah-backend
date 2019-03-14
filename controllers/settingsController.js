import models from '../models';
import logger from '../helpers/logger';
import Response from '../helpers/responseHelper';
import { STATUS } from '../helpers/constants';

const { Setting } = models;
/**
 * @description - This class represents user settings in the api
 * @class SettingsController
 */
class SettingsController {
  /**
   * This function creates a user setting
   * @param {int} userId - The users Id
   * @returns {void}
   */
  static async create(userId) {
    // create a user
    const data = await Setting.create({ userId: userId });
    return data;
  }

  /**
   * This function updates a users setting
   * @param {Object} request - This is the request object
   * @param {Object} response - This is the response object
   * @returns {Object} - This function returns a response object
   */
  static async update(request, response) {
    // get the user id from the request
    const userId = request.user.id;
    // get the settings for this user and update
    try {
      const updateData = await Setting.update(
        {
          canEmail: request.body.canEmail,
          canNotify: request.body.canNotify
        },
        {
          where: { userId: userId }
        }
      );
      if (!updateData) {
        return Response.send(response, STATUS.BAD_REQUEST, null, 'An error occurred while updating your settings', false);
      }
      return Response.send(response, STATUS.OK, null, 'Settings have been successfully updated');
    } catch (e) {
      logger.log(e);
      return Response.send(response, STATUS.BAD_REQUEST, null, 'An error occurred while updating your settings', false);
    }
  }

  /**
   * This function updates a users setting
   * @param {Object} request - This is the request object
   * @param {Object} response - This is the response object
   * @returns {Object} - This function returns a response object
   */
  static async getUserSetting(request, response) {
    // get the user id from the request
    const userId = request.user.id;

    // get a users setting
    try {
      const { dataValues } = await Setting.findOne({ where: { userId: userId } });
      const setting = dataValues;
      return Response.send(response, STATUS.OK, setting, 'Successful');
    } catch (e) {
      logger.log(e);
      return Response.send(response, STATUS.BAD_REQUEST, null, 'An error occurred', false);
    }
  }
}

export default SettingsController;
