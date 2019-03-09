/**
 *
 * @param {Sequelize} sequelize
 * @param {Sequelize.DataTypes} DataTypes
 * @returns {Sequelize.models} - Article model
 */

const Article = (sequelize, DataTypes) => {
  const ArticleSchema = sequelize.define(
    'article',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      slug: DataTypes.STRING,
      body: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: sequelize.NOW
      },
      description: DataTypes.STRING,
      // tagId: DataTypes.INTEGER,
      // tagList: DataTypes.ARRAY(DataTypes.STRING),
      // authorId: DataTypes.INTEGER,
      updatedAt: {
        allowNull: true,
        type: DataTypes.DATE,
        defaultValue: null
      },
    },
    {}
  );
  ArticleSchema.associate = (models) => {
    // associations can be defined here
    models.Article.belongsTo(models.User, {
      onDelete: 'CASCADE',
      targetKey: 'id',
      foreignKey: 'authorId'
    });
  };
  return ArticleSchema;
};

export default Article;
