/**
 *
 * @param {Sequelize} sequelize
 * @param {Sequelize.DataTypes} DataTypes
 * @returns {Sequelize.models} - Article model
 */

const Article = (sequelize, DataTypes) => {
  const ArticleSchema = sequelize.define(
    'Article',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      slug: DataTypes.STRING,
      body: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: sequelize.NOW
      },
      description: DataTypes.STRING,
      readTime: DataTypes.STRING,
      updatedAt: {
        allowNull: true,
        type: DataTypes.DATE,
        defaultValue: null
      },
      deletedAt: {
        allowNull: true,
        type: DataTypes.DATE,
      }
    },
    {}
  );
  ArticleSchema.associate = (models) => {
    models.Article.belongsTo(models.User, {
      onDelete: 'CASCADE',
      targetKey: 'id',
      foreignKey: 'authorId'
    });
    ArticleSchema.hasMany(models.ArticleLike, { foreignKey: 'articleId' });
    ArticleSchema.hasMany(models.Bookmark, { foreignKey: 'articleId' });
    ArticleSchema.belongsToMany(models.Tag, {
      through: models.ArticleTag,
      foreignKey: 'articleId',
      otherKey: 'tagName',
      as: 'tagList'
    });
  };
  return ArticleSchema;
};

export default Article;
