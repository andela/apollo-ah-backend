import models from '../models';
import constants from '../helpers/constants';

const { Profile } = models;

const {
  CREATED,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
} = constants.statusCode;

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
        return res.status(CREATED).json({
          success: true,
          message: 'Profile created successfully',
          profile,
        });
      }

      await Profile.update(
        req.body,
        {
          where: {
            user_id: req.user.id,
          }
        }
      );

      return res.status(CREATED).json({
        success: true,
        message: 'Profile updated successfully',
        profile: requestForm,
      });
    } catch (error) {
      if (error.message === 'insert or update on table "profiles" violates foreign key constraint "profiles_user_id_fkey"') {
        return res.status(UNAUTHORIZED).json({
          success: false,
          message: 'You have to be signed up to create a profile',
        });
      }
      res.status(INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Profile update failed, try again later!',
        errors: error.message,
      });
    }
  }
}

export default ProfileController;
