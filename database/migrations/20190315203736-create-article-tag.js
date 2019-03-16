export default {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ArticleTags', {
      articleId: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      tagName: {
        type: Sequelize.STRING,
        primaryKey: true
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ArticleTags');
  }
};
