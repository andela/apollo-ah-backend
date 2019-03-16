export default (sequelize, DataTypes) => {
  const ArticleTag = sequelize.define('ArticleTag', {
    articleId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    tagName: {
      type: DataTypes.STRING,
      primaryKey: true
    }
  }, { timestamps: false });

  return ArticleTag;
};
