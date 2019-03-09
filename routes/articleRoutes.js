import express from 'express';
import articlesMiddleware from '../middlewares/articlesMiddleware';
import articlesController from '../controllers/articlesController';
import authenticate from '../middlewares/authenticate';

const articleRouter = express.Router();
articleRouter
  // .get('/', (req, res) => res.send({ message: 'We can get multiple articles' }))
  .post('/',
    authenticate,
    articlesMiddleware.validateCreateArticleInput,
    articlesController.create);

export default articleRouter;
