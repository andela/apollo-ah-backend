import express from 'express';
import authenticate from '../middlewares/authenticate';
import commentsMiddleware from '../middlewares/commentsMiddleware';
import commentsController from '../controllers/commentsController';
import Validator from '../middlewares/validator';
import Handler from '../middlewares/handleValidation';
import commentPagination from '../middlewares/articlesMiddleware';
import commentLikeController from '../controllers/commentLikesController';

const comments = express.Router();
/**
 * @swagger
 * definitions:
 *   Comments:
 *     properties:
 *       user:
 *         type: string
 *       body:
 *         type: string
 *       id:
 *        type: integer
 *       articleId:
 *         type: integer
 *       authorId:
 *         type: integer
 */

/**
 * @swagger
 * /api/v1/articles/:slug/comments:
 *   post:
 *     tags:
 *       - comments
 *     description: Creates a single comment
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: slug
 *         description: slug for the article
 *         in: query
 *         required: true
 *         type: string
 *       - name: body
 *         description: body of the comment
 *         in: body
 *         required: true
 *         type: string
 *       - name: user
 *         description: user identity
 *         in: body
 *         required: false
 *         type: string
 *     responses:
 *       201:
 *         description: Successfully created
 *         schema:
 *           $ref: '#/definitions/Comments'
 */
comments.post('/:slug/comments/', authenticate, commentsMiddleware.validateCreateCommentInput, commentsController.createComment);

/**
 * @swagger
 * /api/v1/articles/:slug/comments:
 *   get:
 *     tags:
 *       - comments
 *     description: Returns all comments
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: slug
 *         description: slug for the article commented on
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: comments successfully fetched
 *         schema:
 *           $ref: '#/definitions/Comments'
 */
comments.get('/:slug/comments/', Validator.validatePaginationLimit(), Handler.handleValidation, commentPagination.validatePagination, commentsMiddleware.validateGetAllComments, commentsController.getAllComments);

/**
 * @swagger
 * /api/v1/articles/:slug/comments:
 *   put:
 *     tags:
 *       - comments
 *     description: Updates a single comment
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: slug
 *         description: slug for the article
 *         in: query
 *         required: true
 *         type: string
 *       - name: id
 *         description: id for the comment
 *         in: query
 *         required: true
 *         type: string
 *       - name: body
 *         description: body of the comment
 *         in: body
 *         required: true
 *         type: string
 *       - name: user
 *         description: user identity
 *         in: body
 *         required: false
 *         type: string
 *     responses:
 *       201:
 *         description: comment successfully updated
 *         schema:
 *           $ref: '#/definitions/Comments'
 */
comments.put('/:slug/comments/:id', authenticate, commentsMiddleware.validateUpdateComment, commentsController.updateComment);

/**
 * @swagger
 * /api/v1/articles/:slug/comments:
 *   delete:
 *     tags:
 *       - comments
 *     description: deletes a single comment
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: slug
 *         description: slug for the article
 *         in: query
 *         required: true
 *         type: string
 *       - name: id
 *         description: id for the comment
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: comment was successfully deleted
 *         schema:
 *           $ref: '#/definitions/Comments'
 */
comments.delete('/:slug/comments/:id', authenticate, commentsMiddleware.validateDeleteComment, commentsController.deleteComment);

/**
 * @swagger
 * /api/v1/articles/:slug/comments/:commentId/likes:
 *   post:
 *     tags:
 *       - comments
 *     description: Adds a new like to a comment
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: slug
 *         description: slug for the article
 *         in: query
 *         required: true
 *         type: string
 *       - name: commentId
 *         description: id for the comment
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       201:
 *         description: successfully liked comment
 *         schema:
 *           $ref: '#/definitions/Comments'
 */
comments.post(
  '/:slug/comments/:commentId/likes',
  authenticate,
  commentLikeController.like,
);

/**
 * @swagger
 * /api/v1/articles/:slug/comments/:commentId/likes:
 *   get:
 *     tags:
 *       - comments
 *     description: Returns all likes
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: slug
 *         description: slug for the article
 *         in: query
 *         required: true
 *         type: string
 *       - name: commentId
 *         description: id for the comment
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: likes successfully fetched
 *         schema:
 *           $ref: '#/definitions/Comments'
 */

comments.get(
  '/:slug/comments/:commentId/likes',
  authenticate,
  commentLikeController.getCommentLikes,
);

export default comments;
