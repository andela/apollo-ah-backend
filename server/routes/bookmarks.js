import express from 'express';
import articlesController from '../controllers/articlesController';
import articlesMiddleware from '../middlewares/articlesMiddleware';
import Validator from '../middlewares/validator';
import Handler from '../middlewares/handleValidation';
import middlewares from '../middlewares';

const bookmarkRouter = express.Router();

/**
 * @swagger
 * definitions:
 *   Bookmark:
 *     properties:
 *       userId:
 *         type: integer
 *       authorId:
 *         type: integer
 */

/**
 * @swagger
 * /api/v1/bookmarks:
 *   get:
 *     tags:
 *       - articles
 *     description: Fetch all bookmarked article specific to a user
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successful
 */
bookmarkRouter.get(
  '/',
  Validator.validateSearchParam(),
  Validator.validatePaginationLimit(),
  Handler.handleValidation,
  articlesMiddleware.validatePagination,
  middlewares.authenticate,
  articlesController.getBookmarkedArticles
);

export default bookmarkRouter;
