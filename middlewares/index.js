import validateCreateProfile from './validateCreateProfile';
import authenticate from './authenticate';
import permit from './permission';
import validateArticleReport from './validateReport';

const middlewares = {
  validateCreateProfile,
  authenticate,
  permit,
  validateArticleReport,
};

export default middlewares;
