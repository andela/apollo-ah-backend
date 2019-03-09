/* eslint no-unused-vars: ["error", { "args": "none" }] */
export default {
  up: (queryInterface, Sequelize) => (
    queryInterface.createTable('articles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
      },
      slug: {
        type: Sequelize.STRING
      },
      body: {
        type: Sequelize.TEXT
      },
      description: {
        type: Sequelize.STRING
      },
      // tagList: {
      //   type: Sequelize.ARRAY(Sequelize.STRING),
      // },
      // tagId: {
      //   type: Sequelize.INTEGER,
      //   allowNull: true,
      //   defaultValue: null
      // },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null
      },
      authorId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        }
      }
    })
  ),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Articles')
};
