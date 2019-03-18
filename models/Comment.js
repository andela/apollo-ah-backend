/**
 *
 * @param {Sequelize} sequelize
 * @param {Sequelize.DataTypes} DataTypes
 * @returns {Sequelize.models} - Comment model
 */

const Comment = (sequelize, DataTypes) => {
  const CommentSchema = sequelize.define(
    'Comment',
    {
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      user: {
        allowNull: false,
        type: DataTypes.STRING,
        defaultValue: 'user'
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: sequelize.NOW
      },
    },
    {}
  );
  CommentSchema.associate = (models) => {
    // associations can be defined here
    models.Comment.belongsTo(models.Article, {
      onDelete: 'CASCADE',
      targetKey: 'id',
      foreignKey: 'articleId'
    });
    models.Comment.belongsTo(models.User, {
      foreignKey: 'authorId',
      onDelete: 'CASCADE',
      as: 'author'
    });
  };
  return CommentSchema;
};

export default Comment;
