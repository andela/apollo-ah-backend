import models from '../models';
import Response from '../helpers/responseHelper';
import { STATUS } from '../helpers/constants';

/**
 * Wrapper class for sending comments objects as response.
 *
 * @export
 * @class CommentsMiddleware
 */
export default class CommentsMiddleware {
  /**
   * Verifies the request payload before calling the
   * express next() middleware to continue with the comments createComment controller
   * @static
   * @param {function} req The request object
   * @param {fucntion} res The response object
   * @param {function} next The express built in next middleware
   * @returns {function} returns the error object or returns next()
   */
  static async validateCreateCommentInput(req, res, next) {
    const userId = req.user.id;
    const { slug } = req.params;
    const { body, user } = req.body;

    if (!slug.trim()) {
      return Response.send(res, STATUS.BAD_REQUEST, [], 'slug not provided', false);
    }
    if (!body || !body.trim()) {
      return Response.send(res, STATUS.BAD_REQUEST, [], 'body not provided', false);
    }
    if (user && user !== 'anonymous') {
      return Response.send(res, STATUS.BAD_REQUEST, [], 'user field only accepts "anonymous"', false);
    }

    try {
      const article = await models.Article.findOne({ where: { slug: slug.trim() } });
      if (!article) {
        return Response.send(res, STATUS.NOT_FOUND, [], 'No article with that slug exist', false);
      }
      if (user && user === 'anonymous') res.locals.userType = 'anonymous';
      res.locals.authorId = userId;
      res.locals.articleId = article.dataValues.id;
      return next();
    } catch (error) {
      return Response.send(res, STATUS.BAD_REQUEST, error, 'Server error', false);
    }
  }

  /**
   * Verifies the request payload before calling the
   * express next() middleware to continue with the comments getAllComments controller
   * @static
   * @param {function} req The request object
   * @param {fucntion} res The response object
   * @param {function} next The express built in next middleware
   * @returns {function} returns the error object or returns next()
   */
  static async validateGetAllComments(req, res, next) {
    const { slug } = req.params;

    if (!slug.trim()) {
      return Response.send(res, STATUS.BAD_REQUEST, [], 'slug not provided', false);
    }

    try {
      const article = await models.Article.findOne({ where: { slug: slug.trim() } });
      if (!article) {
        return Response.send(res, STATUS.NOT_FOUND, [], 'No article with that slug exist', false);
      }
      res.locals.articleId = article.dataValues.id;
      return next();
    } catch (error) {
      return Response.send(res, STATUS.BAD_REQUEST, error, 'Server error', false);
    }
  }

  /**
   * Verifies the request payload before calling the
   * express next() middleware to continue with the comments updateComment controller
   * @static
   * @param {function} req The request object
   * @param {fucntion} res The response object
   * @param {function} next The express built in next middleware
   * @returns {function} returns the error object or returns next()
   */
  static async validateUpdateComment(req, res, next) {
    const { slug, id } = req.params;
    const userId = req.user.id;
    const { body, user } = req.body;
    const commentId = Number(id);

    if (!slug.trim()) {
      return Response.send(res, STATUS.BAD_REQUEST, [], 'slug not provided', false);
    }
    if (!commentId) {
      return Response.send(res, STATUS.BAD_REQUEST, [], 'the comment id is invalid', false);
    }
    if (!body || !body.trim()) {
      return Response.send(res, STATUS.BAD_REQUEST, [], 'comment body not provided', false);
    }
    if (user && user !== 'anonymous' && user !== 'user') {
      return Response.send(res, STATUS.BAD_REQUEST, [], 'user field only accepts "anonymous" or "user"', false);
    }

    try {
      const article = await models.Article.findOne({ where: { slug: slug.trim() } });
      if (!article) {
        return Response.send(res, STATUS.NOT_FOUND, [], 'No article with that slug exist', false);
      }
      const comment = await models.Comment.findOne({
        where: { id, authorId: userId, articleId: article.dataValues.id }
      });
      if (!comment) return Response.send(res, STATUS.NOT_FOUND, [], 'the comment does not exist', false);

      res.locals.authorId = userId;
      res.locals.articleId = article.dataValues.id;
      if (user && user === 'anonymous') res.locals.userType = 'anonymous';
      if (user && user === 'user') res.locals.userType = 'user';
      return next();
    } catch (error) {
      return Response.send(res, STATUS.BAD_REQUEST, error, 'Server error', false);
    }
  }

  /**
   * Verifies the request payload before calling the
   * express next() middleware to continue with the comments deleteComment controller
   * @static
   * @param {function} req The request object
   * @param {fucntion} res The response object
   * @param {function} next The express built in next middleware
   * @returns {function} returns the error object or returns next()
   */
  static async validateDeleteComment(req, res, next) {
    const authorId = req.user.id;
    const { slug, id } = req.params;
    const commentId = Number(id);

    if (!slug.trim()) {
      return Response.send(res, STATUS.BAD_REQUEST, [], 'slug not provided', false);
    }
    if (!commentId) {
      return Response.send(res, STATUS.BAD_REQUEST, [], 'the comment id is invalid', false);
    }

    try {
      const article = await models.Article.findOne({ where: { slug: slug.trim() } });
      if (!article) return Response.send(res, STATUS.NOT_FOUND, [], 'No article with that slug exist', false);

      const comment = await models.Comment.findOne({
        where: { id, authorId, articleId: article.dataValues.id }
      });
      if (!comment) return Response.send(res, STATUS.NOT_FOUND, [], 'the comment does not exist', false);

      res.locals.comment = comment;
      return next();
    } catch (error) {
      return Response.send(res, STATUS.BAD_REQUEST, error, 'Server error', false);
    }
  }
}
