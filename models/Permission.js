export default (sequelize, DataTypes) => {
  const Permission = sequelize.define('Permission', {
    name: DataTypes.STRING
  }, { timestamps: false });

  Permission.associate = (models) => {
    Permission.belongsToMany(models.Role, {
      foreignKey: 'permissionId',
      as: 'permissions',
      through: 'RolePermissions'
    });
  };
  return Permission;
};
