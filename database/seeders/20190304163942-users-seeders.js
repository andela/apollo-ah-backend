import faker from 'faker';
import logger from '../../server/helpers/logger';

export default {
  /**
   * Run the seeder
   *
   * @param {Sequelize.QueryInterface} queryInterface
   * - The interface that communicates with the database.
   * @param {Sequelize} sequelize - Sequelize object.
   * @return {void}
   */
  up: (queryInterface, sequelize) => {
    const profile = {
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      bio: faker.random.words(),
      username: faker.internet.userName().toLowerCase(),
      image: faker.image.imageUrl()
    };
    const password = '$2a$10$/RAAxAh65nDlKdDtp00gB.noVOtvyktM4nSHR1rfZwJIvqsM35rtW'; // secret

    return queryInterface.bulkInsert('Users', [
      {
        email: 'admin@admin.com',
        password,
      },
      {
        email: 'user@user.com',
        password,
      }
    ], {})
      .then(() => (
        queryInterface.bulkInsert('Profiles', [
          { ...profile, userId: 1, username: 'admin' },
          { ...profile, userId: 2 }
        ])
      ))
      .catch(error => logger.log(error));
  },

  /**
   * Reverse the seeder
   *
   * @param {Sequelize.QueryInterface} queryInterface
   * - The interface that communicates with the database.
   * @param {Sequelize} sequelize - Sequelize object.
   * @return {void}
   */
  down: (queryInterface, sequelize) => (
    queryInterface.bulkDelete('Users', null, {})
  )
};
