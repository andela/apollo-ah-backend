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

  USERNAME_EMPTY: 'Username is required',
  USERNAME_EXITS: 'The username is already taken, try another one',
  USERNAME_NOT_ALPHANUMERIC: 'Username should contain only letters and numbers',

  ACCOUNT_CONFIRM: 'Your account has been successfully confirmed',

  LOGIN_SUCCESSFUL: 'Login successful',
};

export const TOKEN_VALIDITY = 604800; // 7 days

export const FIELD = {
  USERNAME: 'username',
  PASSWORD: 'password',
  EMAIL: 'email',
  CONFIRM_PASSWORD: 'confirmPassword',
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
