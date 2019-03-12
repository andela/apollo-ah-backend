import { generateToken } from '../helpers/utils';
import logger from '../helpers/logger';

/**
 * Class representing social authentication controller
 * @class socialAuthController
 */
export default class authController {
  /**
   * Login or creates a new user
   * @static
   * @param {req} req - Request object
   * @param {res} res - Response object
   * @returns {object} - User object
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
      logger.log(err);
    }
  }
}
