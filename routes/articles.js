import express from 'express';
import articlesMiddleware from '../middlewares/articlesMiddleware';
import articlesController from '../controllers/articlesController';
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
  // .get('/', (req, res) => res.send({ message: 'We can get multiple articles' }))
  .post(
    '/',
    authenticate,
    articlesMiddleware.validateCreateArticleInput,
    articlesController.create
  );

export default articles;
