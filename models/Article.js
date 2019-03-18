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
    },
    {}
  );
  ArticleSchema.associate = (models) => {
    ArticleSchema.belongsTo(models.User, {
      onDelete: 'CASCADE',
      targetKey: 'id',
      foreignKey: 'authorId'
    });
    ArticleSchema.hasMany(models.ArticleLike, { foreignKey: 'articleId' });
    ArticleSchema.belongsTo(models.ArticleCategory, {
      targetKey: 'id',
      as: 'articleCategory',
      foreignKey: 'categoryId'
    });
  };
  return ArticleSchema;
};

export default Article;
