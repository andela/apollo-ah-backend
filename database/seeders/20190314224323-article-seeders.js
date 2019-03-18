import faker from 'faker';

export default {
  up: (queryInterface, Sequelize) => (
    queryInterface.bulkInsert('Articles', [{
      title: faker.lorem.words(),
      slug: faker.lorem.slug(),
      body: faker.lorem.words(),
      description: faker.lorem.words(),
      authorId: 1,
    }], {})
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Articles', null, {})
};
