export default {
  up: (queryInterface, Sequelize) => (
    queryInterface.createTable('ArticleTags', {
      articleId: {
        type: Sequelize.INTEGER,
      },
      tagName: {
        type: Sequelize.STRING,
      },
    })
  ),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('ArticleTags')
};
