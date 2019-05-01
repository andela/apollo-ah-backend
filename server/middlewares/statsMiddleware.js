import models from '../models';
import Response from '../helpers/responseHelper';
import { STATUS } from '../helpers/constants';

/**
 * Wrapper class for calculating user statistics.
 *
 * @export
 * @class StatisticsMiddleware
 */
export default class StatisticsMiddleware {
  /**
   * Verifies the request payload before calling the
   * express next() middleware to continue with the comments sendUserStats controller
   * @static
   * @param {function} req The request object
   * @param {fucntion} res The response object
   * @param {function} next The express built in next middleware
   * @returns {function} returns the error object or returns next()
   */
  static async getUserStats(req, res, next) {
    const userId = req.user.id;
    const stats = {};

    if (!Number(req.params.id)) return Response.send(res, STATUS.BAD_REQUEST, [], 'the provided params is invalid', false);
    if (userId !== Number(req.params.id)) return Response.send(res, STATUS.FORBIDDEN, [], 'You are not authorized to view this stat', false);

    const commentsResult = await models.Comment.findAndCountAll({ where: { authorId: userId } });
    const likesResult = await models.ArticleLike.findAndCountAll({ where: { userId } });
    const bookmarkedResult = await models.Bookmark.findAndCountAll({ where: { userId } });
    const articleResult = await models.History.findAndCountAll({ where: { userId } });

    stats.bookmarked = bookmarkedResult.count;
    stats.comments = commentsResult.count;
    stats.liked = likesResult.count;
    stats.articles = articleResult.count;

    res.locals.stats = stats;

    return next();
  }
}
