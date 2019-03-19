import models from '../models';
import Response from '../helpers/responseHelper';
import { STATUS } from '../helpers/constants';
import getAverageRatings from '../helpers/articleRatingHelper';

const { ratings } = models;
/**
 * @description Article rating functionality
 * @export- ArticleRatingController
 * @class ArticleRatingController
 * @returns {object} the rated article object
*/
export default class ArticleRatingController {
  /**
   * @description Add ratings for a specific article and returns the rated article
   * @static
   * @param {req} req - the request object
   * @param {res} res - the resposne object
   * @returns {object} the rated article object
   */
  static async create(req, res) {
    const userId = req.user.id;
    const { articleId } = req.params;
    const { body: { stars } } = req;
    try {
      const articleRating = await ratings.create({
        userId,
        articleId,
        stars
      });
      return Response.send(res, STATUS.CREATED, articleRating, 'success');
    } catch (err) {
      return Response.send(res, STATUS.SERVER_ERROR, err, 'failed');
    }
  }

  /**
   * @description Gets all rated article from the database and returns the rated articles
   * @static
   * @param {function} req the request object
   * @param {function} res the resposne object
   * @returns {object} the rated article object
   */
  static async get(req, res) {
    try {
      const getRatings = await ratings.findAndCountAll({
        where: {
          articleId: req.params.articleId,
        }
      });
      if (getRatings.count >= 1) {
        const averageRatings = getAverageRatings(getRatings, getRatings.count);
        const finalRatings = Object.assign({}, getRatings, {
          averageRatings
        });
        return Response.send(res, STATUS.OK, finalRatings, 'success');
      }
      return Response.send(res, STATUS.NOT_FOUND, [], 'No ratings for this article');
    } catch (err) {
      return Response.send(res, STATUS.SERVER_ERROR, err, 'failed');
    }
  }
}
