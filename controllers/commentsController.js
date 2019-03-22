import models from '../models';
import Response from '../helpers/responseHelper';
import { STATUS } from '../helpers/constants';
import paginationHelper from '../helpers/articleHelpers';
import Logger from '../helpers/logger';

/**
 * Wrapper class for sending comments objects as response.
 *
 * @export
 * @class CommentsController
 */
export default class CommentsController {
  /**
   * This controller creates the comment.
   * It sends the request payload to the database
   * and returns the created comments object
   * @static
   * @param {function} req The request object
   * @param {fucntion} res The response object
   * @returns {function} The comment object
   */
  static async createComment(req, res) {
    const { articleId, authorId, isAnonymousUser } = res.locals;
    const { body } = req.body;

    const content = {
      articleId, authorId, body, isAnonymousUser,
    };

    try {
      const comment = await models.Comment.create(content);
      return Response.send(res, STATUS.CREATED, comment, 'comment successfully created', true);
    } catch (error) {
      return Response.send(res, STATUS.BAD_REQUEST, error, 'Server error', false);
    }
  }

  /**
   * Uses the articleId to query the database
   * and returns all comments for that particular article
   * @static
   * @param {function} req The request object
   * @param {fucntion} res The response object
   * @returns {function} The comment object
   */
  static async getAllComments(req, res) {
    const { articleId } = res.locals;
    const { offset, limit } = req.body;

    try {
      const comments = await models.Comment.findAndCountAll({
        where: { articleId },
        include: [
          {
            model: models.User,
            include: [{ model: models.Profile }],
            attributes: {
              exclude: [
                'isConfirmed',
                'createdAt',
                'updatedAt',
                'password',
                'deletedAt'
              ]
            },
            as: 'author'
          },
          {
            model: models.CommentHistory,
          }
        ],
        attributes: {},
        limit,
        offset,
        order: [['createdAt']]
      });
      const {
        code, data, status
      } = paginationHelper.getResourcesAsPages(req, comments);
      return Response.send(res, code, data, 'comments successfully fetched', status);
    } catch (error) {
      Logger.log(error);
      return Response.send(res, STATUS.BAD_REQUEST, error, 'Server error', false);
    }
  }

  /**
   * Updates a comment
   * Uses the articleId to query the database
   * and updates comments for that particular article
   * @static
   * @param {function} req The request object
   * @param {fucntion} res The response object
   * @returns {function} The comment object
   */
  static async updateComment(req, res) {
    const { articleId, authorId, isAnonymousUser } = res.locals;
    const { body } = req.body;
    const { id } = req.params;

    // here we get the commet to be updated and then we create a new comment history for it
    // with the previous comment then we update the comment data
    try {
      const oldCommentData = await models.Comment.findOne({
        where: { articleId, id, authorId },
        raw: true
      });
      const count = await models.CommentHistory.count({ where: { commentId: id } });
      // limiting the comment history to 5
      if (count < 5) {
        const oldMessage = oldCommentData.body;
        await models.CommentHistory.create({ body: oldMessage, commentId: id });
      } else {
        return Response.send(res, STATUS.BAD_REQUEST, null, 'You can only edit a comment 5 times', false);
      }
    } catch (e) {
      Logger.log(e);
      return Response.send(res, STATUS.BAD_REQUEST, null, 'Server error', false);
    }
    try {
      const comment = await models.Comment.update({ body: body.trim(), isAnonymousUser }, {
        where: { articleId, id, authorId },
        fields: ['body', 'isAnonymousUser'],
        returning: true,
        paranoid: true,
      });
      return Response.send(res, STATUS.CREATED, comment[1], 'comment successfully updated', true);
    } catch (error) {
      return Response.send(res, STATUS.BAD_REQUEST, error, 'Server error', false);
    }
  }

  /**
 * Queries the database with the comment's ID
 * and deletes the corresponding comment object
 * @static
 * @param {function} req the request object
 * @param {function} res the resposne object
 * @returns {function} the deleted comment object
 */
  static async deleteComment(req, res) {
    const { id } = req.params;
    const authorId = req.user.id;
    const { comment: commentObj } = res.locals;

    try {
      const comment = await models.Comment.destroy({ where: { id, authorId } });
      if (comment) return Response.send(res, STATUS.OK, commentObj, 'comment was successfully deleted', true);
    } catch (error) {
      return Response.send(res, STATUS.BAD_REQUEST, error, 'Server error', false);
    }
  }
}
