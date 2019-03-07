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

  REGISTRATION_ERROR: 'Registration failed',
  REGISTRATION_SUCCESSFUL: 'Registraion successful',

  PASSWORD_TOO_SHORT: 'Your password must be at least 8 characters. Please try again.',
  PASSWORD_NOT_ALPHANUMERIC: 'Password should contain both letters and numbers',
  PASSWORD_EMPTY: 'Password is required',

  EMAIL_EMPTY: 'Email is required',
  EMAIL_INVALID: 'Provide a valid email address',
  EMAIL_EXISTS: 'The email address already exists. If you are registered, proceed to login instead',

  USERNAME_EMPTY: 'Username is required',
  USERNAME_EXITS: 'The username is already taken, try another one',
};

export const FIELD = {
  USERNAME: 'username',
  PASSWORD: 'password',
  EMAIL: 'email',
};

export const expressFormater = ({
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
