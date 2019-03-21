/* eslint-disable max-len */
import Response from '../helpers/responseHelper';
import { STATUS } from '../helpers/constants';
import models from '../models';

const { reports, Article } = models;
// console.log(reports);

/**
 * @description - This function validates input for article report type
 *
 * @export
 * @param {req} req - Request object
 * @param {res} res - Response object
 * @param {Function} next - Call to next middleware
 * @returns {object} - Error message object
 */
// eslint-disable-next-line import/prefer-default-export
export const validateReportType = (req, res, next) => {
  const { body: { reportType } } = req;
  if (req.body.reportType === 'others' && !req.body.comment) {
    return Response.send(res, STATUS.BAD_REQUEST, [], 'Please include description of your report', false);
  }
  if (req.body.reportType === 'others' && req.body.comment) {
    return next();
  }
  switch (!reportType || reportType) {
    case 'spam':
      return next();
    case 'plagiarism':
      return next();
    case 'rules violation':
      return next();
    default:
      return Response.send(res, STATUS.BAD_REQUEST, [], 'Report type can only include one of the following spam, plagiarism, rules violation or others', false);
  }
};

/**
 * @description - This function validates that a user doesn't report a specific article more than once
 *
 * @export
 * @param {req} req - Request object
 * @param {res} res - Response object
 * @param {Function} next - Call to next middleware
 * @returns {object} - Error message object
 */
export const reportOnce = async (req, res, next) => {
  const foundUser = await reports.findAndCountAll({
    where: {
      userId: req.user.id,
      articleId: req.params.articleId
    }
  });
  if (foundUser.count === 1) {
    return Response.send(res, STATUS.FORBIDDEN, {}, 'You cannot report an article more than once', false);
  }
  return next();
};


/**
 * @description - This function Validates the article a user wishes to report, making sure the article exist
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
