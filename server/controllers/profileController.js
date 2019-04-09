import Sequelize from 'sequelize';
import createError from 'http-errors';
import models from '../models';
import { STATUS, MESSAGE } from '../helpers/constants';
import Response from '../helpers/responseHelper';
import Logger from '../helpers/logger';

const { Op } = Sequelize;

const { Profile, User } = models;

const {
  CREATED,
  SERVER_ERROR,
  OK,
  NOT_FOUND,
  FORBIDDEN,
} = STATUS;

/** profile controller class */
/**
 *@description Handles profile features.
 *
 * @class ProfileController
 */
class ProfileController {
  /**
  * @description It creates the user's profile.
  * @function create
  * @memberof profileController
  * @static
  * @param  {Object} req - The request object.
  * @param  {Object} res - The response object.
  * @returns {Object} - It returns the response object.
  */
  static async updateProfile(req, res) {
    const {
      firstname, lastname, username, bio, image,
    } = req.body;
    const userId = req.user.id;
    const requestForm = {
      firstname, lastname, username, bio, image,
    };
    const profileExists = await ProfileController.profileUsernameExists(username, userId);
    if (profileExists !== null) {
      return Response.send(res, FORBIDDEN, {}, MESSAGE.USERNAME_EXITS, true);
    }
    try {
      await Profile.update(
        req.body,
        {
          where: {
            userId,
          }
        }
      );
      return Response.send(res, CREATED, requestForm, MESSAGE.PROFILE_UPDATE_SUCCESSFUL, true);
    } catch (error) {
      return Response.send(res, SERVER_ERROR, error.message, MESSAGE.PROFILE_UPDATE_ERROR, false);
    }
  }

  /**
 * Verifies if the username already exists
 *
 * @static
 * @param {string} username The username
 * @returns {boolean} true if username exists and false otherwise
 * @memberof ProfileController
 */
  static async usernameExists(username) {
    let user = null;
    try {
      user = await Profile.findOne({ where: { username } });
    } catch (error) {
      Logger.log(error);
    }
    return user !== null;
  }

  /**
* Verifies if the username already exists and belongs to user
*
* @static
* @param {string} username The username
* @param {integer} userId The user Id
* @returns {boolean} true if username exists and false otherwise
* @memberof ProfileController
*/
  static async profileUsernameExists(username, userId) {
    let user = null;
    try {
      user = await Profile.findOne({
        where: {
          username,
          userId: {
            [Op.ne]: userId
          }
        }
      });
    } catch (error) {
      Logger.log(error);
    }
    return user;
    // return user !== null;
  }

  /**
  * @description It gets all user's profile.
  * @function getAllProfile
  * @memberof profileController
  * @static
  * @param  {Object} req - The request object.
  * @param  {Object} res - The response object.
  * @returns {Object} - It returns the response object.
  */
  static async getAllProfiles(req, res) {
    try {
      const profiles = await Profile.findAll({
        include: [{
          model: User,
          attributes: { exclude: ['password'] },
          required: false,
        }]
      });
      return Response.send(res, OK, profiles, 'You have successfully fetched the profile for all users', true);
    } catch (error) {
      return Response.send(res, SERVER_ERROR, error.message, 'something went wrong, try again later!', false);
    }
  }

  /**
  *  User followers handler
  * @static
  * @param {object} request - Express Request object
  * @param {object} response - Express Response object
  * @returns {object} Response object
  * @param {Function} next - Express NextFunction
  * @memberof ProfileController
  */
  static async follow(request, response, next) {
    const { params: { username } } = request;

    try {
      const { followable, follower } = await ProfileController.validateFollowable(request);
      await followable.addFollower(follower);

      return Response.send(response, 400, [], `Successfully followed ${username}`);
    } catch (error) {
      next(error);
    }
  }

  /**
  * @description It gets a specific user's profile.
  * @function getProfile
  * @memberof profileController
  * @static
  * @param  {Object} req - The request object.
  * @param  {Object} res - The response object.
  * @returns {Object} - It returns the response object.
  */
  static async getProfile(req, res) {
    const { username } = req.params;
    try {
      const profile = await Profile.findOne({
        where: { username },
        include: [{
          model: User,
          attributes: { exclude: ['password'] },
          required: false,
        }]
      });
      if (profile === null) {
        return Response.send(res, NOT_FOUND, {}, 'This user does not exist', false);
      }
      return Response.send(res, OK, profile, 'Successfully returned a user', true);
    } catch (error) {
      return Response.send(res, SERVER_ERROR, error.message, 'something went wrong, try again later!', false);
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
   * @memberof ProfileController
   */
  static async unfollow(request, response, next) {
    const { params: { username } } = request;

    try {
      const { followable, follower } = await ProfileController.validateFollowable(request);
      await followable.removeFollower(follower);
      return Response.send(response, 400, [], `Successfully unfollowed ${username}`);
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
   * @memberof ProfileController
   */
  static async validateFollowable(request) {
    const { user, params: { username } } = request;

    try {
      const follower = await models.User.findOne({
        where: { id: user.id }
      });
      const profile = await models.Profile.findOne({ where: { username } });
      if (follower.id === profile.userId) {
        throw createError(400, 'Sorry you cannot follow yourself');
      }

      const followable = await profile.getUser();
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
   * @memberof ProfileController
   */
  static async followers(request, response, next) {
    const { user } = request;

    try {
      const authUser = await models.User.findOne({
        where: { id: user.id }
      });

      const followers = await authUser.getFollowers();

      return Response.send(response, 400, followers);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Fetch user following (handler)
   *
   * @static
   * @param {object} request - Express Request object
   * @param {object} response - Express Response object
   * @returns {object} Response object
   * @param {Function} next - Express NextFunction
   * @memberof ProfileController
   */
  static async following(request, response, next) {
    const { user } = request;

    try {
      const authUser = await models.User.findOne({
        where: { id: user.id }
      });

      const following = await authUser.getFollowing();

      return Response.send(response, 400, following);
    } catch (error) {
      next(error);
    }
  }
}

export default ProfileController;
