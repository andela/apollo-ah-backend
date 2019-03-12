/**
 * A model class representing article like resource
 *
 * @param {Sequelize} sequelize - Sequelize object
 * @param {Sequelize.DataTypes} DataTypes - A convinient object holding data types
 * @return {Sequelize.Model} - User model
 */

const ArticleLike = (sequelize, DataTypes) => {
  /**
 * @type {Sequelize.Model}
 */
  const ArticleLikeSchema = sequelize.define('articleLike', {
    like: {
      type: DataTypes.BOOLEAN,
    }
  }, {});
  ArticleLikeSchema.associate = (models) => {
    ArticleLikeSchema.belongsTo(models.Article, {
      foreignKey: 'articleId',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });
    ArticleLikeSchema.belongsTo(models.User, {
      foreignKey: 'userId',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return ArticleLikeSchema;
};

export default ArticleLike;
