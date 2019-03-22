export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('ratings', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    articleId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Articles',
        key: 'id'
      },
    },
    stars: {
      type: Sequelize.INTEGER,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('ratings')
};
