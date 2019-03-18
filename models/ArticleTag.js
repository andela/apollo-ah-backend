export default (sequelize, DataTypes) => {
  const ArticleTag = sequelize.define('ArticleTag', {}, { timestamps: false });
  return ArticleTag;
};
