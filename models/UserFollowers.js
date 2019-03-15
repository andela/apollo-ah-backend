export default (sequelize, DataTypes) => {
  const UserFollowers = sequelize.define('UserFollowers', {
    userId: DataTypes.INTEGER,
    followerId: DataTypes.INTEGER
  }, {});

  return UserFollowers;
};
