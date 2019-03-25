/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../index';
import models from '../../../models';
import { STATUS, MESSAGE } from '../../../helpers/constants';
import { auth } from '../../helpers';

chai.use(chaiHttp);

describe('Role Based Access Control', () => {
  let adminToken;
  let userToken;
  let dummyRole;

  before(async () => {
    // Authenticate an admin user
    const admin = await models.User.findOne({ raw: true });
    admin.password = 'secret';
    let response = await auth(admin);
    adminToken = response.body.token;

    const user = await models.User.findByPk(2, { raw: true });
    user.password = 'secret';
    response = await auth(user);
    userToken = response.body.token;
    // create a dummy role
    dummyRole = await models.Role.create({ name: 'writer' });
  });

  describe('Roles endpoint: /roles', () => {
    it('Should fetch a list of all roles', (done) => {
      chai
        .request(app)
        .get('/api/v1/roles')
        .set({ Authorization: `Bearer ${adminToken}` })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(STATUS.OK);
          expect(res.body.data.length).to.equal(3);
          done();
        });
    });
    it('Should fetch a specified role', (done) => {
      const { id } = dummyRole;
      chai
        .request(app)
        .get(`/api/v1/roles/${id}`)
        .set({ Authorization: `Bearer ${adminToken}` })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(STATUS.OK);
          expect(res.body.data).to.haveOwnProperty('name').to.equal(dummyRole.name);
          done();
        });
    });
    it('Should create a new role', (done) => {
      chai
        .request(app)
        .post('/api/v1/roles')
        .send({ name: 'guest' })
        .set({ Authorization: `Bearer ${adminToken}` })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(STATUS.CREATED);
          expect(res.body).to.haveOwnProperty('message').to.equal(MESSAGE.CREATE_SUCCESS);
          done();
        });
    });
    it('Should update a role', (done) => {
      const { id } = dummyRole;
      chai
        .request(app)
        .patch(`/api/v1/roles/${id}`)
        .send({ name: 'publisher' })
        .set({ Authorization: `Bearer ${adminToken}` })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(STATUS.OK);
          expect(res.body).to.haveOwnProperty('message').to.equal(MESSAGE.UPDATE_SUCCESS);
          done();
        });
    });
    it('Should restrict routes based on role privilege', (done) => {
      chai
        .request(app)
        .get('/api/v1/roles')
        .set({ Authorization: `Bearer ${userToken}` })
        .end((err, res) => {
          expect(res).to.have.status(STATUS.FORBIDDEN);
          expect(res.body).to.haveOwnProperty('message').to.equal(MESSAGE.ACCESS_FORBIDDEN);
          done();
        });
    });
    it('Should assign permissions to a specific role', (done) => {
      const { id } = dummyRole;
      const permisions = {
        permissionList: ['create', 'read']
      };
      chai
        .request(app)
        .post(`/api/v1/roles/${id}/permissions`)
        .send(permisions)
        .set({ Authorization: `Bearer ${adminToken}` })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(STATUS.OK);
          done();
        });
    });
    it('Should throw an error when permissionList is not supplied', (done) => {
      const { id } = dummyRole;
      chai
        .request(app)
        .post(`/api/v1/roles/${id}/permissions`)
        .send({})
        .set({ Authorization: `Bearer ${adminToken}` })
        .end((err, res) => {
          expect(res).to.have.status(STATUS.BAD_REQUEST);
          expect(res.body.data[0])
            .to.haveOwnProperty('message')
            .to.equal('permissionList must not be empty');
          done();
        });
    });
    it('Should throw an error when permissionList is invalid', (done) => {
      const { id } = dummyRole;
      chai
        .request(app)
        .post(`/api/v1/roles/${id}/permissions`)
        .send({ permissionList: 'create;read' })
        .set({ Authorization: `Bearer ${adminToken}` })
        .end((err, res) => {
          expect(res).to.have.status(STATUS.BAD_REQUEST);
          expect(res.body.data[0])
            .to.haveOwnProperty('message')
            .to.equal('permissionList must be an array');
          done();
        });
    });
  });
});
