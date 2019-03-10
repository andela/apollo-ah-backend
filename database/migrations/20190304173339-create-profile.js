

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('profiles', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    firstname: {
      type: Sequelize.STRING
    },
    lastname: {
      type: Sequelize.STRING
    },
    username: {
      type: Sequelize.STRING
    },
    gender: {
      type: Sequelize.STRING
    },
    bio: {
      type: Sequelize.STRING
    },
    image: {
      type: Sequelize.STRING
    },
    phone: {
      type: Sequelize.STRING
    },
    address: {
      type: Sequelize.STRING
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Profiles')
};
