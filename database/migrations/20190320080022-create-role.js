export default {
  up: (queryInterface, Sequelize) => (
    queryInterface.createTable('Roles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      create: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      read: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      update: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      delete: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      global: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    })
  ),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('Roles')
};
