
import models from '../models';
import Response from '../helpers/responseHelper';
import articleHelpers from '../helpers/articleHelpers';
import { STATUS } from '../helpers/constants';
import Logger from '../helpers/logger';
import statsHelper from '../helpers/statsHelper';
import dataProvider from '../helpers/nestedDataProvider';


const { Article, Bookmark } = models;

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
      title, body, description, categoryId, tagList, image = '',
    } = req.body;

    const readTime = articleHelpers.articleReadTime(req.body);
    try {
      const categoryFound = await articleHelpers.findArticleCategory(res, categoryId);
      const { category } = categoryFound;
      const content = {
        title, body, description, slug, authorId, readTime, categoryId, tagList, image
      };
      const result = await models.Article.create(content, {
        include: [
          {
            model: models.Tag,
            as: 'tagList',
            through: { attributes: [] }
          }
        ]
      });

      const article = JSON.parse(JSON.stringify(result)); // clone result
      article.tagList = article.tagList.map(tag => tag.tagName);
      article.category = category;
      return Response.send(
        res,
        STATUS.CREATED,
        article,
        'article was successfully created'
      );
    } catch (error) {
      return Response.send(res, STATUS.BAD_REQUEST, error, '', false);
    }
  }

  /**
   * Makes a request to the database
   * and returns an array of exisiting Article object(s),
   * sorting them from the latest to the earliest,
   * and passsing the result to the next middleware
   * @static
   * @param {function} req the request object
   * @param {function} res the resposne object
   * @param {function} next the express next function
   * @returns {void}
   */
  static async getAllArticles(req, res, next) {
    try {
      // TODO: Implement search algorithm here
      const { offset, limit } = req.body;
      const {
        categoryQuery, titleQuery, authorQuery, tagQuery
      } = articleHelpers.formatSearchQuery(req.query);

      const articles = await models.Article.findAndCountAll({
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        distinct: true,
        where: {
          ...titleQuery,
        },
        include: dataProvider(categoryQuery, authorQuery, tagQuery),
      });
      const {
        code, data, message, status
      } = articleHelpers.getResourcesAsPages(req, articles);
      return Response.send(res, code, data, message, status);
    } catch (error) {
      Logger.log(error);
      return Response.send(res, STATUS.BAD_REQUEST, error, '', false);
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
    const { userId } = res.locals;
    const { slug } = req.params;
    try {
      const article = await models.Article.findOne({
        where: { slug: slug.trim() },
        include: dataProvider(),
      });
      if (!article) {
        return Response.send(res, STATUS.NOT_FOUND, [], `no article with slug: ${slug} found`, false);
      }
      if (userId) await statsHelper.confirmUser(userId, article.id, article.categoryId);
      return Response.send(res, STATUS.OK, article, 'article was successfully fetched', true);
    } catch (error) {
      return Response.send(res, STATUS.BAD_REQUEST, error, 'server error', false);
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
        return Response.send(res, STATUS.NOT_FOUND, [], `no article with id: ${articleId} found`, false);
      }
      return Response.send(res, STATUS.OK, article[1], 'article was successfully updated', true);
    } catch (error) {
      return Response.send(res, STATUS.BAD_REQUEST, error, '', false);
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
        return Response.send(res, STATUS.NOT_FOUND, [], `no article with id: ${articleId} found`, false);
      }
      return Response.send(res, STATUS.OK, foundArticle, 'article was successfully deleted', true);
    } catch (error) {
      return Response.send(res, STATUS.BAD_REQUEST, error, '', false);
    }
  }

  /**
 * @description users can bookmark articles for reading later.
 * @static
 * @param  {object} req - The request object
 * @param  {object} res - The response object
 * @return {object} - It returns the request response object
 */
  static async bookmarkArticle(req, res) {
    const { slug } = req.params;
    const userId = req.user.id;
    let articleId;

    try {
      const articleFound = await Article.findOne({ where: { slug } });

      if (!articleFound) return Response.send(res, STATUS.NOT_FOUND, [], 'This article does not exist', false);
      articleId = articleFound.id;
      const bookmarkExist = await Bookmark.findOne({ where: { articleId, userId, } });

      if (bookmarkExist) {
        const unbookmarked = bookmarkExist.dataValues;
        await Bookmark.destroy({
          where: { articleId, userId },
          returning: true,
        });
        return Response.send(res, STATUS.OK, unbookmarked, 'successfully unbookmarked this article', true);
      }

      const newBookmark = await Bookmark.create({ userId, articleId });
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
