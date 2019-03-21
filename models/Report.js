/**
 * A model class representing article reporting
 *
 * @param {Sequelize} sequelize - Sequelize object
 * @param {Sequelize.DataTypes} DataTypes - A convinient object holding data types
 * @return {Sequelize.Model} - Application Settings Model
 */
const ReportArticle = (sequelize, DataTypes) => {
  const ReportSchema = sequelize.define('reports', {
    reportType: {
      type: DataTypes.ENUM,
      values: ['spam', 'plagiarism', 'rules violation', 'others'],
      allowNull: false,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: true,
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
