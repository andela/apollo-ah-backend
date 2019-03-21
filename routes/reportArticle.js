import express from 'express';
import authenticate from '../middlewares/authenticate';
import { validateReportType, reportOnce, checkArticle } from '../middlewares/validateReport';
import reportArticleController from '../controllers/reportArticleController';

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
 * /api/v1/articles/:id/report:
 *   post:
 *     tags:
 *       - report article
 *     description: reports an article
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: Success
 *         schema:
 *           $ref: '#/definitions/Article'
 */

router.post('/:articleId/report',
  authenticate,
  checkArticle,
  validateReportType,
  reportOnce,
  reportArticleController.report);

/**
 * @swagger
 * /api/v1/articles/:id/report:
 *   get:
 *     tags:
 *       - report article
 *     description: get a reported article
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success
 *         schema:
 *           $ref: '#/definitions/Article'
 */
router.get('/:articleId/report',
  authenticate,
  checkArticle,
  reportArticleController.getOne);

/**
 * @swagger
 * /api/v1/articles//reports:
 *   get:
 *     tags:
 *       - report article
 *     description: get all reported article
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success
 *         schema:
 *           $ref: '#/definitions/Article'
 */

router.get('/reports',
  authenticate,
  checkArticle,
  reportArticleController.getAll);

export default router;
