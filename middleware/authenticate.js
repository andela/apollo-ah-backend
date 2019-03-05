import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import { env } from '../helpers/utils';

/**
 * Verify user token
 * TOKEN FORMAT [Authorization: Bearer <access_token>]
 *
 * @export
 * @param {Request} request Request object
 * @param {Response} response Response object
 * @param {NextFunction} next call to next middleware
 * @returns {(Error|NextFunction)} Proceeds to the next middleware else throws http error
 */
function authenticate(request, response, next) {
  // Get auth header value
  const bearer = request.headers.authorization;
  if (!bearer) return next(createError(401, 'You are unauthorized to access the requested resource. Please log in.'));

  const token = bearer.split(' ')[1];

  return jwt.verify(token, env('APP_KEY'), async (err, decoded) => {
    if (err || !decoded) return next(createError(401, 'Authentication failure: Invalid access token.'));

    const { user } = decoded;
    request.user = user || decoded;
    return next();
  });
}

export default authenticate;
