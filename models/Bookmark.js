
/**
 * A model class representing bookmark resource
 *
 * @param {Sequelize} sequelize - Sequelize object
 * @param {Sequelize.DataTypes} DataTypes - A convinient object holding data types
 * @return {Sequelize.Model} - Bookmark model
 */
export default (sequelize, DataTypes) => {
  /**
 * @type {Sequelize.Model}
 */
  const Bookmark = sequelize.define('Bookmark', {}, {});
  Bookmark.associate = (models) => {
    Bookmark.belongsTo(models.Article, {
      foreignKey: 'articleId',
      targetKey: 'id',
      onDelete: 'CASCADE',
    });
    Bookmark.belongsTo(models.User, {
      foreignKey: 'userId',
      targetKey: 'id',
      onDelete: 'CASCADE',
    });
  };
  return Bookmark;
};
