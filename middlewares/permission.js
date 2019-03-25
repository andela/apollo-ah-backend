import createError from 'http-errors';
import models from '../models';
import { STATUS, MESSAGE } from '../helpers/constants';

/**
 * Validate role access
 *
 * @param {Request} request Request object
 * @param {Response} response Response object
 * @param {Function} next call to next middleware
 * @returns {(Error|Function)} Proceeds to the next middleware else throws http error
 */
function permit(...allowedRoles) {
  return async (request, response, next) => {
    const { user } = request;
    if (user) {
      const authUser = await models.User.findByPk(user.id);
      const userRoles = await authUser.getRole({ raw: true });
      const permitUser = userRoles.some(role => allowedRoles.indexOf(role.name) >= 0);

      if (permitUser) {
        return next(); // role is allowed, continue to next middleware
      }
    }

    return next(createError(STATUS.FORBIDDEN, MESSAGE.ACCESS_FORBIDDEN));
  };
}

export default permit;
