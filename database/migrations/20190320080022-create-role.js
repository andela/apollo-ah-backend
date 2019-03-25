export default {
  up: (queryInterface, Sequelize) => (
    queryInterface.createTable('Roles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      }
    })
  ),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('Roles')
};
