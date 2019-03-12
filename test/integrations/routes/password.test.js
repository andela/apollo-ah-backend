// /* eslint-disable no-unused-expressions */
// import chai, { expect } from 'chai';
// import chaiHttp from 'chai-http';
// import faker from 'faker';
// import app from '../index';
// import models from '../models';
// import { STATUS, MESSAGE, FIELD } from '../helpers/constants';

// chai.use(chaiHttp);
// describe('Recover password endpoint', () => {
//   it('should return an error if email is not supplied', (done) => {
//     const user = {
//       email: '',
//       password: faker.internet.password(),
//       username: faker.internet.userName(),
//     };
//     chai
//       .request(app)
//       .post('/api/v1/users/forgot_password')
//       .send(user)
//       .end((err, res) => {
//         expect(err).to.be.null;
//         expect(res).to.have.status(STATUS.BAD_REQUEST);
//         expect(res.body).to.be.an('object');
//         expect(res.body)
//           .to.haveOwnProperty('code')
//           .to.equal(STATUS.BAD_REQUEST);
//         expect(res.body)
//           .to.haveOwnProperty('message')
//           .to.equal(MESSAGE.PASSWORD_REQUEST_FAILED);
//         expect(res.body)
//           .to.haveOwnProperty('status')
//           .to.equal(false);
//         expect(res.body)
//           .to.haveOwnProperty('data')
//           .to.be.an('array')
//           .to.deep.include({
//             field: FIELD.EMAIL,
//             message: MESSAGE.EMAIL_EMPTY
//           });
//       });
//     done();
//   });
//   it('should return an error if email is supplied but invalid', (done) => {
//     const user = {
//       email: 'INVALID_EMAIL',
//       password: faker.internet.password(),
//       username: faker.internet.userName(),
//     };
//     chai
//       .request(app)
//       .post('/api/v1/users/forgot_password')
//       .send(user)
//       .end((err, res) => {
//         expect(err).to.be.null;
//         expect(res).to.have.status(STATUS.BAD_REQUEST);
//         expect(res.body).to.be.an('object');
//         expect(res.body)
//           .to.haveOwnProperty('code')
//           .to.equal(STATUS.BAD_REQUEST);
//         expect(res.body)
//           .to.haveOwnProperty('message')
//           .to.equal(MESSAGE.PASSWORD_REQUEST_FAILED);
//         expect(res.body)
//           .to.haveOwnProperty('status')
//           .to.equal(false);
//         expect(res.body)
//           .to.haveOwnProperty('data')
//           .to.be.an('array')
//           .to.deep.include({
//             field: FIELD.EMAIL,
//             message: MESSAGE.EMAIL_INVALID
//           });
//       });
//     done();
//   });
//   it('should return an error if user is not registered with the provided email', async () => {
//     const user = {
//       email: faker.internet.email(),
//       password: faker.internet.password(),
//       username: faker.internet.userName(),
//     };
//     chai
//       .request(app)
//       .post('/api/v1/users/forgot_password')
//       .send(user)
//       .end((err, res) => {
//         expect(err).to.be.null;
//         expect(res).to.have.status(STATUS.BAD_REQUEST);
//         expect(res.body).to.be.an('object');
//         expect(res.body)
//           .to.haveOwnProperty('code')
//           .to.equal(STATUS.BAD_REQUEST);
//         expect(res.body)
//           .to.haveOwnProperty('message')
//           .to.equal(MESSAGE.PASSWORD_REQUEST_FAILED);
//         expect(res.body)
//           .to.haveOwnProperty('status')
//           .to.equal(false);
//         expect(res.body)
//           .to.haveOwnProperty('data')
//           .to.be.an('array')
//           .to.deep.include({
//             field: FIELD.EMAIL,
//             message: MESSAGE.EMAIL_NOT_EXISTS
//           });
//       });
//   });
//   it('should send an email reset link for registered user', async () => {
//     const user = {
//       email: faker.internet.email(),
//       password: faker.internet.password(),
//       username: faker.internet.userName(),
//     };
//     await models.User.create(user);
//     chai
//       .request(app)
//       .post('/api/v1/users/forgot_password')
//       .send(user)
//       .end((err, res) => {
//         expect(err).to.be.null;
//         expect(res).to.have.status(STATUS.OK);
//         expect(res.body).to.be.an('object');
//         expect(res.body)
//           .to.haveOwnProperty('code')
//           .to.equal(STATUS.OK);
//         expect(res.body)
//           .to.haveOwnProperty('message')
//           .to.equal(MESSAGE.PASSWORD_REQUEST_SUCCESSFUL);
//         expect(res.body)
//           .to.haveOwnProperty('status')
//           .to.equal(true);
//         expect(res.body)
//           .to.haveOwnProperty('data')
//           .to.be.an('array').to.be.empty;
//       });
//   });
// });
