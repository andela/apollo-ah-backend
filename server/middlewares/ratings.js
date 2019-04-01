/* eslint-disable max-len */
import Response from '../helpers/responseHelper';
import { STATUS } from '../helpers/constants';
import models from '../models';

const { Article } = models;

/**
 * @description - This function validates rating input, making sure it is not less than 1 or greater 5
 *
 * @export
 * @param {req} req - Request object
 * @param {res} res - Response object
 * @param {Function} next - Call to next middleware
 * @returns {object} - Error message object
 */

export const validateRatings = (req, res, next) => {
  const { body: { stars } } = req;
  if (!stars || stars < 1 || stars > 5) {
    return Response.send(res, STATUS.BAD_REQUEST, [], 'Input cannot be less than 1 or greater than 5', false);
  }
  return next();
};

/**
 * @description - This function Validates the article a user wishes to rate, making sure the article exist
 *
 * @export
 * @param {req} req - Request object
 * @param {res} res - Response object
 * @param {Function} next - Call to next middleware
 * @returns {object} - Error message object
 */
export const checkArticle = async (req, res, next) => {
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(req.params.articleId)) {
    return Response.send(res, STATUS.NOT_FOUND, {}, 'ARTICLE NOT FOUND', 'Failure');
  }
  const foundArticle = await Article.findAndCountAll({
    where: {
      id: req.params.articleId,
    }
  });
  if (foundArticle.count >= 1) {
    return next();
  }
  return Response.send(res, STATUS.NOT_FOUND, {}, 'ARTICLE NOT FOUND', 'Failure');
};
