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
      firstname, lastname, username, gender, bio, phone, address, image,
    } = req.body;

    firstname = firstname ? firstname.toLowerCase().toString().replace(/\s+/g, '') : firstname;
    lastname = lastname ? lastname.toLowerCase().toString().replace(/\s+/g, '') : lastname;
    username = username ? username.toLowerCase().toString().replace(/\s+/g, '') : username;
    gender = gender ? gender.toUpperCase().toString().replace(/\s+/g, '') : gender;
    bio = bio ? bio.toLowerCase().toString().replace(/\s+/g, ' ') : bio;
    phone = phone ? phone.toLowerCase().toString().replace(/\s+/g, '') : phone;
    address = address ? address.toLowerCase().toString().replace(/\s+/g, ' ') : address;
    image = image ? image.toLowerCase().toString().replace(/\s+/g, '') : image;

    const requestForm = {
      firstname, lastname, username, gender, bio, phone, address, image,
    };


    try {
      const [profile, success] = await Profile.findOrCreate({
        where: {
          user_id: req.user.id,
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
            user_id: req.user.id,
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
}

export default ProfileController;
