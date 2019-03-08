import models from '../models';
import constants from '../helpers/constants';

const { Profile } = models;

const {
  CREATED,
  INTERNAL_SERVER_ERROR,
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

    try {
      const [profile, success] = await Profile.findOrCreate({
        where: {
          user_id: req.user.id,
        },
        defaults: req.body
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
        profile: req.body,
      });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Profile update failed, try again later!',
        errors: error.message,
      });
    }
  }
}

export default ProfileController;
