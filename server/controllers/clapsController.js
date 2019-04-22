import createError from 'http-errors';
import models from '../models';
import ResponseHandler from '../helpers/responseHelper';
import { STATUS, MESSAGE, CLAPS_LIMIT } from '../helpers/constants';

/**
 * Class representing claps controller
 *
 * @class ClapsController
 */
class ClapsController {
  /**
   * Creates or updates an article claps
   *
   * @static
   * @param {Request} request - Request object
   * @param {Response} response - Response object
   * @param {Function} next - Express next function
   * @returns {void}
   *
   * @memberof ClapsController
   */
  static async clapArticle(request, response, next) {
    const { body: { claps } } = request;
    let statusCode = STATUS.CREATED;
    try {
      const { article, userId } = response.locals;
      const [applause, created] = await models.ArticleClap.findOrCreate({
        where: {
          userId,
          articleId: article.id,
        },
        defaults: { claps },
      }).spread((row, isCreated) => ([row, isCreated]));

      const maxClaps = CLAPS_LIMIT;
      if (!created && applause.claps < maxClaps) {
        const currentClaps = applause.claps; // for user
        let clapValue = claps % maxClaps;
        const tempValue = currentClaps + clapValue; // assumed claps value
        if (tempValue > maxClaps) clapValue -= tempValue % maxClaps;

        await models.ArticleClap.increment('claps', {
          by: clapValue,
          where: { id: applause.id }
        });

        statusCode = STATUS.OK;
      }

      const squashClaps = (accumalator, current) => accumalator + current.claps;
      article.dataValues.claps = await article.getClaps({ raw: true }).reduce(squashClaps, 0);
      return ResponseHandler.send(response, statusCode, article, MESSAGE.SUCCESS_MESSAGE);
    } catch (error) {
      return next(createError(error));
    }
  }

  /**
   * Fetch article claps
   *
   * @static
   * @param {Request} request - Request object
   * @param {Response} response - Response object
   * @param {Function} next - Express next function
   * @returns {void}
   *
   * @memberof ClapsController
   */
  static async getArticleClaps(request, response, next) {
    const { params: { userId } } = request;
    const { article } = response.locals;
    let result;

    try {
      if (userId) {
        const claps = await ClapsController.getClapsByUser(article, userId);
        result = claps || { claps: 0 };
      } else {
        result = await article.getClaps();
      }
      return ResponseHandler.send(response, STATUS.OK, result, MESSAGE.SUCCESS_MESSAGE);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Fetch claps by given user
   *
   * @static
   * @param {object} article - The article resource to check
   * @param {number} userId - The user unique id
   * @returns {Array} - A list of claps
   * @memberof ClapsController
   */
  static async getClapsByUser(article, userId) {
    return models.ArticleClap.findOne({
      where: {
        articleId: article.id,
        userId,
      },
      attributes: ['claps'],
    });
  }
}

export default ClapsController;
