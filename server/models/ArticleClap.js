/**
 * A model class representing article claps
 *
 * @param {Sequelize} sequelize - Sequelize object
 * @param {Sequelize.DataTypes} DataTypes - A convinient object holding data types
 * @return {Sequelize.Model} - ArticleClap model
 */
export default (sequelize, DataTypes) => {
  const ArticleClap = sequelize.define('ArticleClap', {
    userId: DataTypes.INTEGER,
    articleId: DataTypes.INTEGER,
    claps: {
      type: DataTypes.INTEGER,
      defaultValue: null,
      validate: { min: 1, max: 100 }
    }
  }, {});

  ArticleClap.associate = (models) => {
    ArticleClap.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };
  return ArticleClap;
};
