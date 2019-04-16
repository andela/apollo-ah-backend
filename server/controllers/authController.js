import { generateToken, env } from '../helpers/utils';
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
      const token = await generateToken({ email: dataValues.email, id: dataValues.id });
      res.redirect(`${env('CLIENT_REDIRECT_URL')}?token=${token}`);
    } catch (err) {
      logger.log(err);
    }
  }
}
