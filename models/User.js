import Sequelize from 'sequelize';
import bcrypt from 'bcryptjs';

/**
 * A model class representing user resource
 *
 * @param {Sequelize} sequelize - Sequelize object
 * @param {Sequelize.DataTypes} DataTypes - A convinient object holding data types
 * @return {Sequelize.Model} - User model
 */
const User = (sequelize, DataTypes) => {
  /** @type {Sequelize.Model} */
  const UserSchema = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-zA-Z0-9]+$/i,
      },
      set(val) {
        this.setDataValue('username', val.toLowerCase()); // convert to lowercase
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: 'Must be a valid email address' },
      },
    },
    bio: DataTypes.STRING,
    image: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      set(val) {
        this.setDataValue('password', bcrypt.hashSync(val, 10));
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.NOW,
      onUpdate: sequelize.NOW,
    },
  });

  /**
   * User relationship
   *
   * @param {Sequelize.Model} models - Sequelize model (destructured)
   * @returns {void}
   */
  UserSchema.associate = (models) => {
    // UserSchema.hasOne(models.Profile);
  };
  return UserSchema;
};

export default User;
