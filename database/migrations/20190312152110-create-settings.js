

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('settings', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    canEmail: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    canNotify: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    user_id: {
      allowNull: false,
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'users',
        key: 'id',
      }
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('settings')
};
