/**
 *
 * @param {Sequelize} sequelize
 * @param {Sequelize.DataTypes} DataTypes
 * @returns {Sequelize.models} - Article model
 */

const Article = (sequelize, DataTypes) => {
  const ArticleSchema = sequelize.define(
    'article',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      slug: {
        type: DataTypes.STRING,
        unique: true
      },
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
  };
  return ArticleSchema;
};

export default Article;
