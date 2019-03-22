/**
 * A model class representing article rating
 *
 * @param {Sequelize} sequelize - Sequelize object
 * @param {Sequelize.DataTypes} DataTypes - A convinient object holding data types
 * @return {Sequelize.Model} - Application Settings Model
 */
const Ratings = (sequelize, DataTypes) => {
  const RatingSchema = sequelize.define('ratings', {
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      }
    },
  }, {});
  RatingSchema.associate = (models) => {
    RatingSchema.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
    RatingSchema.belongsTo(models.Article, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE',
    });
  };
  return RatingSchema;
};

export default Ratings;
