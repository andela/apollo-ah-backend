/**
 * Retrieves the value for environment config variable
 *
 * @param {string} param - ENV config variable
 * @param {(string|number|boolean)} value - A default value to return if ENV config var is not set
 * @return {(string|number|boolean)} The value for specified ENV config var
 */
export const env = (param, value) => process.env[param] || value;

export default {};
