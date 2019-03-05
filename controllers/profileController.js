import models from '../models';

const { Profile } = models;
/** profile controller class */

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
    const {
      firstname,
      lastname,
      username,
      gender,
      bio,
      phone,
      address,
      image,
    } = req.body;

    /**id should be gotten from the token */
    const id = 1;

    try {
      const profile = await Profile.findOne({
        where: {
          user_id: id
        }
      });
      if (profile) {
        return res.status(201).json({
          message: 'Your profile has been created already, but you can always update it'
        })
      }

      console.log('-------------------------->');
      // const [ profile, success ]= await Profile.findOrCreate({
      //   where: {
      //     userhahaha: id,
      //   },
      //   defaults: req.body
      // });

      // return success
      //   ? res.status(201).json({
      //     message: 'Profile created successfully',
      //     profile,
      //   })
      //   : await Profile.update({
      //     firstname,
      //     lastname,
      //     username,
      //     gender,
      //     bio,
      //     phone,
      //     address,
      //     image,
      //   },
      //     {
      //       where: {
      //         userhhahah: id,
      //       }
      //     })
      //     ? res.status(201).json({
      //       message: 'Profile updated successfully',
      //     })
      //     : res.status(401).json({
      //       message: 'You are unauthorized to edit a profile that is not yours',
      //       profile,
      //     })
    } catch (error) {
      console.log(error)
      res.status(500).json({
        message: 'Profile update failed, try again later!',
        errors: error.message,
      });
    }
  }
}

export default ProfileController;
