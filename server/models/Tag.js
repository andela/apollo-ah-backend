import slugify from 'slugify';

export default (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    tagName: {
      type: DataTypes.STRING,
      primaryKey: true,
      set(value) {
        const slug = slugify(value, {
          replacement: '-', // replace spaces with replacement
          remove: /[*+~.()'"!:@]/g, // remove characters: *+~.()'"!:@
          lower: true // result in lower case
        });
        this.setDataValue('tagName', slug);
      }
    }
  }, {
    timestamps: false,
  });
  Tag.associate = (models) => {
    Tag.belongsToMany(models.Article, {
      through: models.ArticleTag,
      foreignKey: 'tagName',
      otherKey: 'articleId',
      as: 'articles'
    });
  };

  return Tag;
};
