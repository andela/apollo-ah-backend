import faker from 'faker';

export default {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('articles', [{
    title: 'Javascript',
    slug: 'Javascript-2db9e3cd-f9ed-4f9c-a8f6-e5731c8e1415',
    body: faker.lorem.paragraphs(),
    createdAt: new Date(),
    description: faker.random.words(15),
    readTime: '2 minutes read',
    updatedAt: new Date(),
    authorId: 1,
  },
  {
    title: 'NodeJs',
    slug: 'NodeJs-2db9e3cd-f9ed-4f9c-a9f6-e5731c8e1515',
    body: faker.lorem.paragraphs(),
    createdAt: new Date(),
    description: faker.random.words(15),
    readTime: '2 minutes read',
    updatedAt: new Date(),
    authorId: 2,
  },
  {
    title: 'ExpressJs',
    slug: 'ExpressJs-2db9e3cd-f9ed-4f9c-a9f6-e5731c8f1515',
    body: faker.lorem.paragraphs(),
    createdAt: new Date(),
    description: faker.random.words(15),
    readTime: '2 minutes read',
    updatedAt: new Date(),
    authorId: 2,
  },
  {
    title: 'ReactJs',
    slug: 'ReactJs-2db9e3cd-f9ed-4f9c-a9f6-e5731c8e1525',
    body: faker.lorem.paragraphs(),
    createdAt: new Date(),
    description: faker.random.words(15),
    readTime: '2 minutes read',
    updatedAt: new Date(),
    authorId: 1,
  },
  {
    title: 'VueJs',
    slug: 'VueJs-2db9e3cd-f9ed-4f9c-a9f6-e5731c8e1515',
    body: faker.lorem.paragraphs(),
    createdAt: new Date(),
    description: faker.random.words(15),
    readTime: '2 minutes read',
    updatedAt: new Date(),
    authorId: 2,
  }], {}),
  // eslint-disable-next-line no-unused-expressions
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('article', null, {})
};
