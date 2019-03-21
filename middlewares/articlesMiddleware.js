// import createError from 'http-errors';
import slugify from 'slugify';
import uuid from 'uuid/v4';
import jwt from 'jsonwebtoken';
import articleHelpers from '../helpers/articleHelpers';
import Response from '../helpers/responseHelper';
import models from '../models';
import { STATUS, MESSAGE, PAGE_LIMIT } from '../helpers/constants';

/**
 * Wrapper class for validating requests.
 *
 * @export
 * @class ArticlesMiddleware
 */
export default class AriclesMiddleware {
  /**
   * Validates the request body before sending it to the controller
   * @static
   * @param {function} req the request object
   * @param {function} res the response object
   * @param {function} next the express built in next() middleware
   * @returns {function} returns erros objects or calls next
   */
  static async validateCreateArticle(req, res, next) {
    const authorId = req.user.id;
    const {
      title = '',
      description = '',
      body = '',
      categoryId = '',
    } = req.body;

    if (typeof title !== 'string') {
      return Response.send(res, STATUS.BAD_REQUEST, [], 'title must be a string', false);
    }
    if (typeof body !== 'string') {
      return Response.send(res, STATUS.BAD_REQUEST, [], 'body must be a string', false);
    }
    if (typeof description !== 'string') {
      return Response.send(res, STATUS.BAD_REQUEST, [], 'description must be a string', false);
    }

    // eslint-disable-next-line no-restricted-globals
    if (isNaN(categoryId)) {
      return Response.send(
        res, STATUS.BAD_REQUEST, {}, 'category type must be an integer', false,
      );
    }

    if (!title || !title.trim()) {
      return Response.send(res, STATUS.BAD_REQUEST, [], 'title cannot be empty', false);
    }
    if (!body || !body.trim()) {
      return Response.send(res, STATUS.BAD_REQUEST, [], 'body cannot be empty', false);
    }
    if (!description || !description.trim()) {
      return Response.send(res, STATUS.BAD_REQUEST, [], 'description cannot be empty', false);
    }
    if (!categoryId) {
      return Response.send(res, STATUS.BAD_REQUEST, [], 'category cannot be empty', false);
    }

    try {
      const foundArticle = await articleHelpers.findArticleByAuthorId(authorId, title);
      if (foundArticle && foundArticle.title === title) {
        return Response.send(res, STATUS.FORBIDDEN, [], MESSAGE.ARTICLE_EXIST, false);
      }
      const categoryFound = await models.ArticleCategory.findOne({
        where: {
          id: categoryId
        }
      });
      if (!categoryFound) {
        return Response.send(res, STATUS.BAD_REQUEST, [], 'category does not exist', false);
      }
      const slug = slugify(`${title}-${uuid()}`, {
        remove: /[*+~.()'"!:@]/g,
        replacement: '-',
        lower: true
      });
      res.locals.slug = slug;
      return next();
    } catch (error) {
      return Response.send(res, STATUS.BAD_REQUEST, error, 'could not create article', false);
    }
  }

  /**
   * Sends the articleId parameter to the database and returns the corresponding article object
   * @static
   * @param {function} req the request object
   * @param {function} res the resposne object
   * @param {next} next tthe express built in next() middleware
   * @param {articleId} articleId the Article ID
   * @returns {function} returns erros objects or calls next
   */
  static validateGetOneArticle(req, res, next) {
    const { slug } = req.params;

    if (!slug.trim()) {
      return Response.send(res, STATUS.BAD_REQUEST, [], 'empty space not allowed', false);
    }
    if (typeof slug !== 'string') {
      return Response.send(
        res, STATUS.BAD_REQUEST, [], 'slug is not a string', false,
      );
    }

    if (req.headers && req.headers.authorization) {
      const payload = req.headers.authorization.split(' ');
      const token = payload[1];
      const { user } = jwt.verify(token, process.env.APP_KEY);
      if (!user) return next();
      res.locals.userId = user.id;
    }
    return next();
  }

  /**
   * Sends the articleId parameter to the database and returns the corresponding article object
   * @static
   * @param {function} req the request object
   * @param {function} res the resposne object
   * @param {next} next tthe express built in next() middleware
   * @param {articleId} articleId the Article ID
   * @returns {function} returns erros objects or calls next
   */
  static async validateUpdateArticle(req, res, next) {
    const userId = req.user.id;
    const id = req.params.articleId;
    const articleId = Number(id);

    const { title = '' } = req.body;

    if (!articleId) {
      return Response.send(res, STATUS.BAD_REQUEST, [], 'article Id is not a number', false);
    }
    if (articleId < 1) {
      return Response.send(res, STATUS.BAD_REQUEST, [], 'article Id is not valid', false);
    }

    try {
      const searchResult = await models.Article.findByPk(articleId);
      const foundArticle = searchResult.dataValues;
      if (foundArticle.authorId !== userId) {
        return Response.send(res, STATUS.FORBIDDEN, [], 'you do not have the right to update this article', false);
      }
      if (title) {
        const slug = slugify(`${title}-${uuid()}`, '-');
        res.locals.slug = slug;
      }
      // res.locals.article = foundArticle;
      return next();
    } catch (error) {
      return Response.send(res, STATUS.SERVER_ERROR, error, 'an error occurred', false);
    }
  }

  /**
   * Sends the articleId parameter to the database and returns the corresponding article object
   * @static
   * @param {function} req the request object
   * @param {function} res the resposne object
   * @param {next} next tthe express built in next() middleware
   * @param {articleId} articleId the Article ID
   * @returns {function} returns erros objects or calls next
   */
  static async validateDeleteArticle(req, res, next) {
    const userId = req.user.id;
    const id = req.params.articleId;
    const articleId = Number(id);

    if (!articleId) {
      return Response.send(res, STATUS.BAD_REQUEST, [], 'article Id was not provided', false);
    }
    if (typeof articleId !== 'number') {
      return Response.send(res, STATUS.BAD_REQUEST, [], 'article Id is not a number', false);
    }
    if (articleId < 1) {
      return Response.send(res, STATUS.BAD_REQUEST, [], 'article Id is not valid', false);
    }

    try {
      const searchResult = await models.Article.findByPk(articleId);
      const foundArticle = searchResult.dataValues;
      if (foundArticle.authorId !== userId) {
        return Response.send(res, STATUS.FORBIDDEN, [], 'you do not have the right to delete this article', false);
      }
      res.locals.article = foundArticle;
      return next();
    } catch (error) {
      return Response.send(res, STATUS.SERVER_ERROR, error, 'an error occurred', false);
    }
  }

  /**
   * Validates the page query parameter and calculate the offset value
   * @static
   * @param {function} req the request object
   * @param {function} res the response object
   * @param {function} next the express built in next() middleware
   * @returns {function} returns erros objects or calls next
   */
  static validatePagination(req, res, next) {
    const page = req.query.page || 1;
    const limit = req.query.size || PAGE_LIMIT;
    const offset = (page * limit) - limit;
    req.body.offset = (!offset || offset < 0) ? 0 : offset;
    req.body.limit = limit;
    req.body.current = req.body.offset === 0 ? 1 : Number(req.query.page);
    next();
  }

  /**
   * Validate tagList param on the request body
   *
   * @static
   * @param {object} request - Express Request object
   * @param {object} response - Express Response object
   * @param {NextFunction} next - Express nextFunction
   * @returns {Function} call to next middleware
   * @memberof AriclesMiddleware
   */
  static validateTagList(request, response, next) {
    let { tagList } = request.body;
    if (tagList) { // convert value to key:value pair
      tagList = [...new Set(tagList)];
      request.body.tagList = tagList.map(tag => ({ tagName: tag }));
    } else {
      request.body.tagList = [];
    }
    return next();
  }
}
