/**
 * A model class representing comment like resource
 *
 * @param {Sequelize} sequelize - Sequelize object
 * @param {Sequelize.DataTypes} DataTypes - A convenient object holding data types
 * @return {Sequelize.Model} - commentLike model
 */

const CommentLike = (sequelize, DataTypes) => {
  /**
 * @type {Sequelize.Model}
 */
  const CommentLikeSchema = sequelize.define('CommentLike', {
    userId: {
      type: DataTypes.INTEGER,
    },
    commentId: {
      type: DataTypes.INTEGER,
    },
  }, {});
  CommentLikeSchema.associate = (models) => {
    CommentLikeSchema.belongsTo(models.Comment, {
      foreignKey: 'commentId',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });
    CommentLikeSchema.belongsTo(models.User, {
      foreignKey: 'userId',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return CommentLikeSchema;
};

export default CommentLike;
