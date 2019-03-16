import createError from 'http-errors';
import models from '../models';
import { STATUS } from '../helpers/constants';
import Response from '../helpers/responseHelper';
import Logger from '../helpers/logger';

const { Profile } = models;

const {
  CREATED,
  SERVER_ERROR,
  UNAUTHORIZED,
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
  static async create(req, res) {
    /** id should be gotten from the token */
    let {
      firstname, lastname, username, bio, image,
    } = req.body;

    firstname = firstname ? firstname.toLowerCase().toString().replace(/\s+/g, '') : firstname;
    lastname = lastname ? lastname.toLowerCase().toString().replace(/\s+/g, '') : lastname;
    username = username ? username.toLowerCase().toString().replace(/\s+/g, '') : username;
    bio = bio ? bio.toLowerCase().toString().replace(/\s+/g, ' ') : bio;
    image = image ? image.toLowerCase().toString().replace(/\s+/g, '') : image;

    const requestForm = {
      firstname, lastname, username, bio, image,
    };


    try {
      const [profile, success] = await Profile.findOrCreate({
        where: {
          userId: req.user.id,
        },
        defaults: requestForm,
      });

      if (success) {
        return Response.send(res, CREATED, profile, 'Profile created successfully', true);
      }

      await Profile.update(
        req.body,
        {
          where: {
            userId: req.user.id,
          }
        }
      );

      return Response.send(res, CREATED, requestForm, 'Profile updated successfully', true);
    } catch (error) {
      if (error.message === 'insert or update on table "profiles" violates foreign key constraint "profiles_user_id_fkey"') {
        return Response.send(res, UNAUTHORIZED, [], 'You have to be signed up to create a profile', false);
      }
      return Response.send(res, SERVER_ERROR, error.message, 'Profile update failed, try again later!', false);
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
   * User followers handler
   *
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
