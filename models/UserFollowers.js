export default (sequelize, DataTypes) => {
  const UserFollowers = sequelize.define('UserFollowers', {
    userId: DataTypes.INTEGER,
    followerId: DataTypes.INTEGER
  }, {});

  UserFollowers.associate = (models) => {
    // associate
  };
  return UserFollowers;
};
