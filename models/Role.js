/**
 * A model class representing roles
 *
 * @param {Sequelize} sequelize - Sequelize object
 * @param {Sequelize.DataTypes} DataTypes - A convinient object holding data types
 * @return {Sequelize.Model} - Role model
 */
export default (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  }, { timestamps: false });

  Role.associate = (models) => {
    Role.belongsToMany(models.User, {
      foreignKey: 'roleId',
      as: 'users',
      through: 'UserRoles'
    });
    Role.belongsToMany(models.Permission, {
      foreignKey: 'roleId',
      as: 'permissions',
      through: 'RolePermissions'
    });
  };

  return Role;
};
