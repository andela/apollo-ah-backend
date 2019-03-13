export default {
  /**
   * Run the migration
   *
   * @param {Sequelize.QueryInterface} queryInterface - The interface that communicates
   * with the database.
   * @param {Sequelize} Sequelize - Sequelize object.
   * @return {void}
   */
  up: (queryInterface, Sequelize) => (
    queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
      },
      isConfirmed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      password: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
    })
  ),

  /**
   * Reverse the migration
   *
   * @param {Sequelize.QueryInterface} queryInterface - The interface that communicates
   * with the database.
   * @param {Sequelize} Sequelize - Sequelize object.
   * @return {void}
   */
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Users')
};
