export default {
  up: (queryInterface, Sequelize) => (
    queryInterface.bulkInsert('Roles', [
      {
        title: 'admin',
        create: true,
        read: true,
        update: true,
        delete: true,
        global: true
      },
      {
        title: 'user',
        create: true,
        read: true,
        update: true,
        delete: true
      },
    ], {})
  ),

  down: (queryInterface, Sequelize) => (
    queryInterface.bulkDelete('Roles', null, {})
  )
};
