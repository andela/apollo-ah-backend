export default (sequelize, DataTypes) => {
  const ArticleTag = sequelize.define('ArticleTag', {
    articleId: {
      type: DataTypes.INTEGER,
    },
    tagName: {
      type: DataTypes.STRING,
    }
  }, { timestamps: false });

  return ArticleTag;
};
