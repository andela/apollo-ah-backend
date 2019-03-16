export default {
  up: (queryInterface, Sequelize) => (
    queryInterface.createTable('ArticleTags', {
      articleId: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      tagName: {
        type: Sequelize.STRING,
        primaryKey: true
      },
    })
  ),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('ArticleTags')
};
