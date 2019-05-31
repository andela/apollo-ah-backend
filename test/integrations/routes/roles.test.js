/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../server';
import { STATUS, MESSAGE } from '../../../server/helpers/constants';
import { generateToken } from '../../../server/helpers/utils';

chai.use(chaiHttp);

describe('Role Based Access Control', () => {
  it('Should fetch a list of all roles', async () => {
    const adminToken = await generateToken({ email: 'admin@admin.com', id: 1, password: 'secret' });
    const res = await chai.request(app)
      .get('/api/v1/roles')
      .set('authorization', `Bearer ${adminToken}`);
    expect(res).to.have.status(STATUS.OK);
    expect(res.body.data).to.be.an('array');
  });
  it('Should fetch a specified role', async () => {
    const adminToken = await generateToken({ email: 'admin@admin.com', id: 1, password: 'secret' });
    const res = await chai.request(app)
      .get('/api/v1/roles/1')
      .set('authorization', `Bearer ${adminToken}`);
    expect(res).to.have.status(STATUS.OK);
    expect(res.body.data.name).to.equal('admin');
  });
  it('Should create a new role', async () => {
    const adminToken = await generateToken({ email: 'admin@admin.com', id: 1, password: 'secret' });
    const res = await chai.request(app)
      .post('/api/v1/roles')
      .send({ name: 'guest' })
      .set('authorization', `Bearer ${adminToken}`);
    expect(res).to.have.status(STATUS.CREATED);
    expect(res.body).to.haveOwnProperty('message').to.equal(MESSAGE.CREATE_SUCCESS);
  });
  it('Should update a role', async () => {
    const adminToken = await generateToken({ email: 'admin@admin.com', id: 1, password: 'secret' });
    const res = await chai.request(app)
      .patch('/api/v1/roles/2')
      .send({ name: 'publisher' })
      .set('authorization', `Bearer ${adminToken}`);
    expect(res).to.have.status(STATUS.OK);
    expect(res.body).to.haveOwnProperty('message').to.equal(MESSAGE.UPDATE_SUCCESS);
  });
  it('Should restrict routes based on role privilege', async () => {
    const userToken = await generateToken({ email: 'user@user.com', id: 2, password: 'secret' });
    const res = await chai.request(app)
      .get('/api/v1/roles')
      .set('authorization', `Bearer ${userToken}`);
    expect(res).to.have.status(STATUS.FORBIDDEN);
    expect(res.body).to.haveOwnProperty('message').to.equal(MESSAGE.ACCESS_FORBIDDEN);
  });
  it('Should assign permissions to a specific role', async () => {
    const adminToken = await generateToken({ email: 'admin@admin.com', id: 1, password: 'secret' });
    const permisions = {
      permissionList: ['create', 'read']
    };
    const res = await chai.request(app)
      .post('/api/v1/roles/2/permissions')
      .send(permisions)
      .set('authorization', `Bearer ${adminToken}`);
    expect(res).to.have.status(STATUS.OK);
  });
  it('Should throw an error when permissionList is not supplied', async () => {
    const adminToken = await generateToken({ email: 'admin@admin.com', id: 1, password: 'secret' });
    const res = await chai.request(app)
      .post('/api/v1/roles/2/permissions')
      .send({})
      .set('authorization', `Bearer ${adminToken}`);
    expect(res).to.have.status(STATUS.BAD_REQUEST);
    expect(res.body.data[0])
      .to.haveOwnProperty('message')
      .to.equal('permissionList must not be empty');
  });
  it('Should throw an error when permissionList is invalid', async () => {
    const adminToken = await generateToken({ email: 'admin@admin.com', id: 1, password: 'secret' });
    const res = await chai.request(app)
      .post('/api/v1/roles/2/permissions')
      .send({ permissionList: 'create;read' })
      .set('authorization', `Bearer ${adminToken}`);
    expect(res).to.have.status(STATUS.BAD_REQUEST);
    expect(res.body.data[0])
      .to.haveOwnProperty('message')
      .to.equal('permissionList must be an array');
  });
});
