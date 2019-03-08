import validateCreateProfile from './validateCreateProfile';
import authenticate from './authenticate';

const middlewares = {
  validateCreateProfile,
  authenticate,
};

export default middlewares;
