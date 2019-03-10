import bcrypt from 'bcryptjs';

/**
 * A model class representing user resource
 *
 * @param {Sequelize} sequelize - Sequelize object
 * @param {Sequelize.DataTypes} DataTypes - A convinient object holding data types
 * @return {Sequelize.Model} - User model
 */
const User = (sequelize, DataTypes) => {
  /**
   * @type {Sequelize.Model}
   */
  const UserSchema = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: 'Must be a valid email address' }
      }
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
      defaultValue: sequelize.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.NOW,
      onUpdate: sequelize.NOW
    }
  });

  UserSchema.associate = (models) => {
    UserSchema.hasOne(models.Profile, { foreignKey: 'user_id' });
    UserSchema.hasMany(models.Article, { foreignKey: 'authorId' });
  };

  /**
   * Validate user password
   *
   * @param {Object} user - User instance
   * @param {string} password - Password to validate
   * @returns {boolean} Truthy upon successful validation
   */
  UserSchema.comparePassword = (user, password) => bcrypt.compareSync(password, user.password);
  return UserSchema;
};

export default User;
