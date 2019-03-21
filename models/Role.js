/**
 * A model class representing roles
 *
 * @param {Sequelize} sequelize - Sequelize object
 * @param {Sequelize.DataTypes} DataTypes - A convinient object holding data types
 * @return {Sequelize.Model} - Role model
 */
export default (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    title: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    create: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    update: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    delete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    global: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  }, {});

  Role.associate = (models) => {
    Role.hasMany(models.User, { foreignKey: 'roleId' });
  };

  return Role;
};
