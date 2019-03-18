import models from '../models';
import Response from '../helpers/responseHelper';
import articleHelpers from '../helpers/articleHelpers';
import { STATUS } from '../helpers/constants';
const { ArticleCategory } = models;

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
      title, body, description, categoryId
    } = req.body;

    const readTime = articleHelpers.articleReadTime(req.body);
    try {
      const categoryFound = await articleHelpers.findArticleCategory(res, categoryId);
      const { category } = categoryFound;
      const content = {
        title, body, description, slug, authorId, readTime, categoryId
      };
      const article = await models.Article.create(content);

      return Response.send(
        res, STATUS.CREATED, { ...article.dataValues, category }, 'article was successfully created', true,
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
        order: [['createdAt', 'DESC']],
        include: [{
          model: ArticleCategory,
          as: 'articleCategory',
          attributes: { exclude: ['id'] },
          required: true,
        }]
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
        where: { slug: slug.trim() },
        include: [{
          model: ArticleCategory,
          as: 'articleCategory',
          attributes: { exclude: ['id'] },
          required: true,
        }]
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
}
