import logger from '../../helpers/logger';

export default {
  up: (queryInterface, Sequelize) => (
    queryInterface.bulkInsert('Roles', [
      { name: 'admin' },
      { name: 'user' },
    ], {})
      .then(() => (
        queryInterface.bulkInsert('Permissions', [
          { name: 'create' },
          { name: 'read' },
          { name: 'update' },
          { name: 'delete' },
          { name: 'global' },
        ])
      ))
      .then(() => (
        queryInterface.bulkInsert('RolePermissions', [
          { roleId: 1, permissionId: 1 },
          { roleId: 1, permissionId: 2 },
          { roleId: 1, permissionId: 3 },
          { roleId: 1, permissionId: 4 },
          { roleId: 1, permissionId: 5 },
        ])
      ))
      .then(() => (
        queryInterface.bulkInsert('UserRoles', [
          { userId: 1, roleId: 1 },
          { userId: 2, roleId: 2 }
        ])
      ))
      .catch(error => logger.log(error))
  ),

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Roles', null, {});
  }
};
