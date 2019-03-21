import faker from 'faker';
import logger from '../../helpers/logger';

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
    const profile1 = {
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      bio: faker.random.words(),
      userId: 1,
      username: faker.internet.userName(),
      image: faker.image.imageUrl()
    };

    const password = '$2a$10$/RAAxAh65nDlKdDtp00gB.noVOtvyktM4nSHR1rfZwJIvqsM35rtW'; // secret

    return queryInterface.bulkInsert('Users', [
      {
        email: faker.internet.email(),
        password,
        roleId: 1
      },
      {
        email: faker.internet.email(),
        password,
        roleId: 2
      }
    ], {})
      .then(() => (
        queryInterface.bulkInsert('Profiles', [profile1])
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
