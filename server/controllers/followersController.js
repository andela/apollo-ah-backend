import createError from 'http-errors';
import models from '../models';
import Response from '../helpers/responseHelper';
import { STATUS, MESSAGE } from '../helpers/constants';

/**
 * Class handling followers operation
 *
 * @class FollowersController
 */
class FollowersController {
  /**
   * User followers handler
   *
   * @static
   * @param {object} request - Express Request object
   * @param {object} response - Express Response object
   * @returns {object} Response object
   * @param {Function} next - Express NextFunction
   * @memberof FollowersController
   */
  static async follow(request, response, next) {
    const { user } = request;
    const { profile: { username } } = response.locals;

    try {
      const { followable, follower } = await FollowersController.validateFollowable(user, username);
      await followable.addFollower(follower);
      return Response.send(
        response,
        STATUS.OK,
        followable,
        `${MESSAGE.FOLLOW_SUCCESS} ${username}`
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * User unfollow handler
   *
   * @static
   * @param {object} request - Express Request object
   * @param {object} response - Express Response object
   * @returns {object} Response object
   * @param {Function} next - Express NextFunction
   * @memberof FollowersController
   */
  static async unfollow(request, response, next) {
    const { user } = request;
    const { profile: { username } } = response.locals;

    try {
      const { followable, follower } = await FollowersController.validateFollowable(user, username);
      const existingFollower = await followable.hasFollowers(follower);
      if (!existingFollower) {
        next(createError(STATUS.BAD_REQUEST, MESSAGE.UNFOLLOW_ERROR));
      }

      await followable.removeFollower(follower);
      return Response.send(
        response,
        STATUS.OK,
        followable,
        `${MESSAGE.UNFOLLOW_SUCCESS} ${username}`
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Validate users to follow
   *
   * @static
   * @param {object} user - Authenticated user object
   * @param {object} username - Username of the user to follow
   * @returns {object} Object holding the information of the followable and follower
   * @memberof FollowersController
   */
  static async validateFollowable(user, username) {
    try {
      const follower = await models.User.findOne({
        where: { id: user.id },
        attributes: ['id', 'email']
      });
      const profile = await models.Profile.findOne({ where: { username } });
      if (follower.id === profile.userId) {
        throw createError(STATUS.BAD_REQUEST, MESSAGE.FOLLOW_ERROR);
      }

      const followable = await profile.getUser({ attributes: ['id', 'email', 'deletedAt'] });
      if (followable.deletedAt !== null) {
        throw createError(STATUS.NOT_FOUND, MESSAGE.INACTIVE_ACCOUNT);
      }

      return { followable, follower };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Fetch user followers (handler)
   *
   * @static
   * @param {object} request - Express Request object
   * @param {object} response - Express Response object
   * @returns {object} Response object
   * @param {Function} next - Express NextFunction
   * @memberof FollowersController
   */
  static async followers(request, response, next) {
    const { user } = request;
    const routePath = request.path.split('/')[2];
    let followers;

    try {
      const authUser = await models.User.findOne({
        where: { id: user.id }
      });

      const queryOptions = {
        attributes: ['id', 'email'],
        include: [{
          model: models.Profile,
          attributes: ['firstname', 'lastname', 'username']
        }],
        joinTableAttributes: [],
      };
      if (routePath === 'followers') {
        followers = await authUser.getFollowers(queryOptions);
      } else {
        followers = await authUser.getFollowing(queryOptions);
      }

      return Response.send(response, STATUS.OK, followers);
    } catch (error) {
      next(error);
    }
  }
}

export default FollowersController;
