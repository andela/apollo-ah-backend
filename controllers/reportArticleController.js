/* eslint-disable max-len */
import models from '../models';
import Response from '../helpers/responseHelper';
import { STATUS } from '../helpers/constants';

const { reports } = models;


/**
 * @description Report Article functionality
 * @export- ReportArticleController
 * @class ReportArticleController
 * @returns {object} the reported article object
*/
export default class ReportArticleController {
  /**
   * @description Report a specific article and returns the reported article
   * @static
   * @param {req} req - the request object
   * @param {res} res - the resposne object
   * @returns {object} the reported article object
   */
  static async reportArticle(req, res) {
    const userId = req.user.id;
    const { articleId } = req.params;
    const { body: { reportType, comment } } = req;
    try {
      const reportArticle = await reports.create({
        userId,
        articleId,
        reportType,
        comment
      });
      return Response.send(res, STATUS.CREATED, reportArticle, 'success');
    } catch (err) {
      return Response.send(res, STATUS.SERVER_ERROR, err, 'failed');
    }
  }

  /**
   * @description Gets all reported article from the database and returns the reported articles
   * @static
   * @param {function} req the request object
   * @param {function} res the resposne object
   * @returns {object} the reported article object
   */
  static async getAllReportedArticle(req, res) {
    try {
      const getReportedArticles = await reports.findAndCountAll();
      if (getReportedArticles.count >= 1) {
        return Response.send(res, STATUS.OK, getReportedArticles, 'success');
      }
      return Response.send(res, STATUS.NOT_FOUND, [], 'No ratings for this article');
    } catch (err) {
      return Response.send(res, STATUS.SERVER_ERROR, err, 'failed');
    }
  }

  /**
   * @description Gets a specific reported article from the database and returns the reported article
   * @static
   * @param {function} req the request object
   * @param {function} res the resposne object
   * @returns {object} the reported article object
   */
  static async getOneReportedArticle(req, res) {
    try {
      const getReportedArticle = await reports.findAndCountAll({
        where: {
          articleId: req.params.articleId,
        }
      });
      if (getReportedArticle.count >= 1) {
        return Response.send(res, STATUS.OK, getReportedArticle, 'success');
      }
      return Response.send(res, STATUS.NOT_FOUND, [], 'No report for this article');
    } catch (err) {
      return Response.send(res, STATUS.SERVER_ERROR, err, 'failed');
    }
  }
}
