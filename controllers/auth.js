import { generateToken } from '../helpers/utils';

/**
 * Class representing social authentication controller
 * @class socialAuthController
 * @returns {object}
 */
export default class authController {
  /**
   * Login or creates a new user
   * @static
   * @param {Request} req - Request object
   * @param {Response} res - Response object
   * @returns {object}
   */
  static async socialAuth(req, res) {
    const { dataValues } = req.user;
    try {
      const userToken = await generateToken({ email: dataValues.email, id: dataValues.id });
      const {
        id,
        email,
      } = dataValues;
      return res.status(200).json({
        user: {
          id,
          email,
          token: userToken,
        }
      });
    } catch (err) {
      next(err);
    }
  }
}
