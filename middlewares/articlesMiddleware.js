// import createError from 'http-errors';
import slugify from 'slugify';
import uuid from 'uuid/v4';
import articleHelpers from '../helpers/articleHelpers';
import Response from '../helpers/responseHelper';

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
   * @param {function} next the express built in next() middleare
   * @returns {function} returns erros objects or calls next
   */
  static async validateCreateArticleInput(req, res, next) {
    const authorId = req.user.id;
    const {
      title = '',
      description = '',
      body = '',
    } = req.body;

    if (typeof title !== 'string') {
      return Response.send(res, 400, [], 'title must be a string', 'failed');
    }
    if (typeof body !== 'string') {
      return Response.send(res, 400, [], 'body must be a string', 'failed');
    }
    if (typeof description !== 'string') {
      return Response.send(res, 400, [], 'description must be a string', 'failed');
    }

    if (!title || !title.trim()) {
      return Response.send(res, 400, [], 'title cannot be empty', 'failed');
    }
    if (!body || !body.trim()) {
      return Response.send(res, 400, [], 'body cannot be empty', 'failed');
    }
    if (!description || !description.trim()) {
      return Response.send(res, 400, [], 'description cannot be empty', 'failed');
    }

    try {
      const foundArticle = await articleHelpers.findArticleByAuthorId(authorId, title);
      if (foundArticle && foundArticle.title === title) {
        return Response.send(
          res, 400, [], 'an article with that title already exist', 'failed',
        );
      }
      const slug = slugify(`${title}-${uuid()}`, '-');
      res.locals.slug = slug;
      return next();
    } catch (error) {
      return Response.send(res, 400, error, 'could not create article', 'failed');
    }
  }
}
