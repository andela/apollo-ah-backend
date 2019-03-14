import createError from 'http-errors';
import models from '../models';
import Response from '../helpers/responseHelper';
import { MESSAGE } from '../helpers/constants';

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
    const { params: { username } } = request;

    try {
      const { followable, follower } = await FollowersController.validateFollowable(request);
      await followable.addFollower(follower);
      return Response.send(response, 200, [], `${MESSAGE.FOLLOW_SUCCESS} ${username}`);
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
    const { params: { username } } = request;

    try {
      const { followable, follower } = await FollowersController.validateFollowable(request);
      const existingFollower = await followable.hasFollowers(follower);
      if (!existingFollower) {
        next(createError(400, MESSAGE.UNFOLLOW_ERROR));
      }

      await followable.removeFollower(follower);
      return Response.send(response, 200, [], `${MESSAGE.UNFOLLOW_SUCCESS} ${username}`);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Validate users to follow
   *
   * @static
   * @param {object} request - Express Request object
   * @returns {object} Object holding the information of the followable and follower
   * @memberof FollowersController
   */
  static async validateFollowable(request) {
    const { user, params: { username } } = request;

    try {
      const follower = await models.User.findOne({
        where: { id: user.id }
      });
      const profile = await models.Profile.findOne({ where: { username } });
      if (follower.id === profile.userId) {
        throw createError(400, MESSAGE.FOLLOW_ERROR);
      }

      const followable = await profile.getUser();
      if (followable.deletedAt !== null) {
        throw createError(404, MESSAGE.FOLLOW_ERROR);
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

      if (routePath === 'followers') {
        followers = await authUser.getFollowers();
      } else {
        followers = await authUser.getFollowing();
      }

      return Response.send(response, 400, followers);
    } catch (error) {
      next(error);
    }
  }
}

export default FollowersController;
