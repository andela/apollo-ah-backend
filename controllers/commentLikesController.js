import models from '../models';
import { STATUS } from '../helpers/constants';
import Response from '../helpers/responseHelper';

const {
  CommentLike, Comment, Article,
} = models;

const {
  CREATED,
  SERVER_ERROR,
  NOT_FOUND,
  OK,
} = STATUS;

/** CommentLike controller class */
/**
 *@description Handles like feature.
 *
 * @class CommentLikeController
 */
class CommentLikeController {
  /**
    * @description Like a user's comment.
    * @function like
    * @memberof CommentLikeController
    * @static
    * @param  {Object} req - The request object.
    * @param  {Object} res - The response object.
    * @returns {Object} - It returns the response object.
    */
  static async like(req, res) {
    const { slug, commentId } = req.params;
    const userId = req.user.id;

    try {
      const articleFound = await Article.findOne({
        where: {
          slug
        }
      });
      if (!articleFound) {
        return Response.send(res, NOT_FOUND, [], 'This article no longer exist', false);
      }
      const commentFound = await Comment.findOne({
        where: {
          id: commentId,
        }
      });
      if (!commentFound) {
        return Response.send(res, NOT_FOUND, [], 'This comment does not exist', false);
      }

      const likeFound = await CommentLike.findOne({
        where: {
          commentId,
          userId
        }
      });

      if (likeFound) {
        await CommentLike.destroy(
          {
            where: {
              commentId,
              userId
            }
          }
        );
        return Response.send(res, OK, [], 'successfully unliked comment', true);
      }
      const newLike = await CommentLike.create(
        { userId, commentId },
        {
          where: {
            commentId,
            userId
          }
        }
      );

      return Response.send(res, CREATED, newLike, 'successfully liked comment', true);
    } catch (error) {
      return Response.send(res, SERVER_ERROR, error.message, 'sorry! something went wrong', false);
    }
  }

  /**
  * @description get all likes for a specific comment.
  * @function getCommentLikes
  * @memberof CommentLikeController
  * @static
  * @param  {Object} req - The request object.
  * @param  {Object} res - The response object.
  * @returns {Object} - It returns the response object.
  */
  static async getCommentLikes(req, res) {
    const { commentId } = req.params;
    try {
      const commentLikes = await CommentLike.findAll({
        where: { commentId },
      });
      return Response.send(res, OK, commentLikes, 'likes successfully fetched', true);
    } catch (error) {
      return Response.send(res, SERVER_ERROR, error.message, 'something went wrong, try again later!', false);
    }
  }
}
export default CommentLikeController;
