module.exports = {
  up: queryInterface => queryInterface.addConstraint('Profiles', ['username'], {
    type: 'unique',
    name: 'Username already exists.',
  }),

  down(queryInterface) {
    return queryInterface.removeColumn(
      'Profiles',
      'username'
    );
  },
};
