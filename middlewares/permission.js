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
  const isAllowed = role => (allowedRoles.indexOf(role) > -1);
  const allowedRight = allowedRoles.find(access => access.indexOf('access') > -1);

  return async (request, response, next) => {
    const { user } = request;
    const userRole = await models.Role.findOne({
      where: { id: user.roleId },
      raw: true
    });

    if (user && (isAllowed(userRole.title))) {
      return next(); // role is allowed, continue to next middleware
    }

    // validate access right ex. access:right
    if (userRole && allowedRight) {
      const [, accessRight] = allowedRight.split(':');
      if (userRole[accessRight]) return next(); // access is allowed, continue
    }
    return next(createError(STATUS.FORBIDDEN, MESSAGE.ACCESS_FORBIDDEN));
  };
}

export default permit;
