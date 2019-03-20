module.exports = {
  up: (queryInterface, Sequelize) => (
    Promise.all([
      queryInterface.addColumn('Articles', 'categoryId', {
        type: Sequelize.INTEGER,
      })
    ])
  ),
  down: (queryInterface, Sequelize) => Promise.all([queryInterface.removeColumn('Articles', 'categoryId')])
};
