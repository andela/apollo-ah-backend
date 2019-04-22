import express from 'express';
import articlesMiddleware from '../middlewares/articlesMiddleware';
import articlesController from '../controllers/articlesController';
import ArticleLikeController from '../controllers/articleLikesController';
import ClapsController from '../controllers/clapsController';
import authenticate from '../middlewares/authenticate';
import Validator from '../middlewares/validator';
import Handler from '../middlewares/handleValidation';

const articles = express.Router();

/**
* /api/v1/articles/:
*  get:
*    tags:
*      - Search, Articles
*    description: Get the list of all articles.
*                 Optionally filter by title/description, tag or author
*    produces:
*       - application/json
*    parameters:
*      - name: q
*        description: If provided, results will be filtered by title and description of articles
*        in: query
*        required: false
*        type: string
*      - name: tag
*        description: If provided, results will be filtered by article tags
*        in: query
*        required: false
*        type: string
*      - name: author
*        description: If provided, results will be filtered by author
*        in: query
*        required: false
*        type: string
*      - name: page
*        description: If provided, returns the the articles in that badge(page)
*        in: query
*        required: false
*        type: integer
*      - name: size
*        description: The maximum number of results to return in a single requests. (max =500)
*        in: query
*        required: false
*        type: integer
*    responses:
*      200:
*        description: Articles successfully fetched
*        schema:
*          type: object
*/
articles.get(
  '/',
  Validator.validateSearchParam(),
  Validator.validatePaginationLimit(),
  Handler.handleValidation,
  articlesMiddleware.validatePagination,
  articlesController.getAllArticles,
);

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
 *       tagList:
 *         type: array
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
  '/', authenticate,
  articlesMiddleware.validateCreateArticle,
  articlesMiddleware.validateTagList,
  articlesController.create
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

articles.post('/:slug/likes', authenticate, ArticleLikeController.like);

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
 *         description: Article's slug
 *         in: parameter
 *         required: true
 *         type: string
 *     responses:
 *       201:
 *         description: Successfully disliked article
 *         schema:
 *           $ref: '#/definitions/Article'
 */
articles.post('/:slug/dislikes', authenticate, ArticleLikeController.dislike);

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

/**
 * @swagger
 * /api/v1/articles/:slug/claps:
 *   post:
 *     tags:
 *       - applause, claps
 *     description: Create or update an article claps
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: slug
 *         description: Article's slug value
 *         in: query
 *         required: true
 *         type: string
 *       - name: claps
 *         description: Total number of claps
 *         in: body
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Request was successful
 */
articles.post(
  '/:slug/claps',
  Validator.validateClaps(),
  Handler.handleValidation,
  authenticate,
  ClapsController.articleClap
);

/**
 * @swagger
 * /api/v1/articles/:slug/claps:
 *   get:
 *     tags:
 *       - applause, claps
 *     description: Fetch an article claps
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: slug
 *         description: Article's slug value
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Request was successful
 */
articles.get(
  '/:slug/claps',
  ClapsController.getArticleClaps
);

/**
 * @swagger
 * /api/v1/articles/:slug/claps/:userId:
 *   get:
 *     tags:
 *       - applause, claps
 *     description: Fetch an article claps by a specific user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: slug
 *         description: Article's slug value
 *         in: query
 *         required: true
 *         type: string
 *       - name: userId
 *         description: The userId
 *         in: query
 *         required: true
 *         type: number
 *     responses:
 *       200:
 *         description: Request was successful
 */
articles.get(
  '/:slug/claps/:userId',
  authenticate,
  Validator.validateClapsByUser(),
  Handler.handleValidation,
  ClapsController.getArticleClaps
);

export default articles;
