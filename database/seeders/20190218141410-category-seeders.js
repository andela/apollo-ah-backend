const categories = [
  { category: 'Technology' },
  { category: 'Sports' },
  { category: 'Business' },
  { category: 'Fashion' },
  { category: 'Health' },
  { category: 'Food' },
  { category: 'Entertainment' },
  { category: 'History' },
  { category: 'Others' },
];

export default {
  /**
   * Run the seeder
   *
   * @param {Sequelize.QueryInterface} queryInterface
   * - The interface that communicates with the database.
   * @param {Sequelize} sequelize - Sequelize object.
   * @return {void}
   */
  up: (queryInterface, sequelize) => queryInterface.bulkInsert('ArticleCategories', categories, {}),

  /**
   * Reverse the seeder
   *
   * @param {Sequelize.QueryInterface} queryInterface
   * - The interface that communicates with the database.
   * @param {Sequelize} sequelize - Sequelize object.
   * @return {void}
   */
  down: (queryInterface, sequelize) => (
    queryInterface.bulkDelete('ArticleCategories', null, {})
  )
};
