/**
 * A model class representing article rating
 *
 * @param {Sequelize} sequelize - Sequelize object
 * @param {Sequelize.DataTypes} DataTypes - A convinient object holding data types
 * @return {Sequelize.Model} - Application Settings Model
 */
const ReportArticle = (sequelize, DataTypes) => {
  const ReportSchema = sequelize.define('reports', {
    body: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {});
  ReportSchema.associate = (models) => {
    ReportSchema.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
    ReportSchema.belongsTo(models.Article, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE',
    });
  };
  return ReportSchema;
};

export default ReportArticle;
