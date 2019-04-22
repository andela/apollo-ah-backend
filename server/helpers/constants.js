export const PAGE_LIMIT = 500;
export const CLAPS_LIMIT = 100;

export const STATUS = {
  OK: 200, // Request OK, indicates a successful request
  CREATED: 201, // Resource Created, request is ok and new resource created. Use with POST requests
  NO_CONTENT: 204, // No Content, request is successful but returned a response without a body.
  BAD_REQUEST: 400, // Bad requests, requests parameter is missing
  UNATHORIZED: 401, // Unauthorized requests, request requires authentication but it isn't provided
  FORBIDDEN: 403, // Valid request, but the user doesn't have permissions to perform the action
  NOT_FOUND: 404, // Not found, when a resource can't be found to fulfill the request
  UNPROCESSED: 422, // Unprocssable entity, requests parameters contains invalid fields
  SERVER_ERROR: 500,
};

export const MESSAGE = {
  SERVER_ERROR: 'An internal error has occured. This is not your fault. We are working to fix this problem. Please try again later.',

  UNATHORIZED_ACCESS: 'You do not have permission to ',

  REGISTRATION_ERROR: 'Registration failed',
  REGISTRATION_SUCCESSFUL: 'Registraion successful',

  PASSWORD_TOO_SHORT: 'Your password must be at least 8 characters. Please try again.',
  PASSWORD_NOT_ALPHANUMERIC: 'Password should contain both letters and numbers',
  PASSWORD_EMPTY: 'Password is required',
  PASSWORD_NOT_MATCH: 'The password and confirm password fields do not match',
  CONFIRM_PASSWORD_EMPTY: 'Confirm password field is required',

  PASSWORD_REQUEST_FAILED: 'Password reset failed',
  PASSWORD_REQUEST_SUCCESSFUL: 'Your password reset link has been sent to your email',
  PASSWORD_RESET_SUCCESSFUL: 'Password reset successful',
  PASSWORD_LINK_EXPIRED: 'Your request to reset password has expired. Please try again',

  EMAIL_EMPTY: 'Email is required',
  EMAIL_INVALID: 'Provide a valid email address',
  EMAIL_EXISTS: 'The email address already exists. If you are registered, proceed to login instead',
  EMAIL_NOT_EXISTS: 'The email address is not registered. Please try again',

  FIRSTNAME_EMPTY: 'Firstname is required',
  FIRST_NOT_ALPHANUMERIC: 'Firstname should contain only alphabets',

  IMAGE_NOT_VALID: 'image URL is not valid',

  USERNAME_EMPTY: 'Username is required',
  USERNAME_EXITS: 'This username is already taken, try another one',
  USERNAME_NOT_ALPHANUMERIC: 'Username should contain only letters and numbers',

  ACCOUNT_CONFIRM: 'Your account has been successfully confirmed',

  LASTNAME_EMPTY: 'Lastname is required',
  LASTNAME_NOT_ALPHANUMERIC: 'Lastname should contain only alphabets',
  LOGIN_SUCCESSFUL: 'Login successful',


  WELCOME_MESSAGE: 'Welcome to Author Haven API',
  ROUTE_NOT_FOUND: 'Provided route is invalid.',

  FOLLOW_SUCCESS: 'Successfully followed',
  UNFOLLOW_SUCCESS: 'Successfully unfollowed',
  FOLLOW_ERROR: 'Sorry you cannot follow yourself',
  UNFOLLOW_ERROR: 'Sorry, cannot unfollow a user not being followed',

  INACTIVE_USER_ERROR: 'The user can no longer be reached.',

  ARTICLE_EXIST: 'You already have an article with that title, try another title.',
  ARTICLES_NOT_FOUND: 'No article found.',
  ARTICLES_FOUND: 'Articles successfully fetched',

  BIO_EMPTY: 'Bio is required',
  BIO_TOO_LONG: 'Bio must not exceed 255 characters',

  PAGE_LIMIT_EXCEEDED: `The maximum size for the page limit is ${PAGE_LIMIT}`,
  PAGE_LIMIT_INVALID: 'The page limit must be a number',
  PROFILE_UPDATE_SUCCESSFUL: 'Profile updated successfully',
  PROFILE_UPDATE_ERROR: 'Update was not successful',

  RESOURCE_NOT_FOUND: 'Resource not found',
  ACCESS_FORBIDDEN: 'Access is forbidden',
  INVALID_CREDENTIALS: 'Email or password is incorrect',

  CREATE_SUCCESS: 'Successfully created',
  UPDATE_SUCCESS: 'Successfully updated',
  CATEGORY_INVALID: 'Category must be a number',
  VALIDATE_ERROR: 'Validation error occurred',

  SUCCESS_MESSAGE: 'Operation was successful',
  NO_CLAPS_FOUND: 'No claps found'
};

export const TOKEN_VALIDITY = 604800; // 7 days

export const FIELD = {
  FIRSTNAME: 'firstname',
  LASTNAME: 'lastname',
  BIO: 'bio',
  IMAGE: 'image',
  USERNAME: 'username',
  PASSWORD: 'password',
  EMAIL: 'email',
  CONFIRM_PASSWORD: 'confirmPassword',
  PAGINATION_LIMIT: 'size',
};

/**
 * Callback function to format express validator object keys to use a more generic format.
 * To be used with express-validators validationResult function
 * @param {object} The expected object for express validator.
 * @returns {object} The desired format returned as an object
 */
export const expressValidatorFormater = ({
  param, msg
}) => ({
  field: param,
  message: msg,
});

export const DUMMY_USER = {
  email: 'fake_email_for_testing@authorshaven.test',
  password: 'secret123456789',
  username: 'dummy',
};
