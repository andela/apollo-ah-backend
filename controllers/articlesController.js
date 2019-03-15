import models from '../models';
import Response from '../helpers/responseHelper';
import articleHelpers from '../helpers/articleHelpers';
import { STATUS } from '../helpers/constants';

/**
 * Wrapper class for sending article objects as response.
 *
 * @export
 * @class ArticlesController
 */
export default class ArticlesController {
  /**
   * Sends the request payload to the database and returns the article object
   * @static
   * @param {function} req the request object
   * @param {function} res the resposne object
   * @returns {function} the Article object
   */
  static async create(req, res) {
    const authorId = req.user.id;
    const { slug } = res.locals;
    const {
      title, body, description,
    } = req.body;
    const readTime = articleHelpers.articleReadTime(req.body);
    const content = {
      title, body, description, slug, authorId, readTime
    };
    try {
      const article = await models.Article.create(content);
      return Response.send(res, STATUS.CREATED, article, 'success');
    } catch (error) {
      return Response.send(res, STATUS.BAD_REQUEST, error, 'failed');
    }
  }
}
