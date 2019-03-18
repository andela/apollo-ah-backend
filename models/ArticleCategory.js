/**
 * A model class representing article category resource
 *
 * @param {Sequelize} sequelize - Sequelize object
 * @param {Sequelize.DataTypes} DataTypes - A convenient object holding data types
 * @return {Sequelize.Model} - User model
 */
export default (sequelize, DataTypes) => {
  /**
 * @type {Sequelize.Model}
 */
  const ArticleCategory = sequelize.define('ArticleCategory', {
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, { timestamps: false });

  ArticleCategory.associate = (models) => {
    ArticleCategory.hasMany(models.Article, { foreignKey: 'categoryId' });
  };
  return ArticleCategory;
};
