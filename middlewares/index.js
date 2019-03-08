import validateCreateProfile from './validateCreateProfile';
import verifyToken from './verifyToken';
import authenticate from './authenticate';

const middlewares = {
  validateCreateProfile,
  authenticate,
  verifyToken,
};

export default middlewares;
