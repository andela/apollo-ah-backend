import { env, validateConfigVariable } from '../helpers/utils';

/**
 * Sequelize config options
 */
const options = {
  logging: env('DB_LOGGING', false), // disable query logging
  operatorsAliases: false, // Optional: disable deprecation warning
};

// Ensure ENV config variable(s) is set
switch (env('NODE_ENV')) {
  case 'production':
    validateConfigVariable(['DATABASE_URL']);
    break;
  default:
    validateConfigVariable([
      'DB_DATABASE',
      'DB_USERNAME',
      'DB_PASSWORD',
    ]);
}

export default {
  development: {
    username: env('DB_USERNAME', 'postgres'),
    password: env('DB_PASSWORD', ''),
    database: env('DB_DATABASE', ''),
    host: env('DB_HOST', '127.0.0.1'),
    dialect: env('DB_CONNECTION', 'postgres'),
    ...options,
  },
  test: {
    username: env('DB_USERNAME', 'postgres'),
    password: env('DB_PASSWORD', ''),
    database: env('DB_DATABASE', ''),
    host: env('DB_HOST', '127.0.0.1'),
    dialect: env('DB_CONNECTION', 'postgres'),
    ...options,
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    ...options
  },
};
