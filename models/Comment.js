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
      isAnonymousUser: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false
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
    // models.Comment.belongsToMany(models.User, {
    //   through: models.CommentLike,
    //   as: 'likes',
    //   foreignKey: 'commentId'
    // });
    CommentSchema.hasMany(models.CommentLike, { foreignKey: 'commentId' });
  };
  return CommentSchema;
};

export default Comment;
