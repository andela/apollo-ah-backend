export default {
  up: (queryInterface, Sequelize) => (
    queryInterface.createTable('Tags', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      tagName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
    })
  ),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Tags')
};
