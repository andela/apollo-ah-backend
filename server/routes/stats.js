import express from 'express';
import authenticate from '../middlewares/authenticate';
import statsMiddleware from '../middlewares/statsMiddleware';
import statsController from '../controllers/statsController';

const comments = express.Router();
/**
 * @swagger
 * definitions:
 *   Stats:
 *     properties:
 *       bookmarked:
 *         type: integer
 *       liked:
 *         type: integer
 *       comments:
 *        type: integer
 *       articles:
 *         type: integer
 */

/**
 * @swagger
 * /api/v1/users/:id/stats:
 *   get:
 *     tags:
 *       - stats
 *     description: Provide statistics on user's activities
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: user's Id
 *         in: query
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully fetched
 *         schema:
 *           $ref: '#/definitions/Stats'
 */
comments.get(
  '/:id/stats',
  authenticate,
  statsMiddleware.getUserStats,
  statsController.sendUserStats
);

export default comments;
