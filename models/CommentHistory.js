/**
 * Comment History model
 * @param {Sequelize} sequelize
 * @param {Sequelize.DataTypes} DataTypes
 * @returns {Sequelize.models} - CommentHistory model
 */

const CommentHistory = (sequelize, DataTypes) => {
  const CommentHistorySchema = sequelize.define(
    'CommentHistory',
    {
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: sequelize.NOW
      },
      commentId: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.NOW,
        onUpdate: sequelize.NOW
      }
    },
    {
      freezeTableName: true,
      tableName: 'CommentHistory'
    }
  );
  CommentHistorySchema.associate = (models) => {
    models.CommentHistory.belongsTo(models.Comment, {
      onDelete: 'CASCADE',
      foreignKey: 'commentId'
    });
  };

  return CommentHistorySchema;
};
export default CommentHistory;
