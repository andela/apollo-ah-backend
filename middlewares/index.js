import authenticate from './authenticate';
import permit from './permission';
import validateArticleReport from './validateReport';

const middlewares = {
  authenticate,
  permit,
  validateArticleReport,
};

export default middlewares;
