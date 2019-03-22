export default {
  up: (queryInterface, Sequelize) => (
    queryInterface.createTable('Permissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      }
    })
  ),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Permissions')
};
