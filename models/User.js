/* eslint-disable no-unused-vars */

import bcrypt from 'bcryptjs';

/**
 * A model class representing user resource
 *
 * @param {Sequelize} sequelize - Sequelize object
 * @param {Sequelize.DataTypes} DataTypes - A convinient object holding data types
 * @return {Sequelize.Model} - User model
 */
export default (sequelize, DataTypes) => {
  /**
   * @type {Sequelize.Model}
   */
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: 'Must be a valid email address' },
      },
    },
    password: {
      type: DataTypes.STRING,
      set(val) {
        this.setDataValue('password', bcrypt.hashSync(val, 10));
      }
    },
    isConfirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
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
   * @param {Sequelize.Model} models - Sequelize model
   * @returns {void}
   */
  User.associate = (models) => {
    // association comes here
  };

  /**
   * Validate user password
   *
   * @param {Object} user - User instance
   * @param {string} password - Password to validate
   * @returns {boolean} Truthy upon successful validation
   */
  User.comparePassword = (user, password) => (
    bcrypt.compareSync(password, user.password)
  );
  return User;
};
