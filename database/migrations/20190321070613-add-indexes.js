/* eslint no-unused-vars: ["error", { "args": "none" }] */
export default {
  up: queryInterface => queryInterface.addIndex('Articles', ['title', 'description']),
  down: queryInterface => queryInterface.removeIndex('Articles', ['title', 'description'])
};
