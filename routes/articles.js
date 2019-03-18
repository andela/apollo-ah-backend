import express from 'express';
import articlesMiddleware from '../middlewares/articlesMiddleware';
import articlesController from '../controllers/articlesController';
import ArticleLikeController from '../controllers/articleLikesController';
import authenticate from '../middlewares/authenticate';
import Validator from '../middlewares/validator';
import Handler from '../middlewares/handleValidation';

const articles = express.Router();

/**
 * @swagger
 * definitions:
 *   Article:
 *     properties:
 *       title:
 *         type: string
 *       description:
 *         type: string
 *       body:
 *         type: string
 */

/**
 * @swagger
 * /api/v1/articles:
 *   get:
 *     tags:
 *       - articles
 *     description: Returns a single article
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: articleId
 *         description: Id for the article
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully fetched
 *         schema:
 *           $ref: '#/definitions/Article'
 */
articles.get(
  '/:slug',
  authenticate,
  articlesMiddleware.validateGetOneArticle,
  articlesController.getOne
);

/**
 * @swagger
 * /api/v1/articles:
 *   delete:
 *     tags:
 *       - articles
 *     description: Deletes a single article
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: articleId
 *         description: Id for the article
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully deleted
 *         schema:
 *           $ref: '#/definitions/Article'
 */
articles.delete(
  '/:articleId',
  authenticate,
  articlesMiddleware.validateDeleteArticle,
  articlesController.delete
);

/**
 * @swagger
 * /api/v1/articles:
 *   put:
 *     tags:
 *       - articles
 *     description: Deletes a single article
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: articleId
 *         description: Id for the article
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully updated
 *         schema:
 *           $ref: '#/definitions/Article'
 */
articles.put(
  '/:articleId',
  authenticate,
  articlesMiddleware.validateUpdateArticle,
  articlesController.update
);

/**
 * @swagger
 * /api/v1/articles:
 *   post:
 *     tags:
 *       - articles
 *     description: Create a new article
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: title
 *         description: Artilce's title
 *         in: body
 *         required: true
 *         type: string
 *       - name: body
 *         description: Content of the body
 *         in: body
 *         required: true
 *         type: string
 *       - name: description
 *         description: A brief description of the created article
 *         in: body
 *         required: true
 *         type: string
 *     responses:
 *       201:
 *         description: Successfully created
 *         schema:
 *           $ref: '#/definitions/Article'
 */
articles.post(
  '/',
  authenticate,
  articlesMiddleware.validateCreateArticle,
  articlesController.create,
);

/**
 * @swagger
 * /api/v1/articles:
 *   get:
 *     tags:
 *       - articles
 *     description: Returns all articles
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully fetched
 *         schema:
 *           $ref: '#/definitions/Article'
 */
articles.get(
  '/',
  Validator.validatePaginationLimit(),
  Handler.handleValidation,
  articlesMiddleware.validatePagination,
  articlesController.getAllArticles,
);


/**
 * @swagger
 * /api/v1/articles/:slug/likes:
 *   post:
 *     tags:
 *       - articles
 *     description: like an article
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: slug
 *         description: Artilce's slug
 *         in: parameter
 *         required: true
 *         type: string
 *     responses:
 *       201:
 *         description: Successfully liked article
 *         schema:
 *           $ref: '#/definitions/Article'
 */

articles.post(
  '/:slug/likes',
  authenticate,
  ArticleLikeController.like
);

/**
 * @swagger
 * /api/v1/articles/:slug/dislikes:
 *   post:
 *     tags:
 *       - articles
 *     description: like an article
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: slug
 *         description: Artilce's slug
 *         in: parameter
 *         required: true
 *         type: string
 *     responses:
 *       201:
 *         description: Successfully disliked article
 *         schema:
 *           $ref: '#/definitions/Article'
 */
articles.post(
  '/:slug/dislikes',
  authenticate,
  ArticleLikeController.dislike
);

/**
 * @swagger
 * /api/v1/articles/:slug/bookmarks:
 *   post:
 *     tags:
 *       - articles
 *     description: create a bookmark
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: slug
 *         description: Artilce's slug
 *         in: parameter
 *         required: true
 *         type: string
 *     responses:
 *       201:
 *         description: successfully bookmarked this article
 *         schema:
 *           $ref: '#/definitions/Bookmark'
 */
articles.post(
  '/:slug/bookmarks',
  authenticate,
  articlesController.bookmarkArticle
);

export default articles;
