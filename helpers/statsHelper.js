import models from '../models';

/**
 * Wrapper class for recording the user visit history.
 *
 * @export
 * @class StatsHelper
 */
export default class StatsHelper {
  /**
   * Verifies the user via cookies before creating a row
   * of the userId, articleId, and categoryId
   * to save a record of the read history of the user
   * @static
   * @param {function} email The request object
   * @param {fucntion} articleId The response object
   * @param {function} categoryId The express built in next middleware
   * @returns {function} returns an empty string to allow request continuation.
   */
  static async confirmUser(email, articleId, categoryId) {
    const user = await models.User.findOne({
      where: { email },
      attributes: { exclude: ['password', 'isConfirmed', 'updatedAt', 'createdAt', 'deletedAt', 'email'] }
    });
    if (user) {
      const userId = user.dataValues.id;
      const content = { userId, articleId, categoryId };
      const historyCheck = await models.History.findOne({
        where: { userId, articleId, categoryId }
      });
      if (!historyCheck) await models.History.create(content);
    }
    return '';
  }
}
