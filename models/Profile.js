/**
 * A model class representing user resource
 *
 * @param {Sequelize} sequelize - Sequelize object
 * @param {Sequelize.DataTypes} DataTypes - A convinient object holding data types
 * @return {Sequelize.Model} - User model
 */

const Profile = (sequelize, DataTypes) => {
  /**
   * @type {Sequelize.Model}
   */
  const ProfileSchema = sequelize.define('profiles', {
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bio: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {});

  ProfileSchema.associate = (models) => {
    ProfileSchema.belongsTo(models.User, {
      foreignKey: 'user_id',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return ProfileSchema;
};

export default Profile;