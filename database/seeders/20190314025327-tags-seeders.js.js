export default {
  up: (queryInterface, Sequelize) => (
    queryInterface.bulkInsert('Tags', [
      { tagName: 'javascript' },
      { tagName: 'technology' },
      { tagName: 'tutorial' },
      { tagName: 'programming' },
    ], {})
  ),

  down: (queryInterface, Sequelize) => (
    queryInterface.bulkDelete('Tags', null, {})
  )
};
