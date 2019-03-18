/**
 * A model class representing user resource
 *
 * @param {Sequelize} sequelize - Sequelize object
 * @param {Sequelize.DataTypes} DataTypes - A convinient object holding data types
 * @return {Sequelize.Model} - User model
 */

const Notification = (sequelize, DataTypes) => {
  /**
   * @type {Sequelize.Model}
   */
  const NotificationSchema = sequelize.define('Notification', {
    message: {
      type: DataTypes.STRING,
      allowNull: false
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

  NotificationSchema.associate = (models) => {
    NotificationSchema.belongsTo(models.User, {
      foreignKey: 'userId',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return NotificationSchema;
};

export default Notification;
