import validateCreateProfile from './validateCreateProfile';
import authenticate from './authenticate';
import validateArticleReport from './validateReport';

const middlewares = {
  validateCreateProfile,
  authenticate,
  validateArticleReport,
};

export default middlewares;
