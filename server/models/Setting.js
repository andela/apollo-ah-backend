/**
 * A model class representing settings on the databse
 *
 * @param {Sequelize} sequelize - Sequelize object
 * @param {Sequelize.DataTypes} DataTypes - A convinient object holding data types
 * @return {Sequelize.Model} - Application Settings Model
 */

const Setting = (sequelize, DataTypes) => {
  /**
   * @type {Sequelize.Model}
   */
  const SettingSchema = sequelize.define('Setting', {
    canEmail: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    canNotify: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.NOW,
      onUpdate: sequelize.NOW
    }
  }, {});

  SettingSchema.associate = (models) => {
    SettingSchema.belongsTo(models.User, {
      foreignKey: 'userId',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return SettingSchema;
};

export default Setting;
