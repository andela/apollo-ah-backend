import { urlRegex, phoneRegex } from '../helpers/regex';
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

const validateCreateProfile = (req, res, next) => {
  let {
    firstname, lastname, username, gender, bio, phone, image,
  } = req.body;

  firstname = firstname ? firstname.toLowerCase().toString().replace(/\s+/g, '') : firstname;
  lastname = lastname ? lastname.toLowerCase().toString().replace(/\s+/g, '') : lastname;
  username = username ? username.toLowerCase().toString().replace(/\s+/g, '') : username;
  gender = gender ? gender.toUpperCase().toString().replace(/\s+/g, '') : gender;
  bio = bio ? bio.toLowerCase().toString().replace(/\s+/g, ' ') : bio;
  phone = phone ? phone.toLowerCase().toString().replace(/\s+/g, '') : phone;
  image = image ? image.toLowerCase().toString().replace(/\s+/g, '') : image;

  const errors = {};

  if (!firstname) errors.firstname = 'Firstname is required';
  if (!lastname) errors.lastname = 'Lastname is required';
  if (!username) errors.username = 'username field cannot be emnpty';
  if (!gender) errors.gender = 'Gender is required';
  if (gender !== 'M' && gender !== 'F') errors.genderType = 'Gender must either be M or F';
  if (!bio) errors.bio = 'Please provide a brief description about yourself';
  if (bio.length > 255) errors.bio = 'Bio has reached it\'s maximum limit';
  if (phone && !phoneRegex.test(phone)) errors.phone = 'Phone number should have a country code and not contain alphabets e.g +234';
  if (phone && !phoneRegex.test(phone)) errors.phoneLength = 'Phone number length should adhere to international standard';
  if (image && !urlRegex.test(image)) errors.image = 'image URL is not valid';

  if (Object.getOwnPropertyNames(errors).length) {
    return res.status(400).json({
      status: 400,
      success: 'false',
      errors,
    });
  }

  return next();
};

export default validateCreateProfile;
