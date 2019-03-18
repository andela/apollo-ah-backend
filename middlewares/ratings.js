import Response from '../helpers/responseHelper';
import { STATUS } from '../helpers/constants';
import models from '../models';

const { Article } = models;

export const validateRatings = (req, res, next) => {
  const { body: { stars } } = req;
  if (!stars || stars < 1 || stars > 5) {
    return Response.send(res, STATUS.BAD_REQUEST, [], 'Input cannot be less than 1 or greater than 5', false);
  }
  return next();
};

export const checkArticle = async (req, res, next) => {
  const foundArticle = await Article.findAndCountAll({
    where: {
      id: req.params.articleId,
    }
  });
  if (foundArticle.count >= 1) {
    return next();
  }
  return Response.send(res, STATUS.NOT_FOUND, {}, 'ARTICLE NOT FOUND', 'Failure');
};
