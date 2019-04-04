export default {
  up: (queryInterface, Sequelize) => (
    queryInterface.createTable('UserRoles', {
      userId: {
        type: Sequelize.INTEGER
      },
      roleId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    })
  ),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('UserRoles')
};
