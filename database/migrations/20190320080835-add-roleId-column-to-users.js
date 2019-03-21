export default {
  up: (queryInterface, Sequelize) => (
    queryInterface.addColumn('Users', 'roleId', Sequelize.INTEGER)
  ),
  down: (queryInterface, Sequelize) => queryInterface.removeColumn('Users', 'roleId')
};
