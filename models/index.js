import Sequelize from 'sequelize';
import dbConfig from '../config/database';
import { env } from '../helpers/utils';

const environment = env('NODE_ENV');
const config = dbConfig[environment];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const models = {
  User: sequelize.import('./User.js'),
};

Object.keys(models).forEach((key) => {
  if (models[key].associate) models[key].associate(models);
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
