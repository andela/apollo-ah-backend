import models from '../models';
import { STATUS } from '../helpers/constants';
import Response from '../helpers/responseHelper';
import Logger from '../helpers/logger';

const { Profile } = models;

const {
  CREATED,
  SERVER_ERROR,
  UNAUTHORIZED,
  BAD_REQUEST,
  OK,
  NOT_FOUND,
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
      if (error.errors[0].type === 'unique violation') {
        return Response.send(res, BAD_REQUEST, [], 'This username already exist', false);
      }
      if (error.message === 'insert or update on table "profiles" violates foreign key constraint "profiles_userId_fkey"') {
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
  * @description It creates the user's profile.
  * @function getAllProfile
  * @memberof profileController
  * @static
  * @param  {Object} req - The request object.
  * @param  {Object} res - The response object.
  * @returns {Object} - It returns the response object.
  */
  static async getAllProfiles(req, res) {
    try {
      const profiles = await Profile.findAll();
      return Response.send(res, OK, profiles, 'You have successfully fetched the profile for all users', true);
    } catch (error) {
      return Response.send(res, SERVER_ERROR, error.message, 'something went wrong, try again later!', false);
    }
  }

  /**
  * @description It creates the user's profile.
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
        where: { username }
      });
      if (profile === null) {
        return Response.send(res, NOT_FOUND, {}, 'This user does not exist', false);
      }
      return Response.send(res, OK, profile, 'Successfully returned a user', true);
    } catch (error) {
      return Response.send(res, SERVER_ERROR, error.message, 'something went wrong, try again later!', false);
    }
  }
}

export default ProfileController;
