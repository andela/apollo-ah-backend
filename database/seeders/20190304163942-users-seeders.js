export default {
  /**
   * Run the seeder
   *
   * @param {Sequelize.QueryInterface} queryInterface
   * - The interface that communicates with the database.
   * @param {Sequelize} sequelize - Sequelize object.
   * @return {void}
   */
  up: (queryInterface, sequelize) => (
    queryInterface.bulkInsert('users', [
      {
        username: 'admin',
        email: 'demo@demo.com',
        password: '$2a$10$/RAAxAh65nDlKdDtp00gB.noVOtvyktM4nSHR1rfZwJIvqsM35rtW'
      },
      {
        username: 'user',
        email: 'user@user.com',
        password: '$2a$10$/RAAxAh65nDlKdDtp00gB.noVOtvyktM4nSHR1rfZwJIvqsM35rtW'
      }
    ], {})
  ),

  /**
   * Reverse the seeder
   *
   * @param {Sequelize.QueryInterface} queryInterface
   * - The interface that communicates with the database.
   * @param {Sequelize} sequelize - Sequelize object.
   * @return {void}
   */
  down: (queryInterface, sequelize) => (
    queryInterface.bulkDelete('users', null, {})
  )
};
