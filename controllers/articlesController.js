import models from '../models';
import Response from '../helpers/responseHelper';
import articleHelpers from '../helpers/articleHelpers';
import { STATUS } from '../helpers/constants';

const { Article, User, Bookmark } = models;


/**
 * Wrapper class for sending article objects as response.
 *
 * @export
 * @class ArticlesController
 */
export default class ArticlesController {
  /**
   * Sends the request payload to the database and creates an article,
   * returning the created article object
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
      return Response.send(
        res, STATUS.CREATED, article.dataValues, 'article was successfully created', true,
      );
    } catch (error) {
      return Response.send(res, STATUS.BAD_REQUEST, error, false);
    }
  }

  /**
   * Makes a request to the database
   * and returns an array of exisiting Article object(s),
   * sorting them from the latest to the earliest
   * @static
   * @param {function} req the request object
   * @param {function} res the resposne object
   * @returns {function} an array of Article object
   */
  static async getAll(req, res) {
    try {
      /**
       * @todo Page count for pagination
       */
      const allArticles = await models.Article.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']]
      });
      return Response.send(
        res, STATUS.OK, allArticles, 'articles were successfully fetched',
      );
    } catch (error) {
      return Response.send(res, STATUS.BAD_REQUEST, error, false);
    }
  }

  /**
   * Sends the article's slug parameter to the database
   * and returns the corresponding article object
   * @static
   * @param {function} req the request object
   * @param {function} res the resposne object
   * @param {articleId} articleId the Article ID
   * @returns {function} an array of Articles object
   */
  static async getOne(req, res) {
    const { slug } = req.params;
    try {
      const article = await models.Article.findOne({
        where: { slug: slug.trim() }
      });
      if (!article) {
        return Response.send(
          res, STATUS.NOT_FOUND, [], `no article with slug: ${slug} found`, false,
        );
      }
      return Response.send(
        res, STATUS.OK, article, 'article was successfully fetched', true,
      );
    } catch (error) {
      return Response.send(
        res, STATUS.BAD_REQUEST, error, 'server error', false,
      );
    }
  }

  /**
 * Sends the articleID parameter to the database
 * and updates the corresponding article object
 * @static
 * @param {function} req the request object
 * @param {function} res the resposne object
 * @param {articleId} articleId the Article ID
 * @returns {function} an array of Articles object
 */
  static async update(req, res) {
    const { articleId } = req.params;
    const { slug } = res.locals;

    try {
      const article = await models.Article.update({ ...req.body, slug: slug.trim() }, {
        where: { id: articleId },
        fields: ['title', 'body', 'description', 'slug'],
        returning: true,
        paranoid: true,
      });
      if (!article) {
        return Response.send(
          res, STATUS.NOT_FOUND, [], `no article with id: ${articleId} found`, false,
        );
      }
      return Response.send(
        res, STATUS.OK, article[1], 'article was successfully updated', true,
      );
    } catch (error) {
      return Response.send(res, STATUS.BAD_REQUEST, error, false);
    }
  }

  /**
 * Sends the articleID parameter to the database
 * and deletes the corresponding article object
 * @static
 * @param {function} req the request object
 * @param {function} res the resposne object
 * @param {articleId} articleId the Article ID
 * @returns {function} an array of Articles object
 */
  static async delete(req, res) {
    const foundArticle = res.locals.article;
    const { articleId } = req.params;
    try {
      const article = await models.Article.destroy({
        where: { id: articleId },
        returning: true,
      });
      if (!article) {
        return Response.send(
          res, STATUS.NOT_FOUND, [], `no article with id: ${articleId} found`, false,
        );
      }
      return Response.send(
        res, STATUS.OK, foundArticle, 'article was successfully deleted', true,
      );
    } catch (error) {
      return Response.send(res, STATUS.BAD_REQUEST, error, false);
    }
  }

  /**
 * @description users can bookmark articles for reading later.
 * @static
 * @param  {object} req - The request object
 * @param  {object} res - The response object
 * @return {object} - It returns the request response object
 */
  static async bookmark(req, res) {
    const { slug } = req.params;
    const userId = req.user.id;
    let articleId;

    try {
      const user = await User.findOne({
        where: {
          id: userId
        }
      });

      if (!user) return Response.send(res, STATUS.UNATHORIZED, [], 'You have to signed up to bookmark an article', false);
      const articleFound = await Article.findOne({
        where: {
          slug
        }
      });

      if (!articleFound) return Response.send(res, STATUS.NOT_FOUND, [], 'This article does not exist', false);
      articleId = articleFound.id;
      const bookmarkExist = await Bookmark.findOne({
        where: {
          articleId,
          userId,
        }
      });

      if (bookmarkExist) {
        await Bookmark.destroy(
          {
            where: {
              articleId,
              userId
            }
          }
        );
        return Response.send(res, STATUS.OK, [], 'successfully unbookmarked this article', true);
      }

      const newBookmark = await Bookmark.create(
        { userId, articleId }
      );
      return Response.send(res, STATUS.CREATED, newBookmark, 'successfully bookmarked this article', true);
    } catch (error) {
      return Response.send(res, STATUS.SERVER_ERROR, error.message, 'sorry! something went wrong', false);
    }
  }

  /**
* @description users can get all bookmarked articles.
* @static
* @param  {object} req - The request object
* @param  {object} res - The response object
* @return {object} - It returns the request response object
*/
  static async getBookmarkedArticles(req, res) {
    const userId = req.user.id;
    try {
      const bookmarkedArticles = await Bookmark.findAll({
        where: {
          userId
        },
        include: [{
          model: Article,
        }]
      });
      return Response.send(res, STATUS.OK, bookmarkedArticles, 'Bookmarked articles', true);
    } catch (error) {
      return Response.send(res, STATUS.SERVER_ERROR, error.message, 'something went wrong, try again later!', false);
    }
  }
}
