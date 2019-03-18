import express from 'express';
import authenticate from '../middlewares/authenticate';
import articleRatings from '../controllers/articleRatingController';
import { validateRatings, checkArticle } from '../middlewares/ratings';

const router = express.Router();
/**
 * @swagger
 * definitions:
 *   Article:
 *     properties:
 *       id:
 *         type: int
 *       token:
 *         type: string
 *       title:
 *         type: string
 *       body:
 *        type: string
 *   Response:
 *     properties:
 *       code:
 *         type: int
 *       data:
 *         type: object
 *     message:
 *       type: string
 *     status:
 *       type: boolean
 *
 */

/**
 * @swagger
 * /api/v1/articles/:id/ratings:
 *   post:
 *     tags:
 *       - article ratings
 *     description: rating an article
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success
 *         schema:
 *           $ref: '#/definitions/Article'
 */

router.post('/:articleId/ratings',
  authenticate,
  checkArticle,
  validateRatings,
  articleRatings.create);

/**
 * @swagger
 * /api/v1/articles/:id/ratings:
 *   get:
 *     tags:
 *       - article ratings
 *     description: get a rated article
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success
 *         schema:
 *           $ref: '#/definitions/Article'
 */
router.get('/:articleId/ratings',
  checkArticle,
  articleRatings.get);

export default router;
