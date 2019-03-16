import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';

chai.use(chaiHttp);

/**
 * Authenticate a user payload
 *
 * @export
 * @param {object} payload - User object
 * @returns {object} The authenticated user payload
 */
export async function auth(payload) {
  return chai.request(app)
    .post('/api/v1/users/login')
    .send(payload);
}

export default {};
