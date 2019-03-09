import models from '../models';

const { Op } = models.Sequelize;

export default {
  findArticleByAuthorId: async (authorId, title) => {
    try {
      const article = await models.Article.findOne({
        where: {
          title: { [Op.eq]: title },
          authorId: { [Op.eq]: authorId }
        }
      });
      if (article) return article.dataValues;
    } catch (error) {
      return error;
    }
  },
  createArticle: async (content) => {
    try {
      const article = await models.Article.create(content);
      return article;
    } catch (error) {
      return error;
    }
  },
};
