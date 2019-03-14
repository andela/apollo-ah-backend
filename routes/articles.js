import express from 'express';
import articlesMiddleware from '../middlewares/articlesMiddleware';
import articlesController from '../controllers/articlesController';
import ArticleLikeController from '../controllers/articleLikesController';
import authenticate from '../middlewares/authenticate';

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
articles
  .post(
    '/articles',
    authenticate,
    articlesMiddleware.validateCreateArticleInput,
    articlesController.create
  )

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

  .post(
    '/articles/:slug/likes',
    authenticate,
    ArticleLikeController.like
  )

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
  .post(
    '/articles/:slug/dislikes',
    authenticate,
    ArticleLikeController.dislike
  );

export default articles;
