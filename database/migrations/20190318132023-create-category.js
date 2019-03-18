export default {
  up: (queryInterface, Sequelize) => (
    queryInterface.createTable('ArticleCategories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      category: {
        type: Sequelize.STRING
      },
    })
  ),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('ArticleCategories')
};
