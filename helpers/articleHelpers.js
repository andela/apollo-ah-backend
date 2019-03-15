import models from '../models';

const { Op } = models.Sequelize;

let readTime;

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
  articleReadTime: (articleBody) => {
    try {
      const defaultArticleLength = 250;
      const articleLength = articleBody.body.split(' ').length;
      if (articleLength <= defaultArticleLength) {
        readTime = '1 minute read';
        return readTime;
      }
      readTime = Math.round(articleLength / defaultArticleLength);
      if (readTime === 1) {
        return `${readTime} minute read`;
      }
      return `${readTime} minutes read`;
    } catch (err) {
      return err;
    }
  }
};
