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
  static async likeComment(req, res) {
    const { slug, commentId } = req.params;
    const userId = req.user.id;

    try {
      const articleFound = await Article.findOne({ where: { slug } });
      if (!articleFound) return Response.send(res, NOT_FOUND, [], 'This article no longer exist', false);
      const commentFound = await Comment.findOne({ where: { id: commentId, } });
      if (!commentFound) return Response.send(res, NOT_FOUND, [], 'This comment does not exist', false);

      const likeFound = await CommentLike.findOne({ where: { commentId, userId } });

      if (likeFound && !likeFound.like) {
        await CommentLike.destroy({ where: { userId, commentId } });
        const likedComment = await CommentLike.create(
          { like: true, userId, commentId },
          { where: { commentId, userId } }
        );
        return Response.send(res, CREATED, likedComment, 'successfully liked comment', true);
      }

      if (likeFound && likeFound.like) {
        await CommentLike.destroy({ where: { commentId, userId } });
        return Response.send(res, OK, [], 'successfully removed like from comment', true);
      }

      const newLike = await CommentLike.create(
        { like: true, userId, commentId },
        { where: { commentId, userId } }
      );

      return Response.send(res, CREATED, newLike, 'successfully liked comment', true);
    } catch (error) {
      return Response.send(res, SERVER_ERROR, error.message, 'sorry! something went wrong', false);
    }
  }

  /**
   *
   * @description dislike a user's comment
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} - The disliked comment's object
   * @memberof CommentLikeController
   */
  static async dislikeComment(req, res) {
    const { slug, commentId } = req.params;
    const userId = req.user.id;

    try {
      const articleFound = await Article.findOne({ where: { slug } });
      if (!articleFound) return Response.send(res, NOT_FOUND, [], 'This article no longer exist', false);
      const commentFound = await Comment.findOne({ where: { id: commentId, } });
      if (!commentFound) return Response.send(res, NOT_FOUND, [], 'This comment does not exist', false);

      const likeFound = await CommentLike.findOne({ where: { commentId, userId, } });

      if (likeFound && likeFound.like) {
        await CommentLike.destroy({ where: { userId, commentId } });
        const dislike = await CommentLike.create(
          { like: false, userId, commentId },
          { where: { commentId, userId } }
        );
        return Response.send(res, CREATED, dislike, 'successfully disliked comment', true);
      }

      if (likeFound && !likeFound.like) {
        await CommentLike.destroy({ where: { commentId, userId } });
        return Response.send(res, OK, [], 'successfully removed dislike from comment', true);
      }

      const dislike = await CommentLike.create(
        { like: false, userId, commentId },
        { where: { commentId, userId } }
      );

      return Response.send(res, CREATED, dislike, 'successfully disliked comment', true);
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
        where: { commentId, like: true },
      });
      return Response.send(res, OK, commentLikes, 'likes successfully fetched', true);
    } catch (error) {
      return Response.send(res, SERVER_ERROR, error.message, 'something went wrong, try again later!', false);
    }
  }

  /**
* @description get all dislikes for a specific comment.
* @function getCommentDislikes
* @memberof CommentLikeController
* @static
* @param  {Object} req - The request object.
* @param  {Object} res - The response object.
* @returns {Object} - It returns the response object.
*/
  static async getCommentDislikes(req, res) {
    const { commentId } = req.params;
    try {
      const commentLikes = await CommentLike.findAll({
        where: { commentId, like: false },
      });
      return Response.send(res, OK, commentLikes, 'dislikes successfully fetched', true);
    } catch (error) {
      return Response.send(res, SERVER_ERROR, error.message, 'something went wrong, try again later!', false);
    }
  }
}
export default CommentLikeController;
