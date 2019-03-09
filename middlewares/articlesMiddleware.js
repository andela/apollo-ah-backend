// import createError from 'http-errors';
import slugify from 'slugify';
import uuid from 'uuid/v4';
import articleHelpers from '../helpers/articleHelpers';

const buildErrorObject = (...message) => ({ errors: { body: [message] } });

const errorMessageComposer = (title, body, description) => {
  let titleErrorMessage;
  let bodyErrorMessage;
  let descriptionErrorMessage;

  if (!title) titleErrorMessage = 'title cannot be empty';
  if (!body) bodyErrorMessage = 'body cannot be empty';
  if (!description) descriptionErrorMessage = 'description cannot be empty';

  return [titleErrorMessage, bodyErrorMessage, descriptionErrorMessage];
};

const checkInputType = (inputType) => {
  if (inputType === 'tagId') return { errors: { body: 'tagId needs to be a number' } };
  return { errors: { body: [`${inputType} must be a string`] } };
};

const trimCheck = inputType => (
  { errors: { body: [`${inputType} cannot be empty.`] } }
);

export default {
  validateCreateArticleInput: async (req, res, next) => {
    const authorId = req.user.id;
    const {
      title = '',
      description = '',
      body = '',
    } = req.body;

    if (!title || !body || !description) {
      const getErrorMessage = errorMessageComposer(title, body, description);
      const errorObject = buildErrorObject(...getErrorMessage);
      return res.status(400).send(errorObject);
    }

    if (typeof title !== 'string') return res.status(400).send(checkInputType('title'));
    if (typeof body !== 'string') return res.status(400).send(checkInputType('body'));
    if (typeof description !== 'string') {
      return res.status(400).send(checkInputType('description'));
    }

    if (!title.trim()) return res.status(400).send(trimCheck('title'));
    if (!body.trim()) return res.status(400).send(trimCheck('body'));
    if (!description.trim()) return res.status(400).send(trimCheck('description'));

    try {
      const foundArticle = await articleHelpers.findArticleByAuthorId(authorId, title);
      if (foundArticle && foundArticle.title === title) {
        return res.status(400).send({
          errors: { body: ['an article with that title already exist'] }
        });
      }
      const slug = slugify(`${title}-${uuid()}`, '-');
      res.locals.slug = slug;
      return next();
    } catch (error) {
      return res.status(400).send(error);
    }
  },
};
