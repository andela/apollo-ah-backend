import models from '../models';
import { STATUS } from '../helpers/constants';
import Response from '../helpers/responseHelper';

const { ArticleLike, Article } = models;

const {
  CREATED,
  SERVER_ERROR,
  NOT_FOUND,
  OK,
} = STATUS;

/** ArticleLike controller class */
/**
 *@description Handles like and dislike features.
 *
 * @class ArticleLikeController
 */
class ArticleLikeController {
  /**
    * @description Like a user's article.
    * @function like
    * @memberof ArticleLikeController
    * @static
    * @param  {Object} req - The request object.
    * @param  {Object} res - The response object.
    * @returns {Object} - It returns the response object.
    */
  static async like(req, res) {
    const { slug } = req.params;
    const userId = req.user.id;
    let articleId;

    try {
      const articleFound = await Article.findOne({
        where: {
          slug
        }
      });
      if (!articleFound) {
        return Response.send(res, NOT_FOUND, [], 'This article no longer exist', false);
      }
      articleId = articleFound.id;
      const likeFound = await ArticleLike.findOne({
        where: {
          articleId,
          userId
        }
      });

      if (likeFound && likeFound.like === true) {
        await ArticleLike.destroy(
          {
            where: {
              articleId,
              userId
            }
          }
        );
        return Response.send(res, OK, [], 'successfully unliked article', true);
      }

      if (likeFound && likeFound.like === false) {
        const updatedLike = await ArticleLike.update(
          { like: true, userId, articleId },
          {
            where: {
              articleId,
              userId
            }
          }
        );
        return Response.send(res, OK, updatedLike, 'successfully liked article', true);
      }
      const newLike = await ArticleLike.create(
        { like: true, userId, articleId },
        {
          where: {
            articleId,
            userId
          }
        }
      );

      return Response.send(res, CREATED, newLike, 'successfully liked article', true);
    } catch (error) {
      return Response.send(res, SERVER_ERROR, error.message, 'sorry! something went wrong', false);
    }
  }

  /**
    * @description dislike a user's article.
    * @function dislike
    * @memberof ArticleLikeController
    * @static
    * @param  {Object} req - The request object.
    * @param  {Object} res - The response object.
    * @returns {Object} - It returns the response object.
    */
  static async dislike(req, res) {
    const { slug } = req.params;
    const userId = req.user.id;
    let articleId;

    try {
      const articleFound = await Article.findOne({
        where: {
          slug
        }
      });
      if (!articleFound) {
        return Response.send(res, NOT_FOUND, [], 'This article no longer exist', false);
      }
      articleId = articleFound.id;
      const likeFound = await ArticleLike.findOne({
        where: {
          articleId,
          userId
        }
      });

      if (likeFound && likeFound.like === true) {
        const updatedDisLike = await ArticleLike.update(
          { like: false, userId, articleId },
          {
            where: {
              articleId,
              userId
            }
          }
        );
        return Response.send(res, OK, updatedDisLike, 'successfully disliked article', true);
      }

      if (likeFound && likeFound.like === false) {
        await ArticleLike.destroy(
          {
            where: {
              articleId,
              userId
            }
          }
        );
        return Response.send(res, OK, [], 'successfully un-disliked article', true);
      }

      const newDislike = await ArticleLike.create(
        { like: false, userId, articleId },
        {
          where: {
            articleId,
            userId
          }
        }
      );

      return Response.send(res, CREATED, newDislike, 'successfully disliked article', true);
    } catch (error) {
      return Response.send(res, SERVER_ERROR, error.message, 'sorry! something went wrong', false);
    }
  }
}

export default ArticleLikeController;
