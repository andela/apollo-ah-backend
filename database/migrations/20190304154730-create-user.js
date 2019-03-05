export default {
  /**
   * Run the migration
   *
   * @param {Sequelize.QueryInterface} queryInterface - The interface that communicates
   * with the database.
   * @param {Sequelize} sequelize - Sequelize object.
   * @return {void}
   */
  up: (queryInterface, sequelize) => (
    queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: sequelize.INTEGER,
      },
      email: {
        type: sequelize.STRING,
      },
      password: {
        type: sequelize.STRING,
      },
      createdAt: {
        allowNull: true,
        type: sequelize.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: true,
        type: sequelize.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        // onUpdate: sequelize.literal('CURRENT_TIMESTAMP'),
      },
    })
  ),

  /**
   * Reverse the migration
   *
   * @param {Sequelize.QueryInterface} queryInterface - The interface that communicates
   * with the database.
   * @param {Sequelize} sequelize - Sequelize object.
   * @return {void}
   */
  down: (queryInterface, sequelize) => (
    queryInterface.dropTable('users')
  ),
};
