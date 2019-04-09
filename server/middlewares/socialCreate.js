import models from '../models';

/**
 * Register a new user with oAuthentication
 *
 * @export
 * @param {Request} request Request object
 * @param {Response} response Response object
 * @param {Function} next call to next middleware
 * @returns {Function} Proceeds to the next middleware else throws http error
 */
async function socialCreate(request, response, next) {
  const { firstname, lastname, email } = request.body;
  let user;
  try {
    user = await models.User.findOne({ where: { email } });
    if (!user) {
      user = await models.User.create({ email });
      const role = await models.Role.findOne({ where: { name: 'user' } });
      await user.setRole(role);
      await models.Profile.create({
        firstname,
        lastname,
        bio: '',
        gender: '',
        userId: user.id,
        username: email,
      });
    }
    request.user = user;
    return next();
  } catch (error) {
    next(error);
  }
}

export default socialCreate;
