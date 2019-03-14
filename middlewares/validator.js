import { body } from 'express-validator/check';
import { MESSAGE, FIELD } from '../helpers/constants';
import UsersController from '../controllers/usersController';
import ProfileController from '../controllers/profileController';
/**
 * Used with express validator to validate input paramters
 * @export
 * @class Validator
 */
export default class Validator {
  /**
   * Validates registration/signup parameters
   * @static
   * @returns {array} The array of express validator chains
   * @memberof Validator
   */
  static validateRegistration() {
    return [
      ...Validator.validateEmail(),
      ...Validator.verifyEmail(),
      ...Validator.validatePassword(),
      ...Validator.validateUsername()
    ];
  }

  /**
   * Validates email when recovering password
   * @static
   * @returns {array} The array of express validator chains
   * @memberof Validator
   */
  static validateForgotPassword() {
    return [
      ...Validator.validateEmail(),
      [
        body(FIELD.EMAIL)
          .trim()
          .custom(async (email) => {
            if (!await UsersController.getUser('email', email)) {
              return Promise.reject(MESSAGE.EMAIL_NOT_EXISTS);
            }
          }),
      ]
    ];
  }

  /**
   * Validates password
   * @static
   * @returns {array} The array of express validator chains
   * @memberof Validator
   */
  static validatePassword() {
    return [
      body(FIELD.PASSWORD)
        .not().isEmpty()
        .withMessage(MESSAGE.PASSWORD_EMPTY)
        .isLength({ min: 8 })
        .withMessage(MESSAGE.PASSWORD_TOO_SHORT)
        .matches(/[a-z]/i)
        .withMessage(MESSAGE.PASSWORD_NOT_ALPHANUMERIC)
        .matches(/\d/)
        .withMessage(MESSAGE.PASSWORD_NOT_ALPHANUMERIC)
    ];
  }

  /**
   * Validates username
   * @static
   * @returns {array} The array of express validator chains
   * @memberof Validator
   */
  static validateUsername() {
    return [
      body(FIELD.USERNAME)
        .trim()
        .not().isEmpty()
        .withMessage(MESSAGE.USERNAME_EMPTY)
        .custom(async (username) => {
          if (await ProfileController.usernameExists(username.toLowerCase())) {
            return Promise.reject(MESSAGE.USERNAME_EXITS);
          }
        }),
    ];
  }

  /**
   * Validates email
   * @static
   * @returns {array} The array of express validator chains
   * @memberof Validator
   */
  static validateEmail() {
    return [
      body(FIELD.EMAIL)
        .trim()
        .not().isEmpty()
        .withMessage(MESSAGE.EMAIL_EMPTY)
        .isEmail()
        .withMessage(MESSAGE.EMAIL_INVALID),
    ];
  }

  /**
   * Verifies that the email exists
   * @static
   * @returns {array} The array of express validator chains
   * @memberof Validator
   */
  static verifyEmail() {
    return [
      body(FIELD.EMAIL)
        .trim()
        .custom(async (email) => {
          if (await UsersController.getUser('email', email)) {
            return Promise.reject(MESSAGE.EMAIL_EXISTS);
          }
        }),
    ];
  }

  /**
   * Verifies the input data for user settings
   * @static
   * @returns {array} The array of express validator chains
   * @memberof Validator
   */
  static validateSettings() {
    return [
      body('canEmail', 'A valid value is required').exists()
        .isBoolean(),
      body('canNotify', 'A valid value is required').exists()
        .isBoolean(),
    ];
  }
}
