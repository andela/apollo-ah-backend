import { urlRegex } from '../helpers/regex';
import { STATUS } from '../helpers/constants';
import Response from '../helpers/responseHelper';

/**
 * This is a validation for creating a profile
 * @constant
 *
 * @param {String} req request object
 * @param {Object} res response object
 * @param {Object} err error object
 *
 * @returns {Object}
 *
 * @exports validateCreateProfile
 */

const { BAD_REQUEST } = STATUS;
const validateCreateProfile = (req, res, next) => {
  let {
    firstname, lastname, username, bio, image,
  } = req.body;

  firstname = firstname ? firstname.toLowerCase().toString().replace(/\s+/g, '') : firstname;
  lastname = lastname ? lastname.toLowerCase().toString().replace(/\s+/g, '') : lastname;
  username = username ? username.toLowerCase().toString().replace(/\s+/g, '') : username;
  bio = bio ? bio.toLowerCase().toString().replace(/\s+/g, ' ') : bio;
  image = image ? image.toLowerCase().toString().replace(/\s+/g, '') : image;

  const errors = {};

  if (!firstname) errors.firstname = 'Firstname is required';
  if (!lastname) errors.lastname = 'Lastname is required';
  if (!username) errors.username = 'username field cannot be emnpty';
  if (!bio) errors.bio = 'Please provide a brief description about yourself';
  if (bio.length > 255) errors.bio = 'Bio must not exceed 255 characters';
  if (image && !urlRegex.test(image)) errors.image = 'image URL is not valid';

  if (Object.getOwnPropertyNames(errors).length) {
    return Response.send(res, BAD_REQUEST, [{ errors }], '', false);
  }

  return next();
};

export default validateCreateProfile;
