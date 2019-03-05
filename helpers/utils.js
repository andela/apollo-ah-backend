import jwt from 'jsonwebtoken';

/**
 * Retrieves the value for environment config variable
 *
 * @param {string} param - ENV config variable
 * @param {(string|number|boolean)} value - A default value to return if ENV config var is not set
 * @return {(string|number|boolean)} The value for specified ENV config var
 */
export const env = (param, value) => process.env[param] || value;

/**
 * Ensures required environment config variabl(s) is set
 *
 * @param {string[]} requiredEnv - A list of ENV config var to validate
 * @return {(void|Error)} Throws error upon unsuccessful validation
 */
export const validateConfigVariable = (requiredEnv) => {
  const unsetEnv = requiredEnv.filter(config => !(process.env[config]));

  if (unsetEnv.length > 0) {
    throw Error(`Required ENV variable(s) is missing: [${unsetEnv.join(', ')}]`);
  }
};

/**
 * Generates JWT token using provided payload
 *
 * @param {Object} payload - Payload to encrypt
 * @return {string} JWT token string
 */
export const generateToken = async payload => jwt.sign(payload, env('APP_KEY'));

export default {};
