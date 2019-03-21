/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../index';
import models from '../../../models';
import { STATUS, MESSAGE } from '../../../helpers/constants';
import { auth } from '../../helpers';

chai.use(chaiHttp);

describe('Role based access control', () => {
  let adminToken;
  let userToken;
  let dummyRole;

  before(async () => {
    // Authenticate an admin user
    const admin = await models.User.findOne({
      where: { roleId: 1 },
      raw: true
    });
    admin.password = 'secret';
    let response = await auth(admin);
    adminToken = response.body.token;

    const user = await models.User.findOne({
      where: { roleId: 2 },
      raw: true
    });
    user.password = 'secret';
    response = await auth(user);
    userToken = response.body.token;
    // create a dummy role
    dummyRole = await models.Role.create({ title: 'writer' });
  });

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
        expect(res.body.data).to.haveOwnProperty('title').to.equal(dummyRole.title);
        done();
      });
  });
  it('Should create a new role', (done) => {
    chai
      .request(app)
      .post('/api/v1/roles')
      .send({ title: 'guest' })
      .set({ Authorization: `Bearer ${adminToken}` })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(STATUS.CREATED);
        expect(res.body).to.haveOwnProperty('message').to.equal(MESSAGE.CREATE_SUCCESS);
        expect(res.body.data).to.haveOwnProperty('title').to.equal('guest');
        expect(res.body.data).to.haveOwnProperty('create').to.be.false;
        expect(res.body.data).to.haveOwnProperty('read').to.be.false;
        expect(res.body.data).to.haveOwnProperty('update').to.be.false;
        expect(res.body.data).to.haveOwnProperty('delete').to.be.false;
        expect(res.body.data).to.haveOwnProperty('global').to.be.false;
        done();
      });
  });
  it('Should update a role', (done) => {
    const { id } = dummyRole;
    const payload = {
      title: 'publisher',
      update: true
    };
    chai
      .request(app)
      .patch(`/api/v1/roles/${id}`)
      .send(payload)
      .set({ Authorization: `Bearer ${adminToken}` })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(STATUS.OK);
        expect(res.body).to.haveOwnProperty('message').to.equal(MESSAGE.UPDATE_SUCCESS);
        expect(res.body.data).to.haveOwnProperty('title').to.equal(payload.title);
        expect(res.body.data).to.haveOwnProperty('create').to.be.false;
        expect(res.body.data).to.haveOwnProperty('read').to.be.false;
        expect(res.body.data).to.haveOwnProperty('update').to.be.true;
        expect(res.body.data).to.haveOwnProperty('delete').to.be.false;
        expect(res.body.data).to.haveOwnProperty('global').to.be.false;
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
});
