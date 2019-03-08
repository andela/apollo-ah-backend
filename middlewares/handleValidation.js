import { validationResult } from 'express-validator/check';
import { STATUS, MESSAGE, expressValidatorFormater } from '../helpers/constants';
import Response from '../helpers/responseHelper';
/**
   * Validates the registration parameters
   *
   * @param {object} request The request object
   * @param {object} response The response object
   * @param {function} next The next function to transfer control to the next middleware
   * @returns {void}
   */
export const handleRegistration = (request, response, next) => {
  const errors = validationResult(request).formatWith(expressValidatorFormater);
  if (!errors.isEmpty()) {
    return Response.send(
      response,
      STATUS.BAD_REQUEST,
      errors.array({ onlyFirstError: true }),
      MESSAGE.REGISTRATION_ERROR,
      false,
    );
  }
  next();
};

export default {};
