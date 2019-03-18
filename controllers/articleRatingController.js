import models from '../models';
import Response from '../helpers/responseHelper';
import { STATUS } from '../helpers/constants';
import getAverageRatings from '../helpers/articleRatingHelper';

const { Ratings } = models;
/**
 * Class representing article rating controller.
 *
 * @export
 * @class ArticleRatingController
*/
export default class ArticleRatingController {
  /**
   * Sends the request payload to the database and returns the article object
   * @static
   * @param {function} req the request object
   * @param {function} res the resposne object
   * @returns {function} the Article object
   */
  static async create(req, res) {
    const userId = req.user.id;
    const { articleId } = req.params;
    const { body: { stars } } = req;
    try {
      const articleRating = await Ratings.create({
        userId,
        articleId,
        stars
      });
      return Response.send(res, STATUS.CREATED, articleRating, 'sucsess');
    } catch (err) {
      return Response.send(res, STATUS.SERVER_ERROR, err, 'failed');
    }
  }

  /**
   * Sends the request payload to the database and returns the article object
   * @static
   * @param {function} req the request object
   * @param {function} res the resposne object
   * @returns {function} the Article object
   */
  static async get(req, res) {
    try {
      const getRatings = await Ratings.findAndCountAll({
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
