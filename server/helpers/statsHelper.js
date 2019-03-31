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
   * @param {function} userId The user's Id
   * @param {fucntion} articleId The article's Id
   * @param {function} categoryId The article's category Id
   * @returns {function} returns an empty string to allow request continuation.
   */
  static async confirmUser(userId, articleId, categoryId) {
    const content = { userId, articleId, categoryId };
    const historyCheck = await models.History.findOne({
      where: { userId, articleId, categoryId }
    });
    if (!historyCheck) await models.History.create(content);
    return '';
  }
}
