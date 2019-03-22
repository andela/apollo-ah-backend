import authenticate from './authenticate';
import validateArticleReport from './validateReport';

const middlewares = {
  authenticate,
  validateArticleReport,
};

export default middlewares;
