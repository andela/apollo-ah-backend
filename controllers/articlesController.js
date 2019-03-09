import models from '../models';

export default {
  create: async (req, res) => {
    const authorId = req.user.id;
    const { slug } = res.locals;
    const {
      title, body, description,
    } = req.body;
    const content = {
      title, body, description, slug, authorId,
    };
    try {
      const article = await models.Article.create(content);
      return res.status(201).send(article);
    } catch (error) {
      return res.status(400).send(error);
    }
  }
};
