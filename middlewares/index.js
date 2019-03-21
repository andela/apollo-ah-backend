import validateCreateProfile from './validateCreateProfile';
import authenticate from './authenticate';
import permit from './permission';

const middlewares = {
  validateCreateProfile,
  authenticate,
  permit
};

export default middlewares;
