/**
 *
 * @param {Sequelize} sequelize
 * @param {Sequelize.DataTypes} DataTypes
 * @returns {Sequelize.models} - History model
 */
export default (sequelize, DataTypes) => {
  const History = sequelize.define(
    'History',
    {
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    },
    {}
  );
  History.associate = (models) => {
    // associations can be defined here
    History.belongsTo(models.Article, { foreignKey: 'articleId' });
    History.belongsTo(models.User, { foreignKey: 'userId' });
  };
  return History;
};
