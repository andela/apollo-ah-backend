/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import app from '../../../server';
import { STATUS, MESSAGE } from '../../../server/helpers/constants';
import models from '../../../server/models';
import { users } from '../../helpers/testData';
import { generateToken } from '../../../server/helpers/utils';

const { dummyUser2 } = users;

chai.use(chaiHttp);

const {
  CREATED,
  BAD_REQUEST,
  OK,
  NOT_FOUND,
} = STATUS;

const dummyUser3 = {
  email: faker.internet.email(),
  password: 'i2345678',
  username: faker.name.firstName()
};

const profile = {
  firstname: faker.name.firstName(),
  lastname: faker.name.lastName(),
  phone: '+23438776199',
  bio: faker.random.words(),
  address: faker.address.streetAddress(),
  gender: 'M',
  username: faker.random.words(),
  image: faker.image.imageUrl(),
};

describe('Testing user profile feature', () => {
  before(async () => {
    const authpayload = await chai.request(app)
      .post('/api/v1/users')
      .send(dummyUser3);
    dummyUser3.token = authpayload.body.data.token;
    dummyUser3.id = authpayload.body.data.id;
    profile.userId = authpayload.body.data.id;
  });

  it('should create profile when details are correct', (done) => {
    chai.request(app)
      .post('/api/v1/profiles')
      .send(profile)
      .set({ Authorization: `Bearer ${dummyUser3.token}` })
      .end((err, res) => {
        expect(res).to.have.status(CREATED);
        expect(res.body).to.have.property('message');
        expect(res.body.data).to.be.an('object');
        expect(res.body.status).to.be.equals(true);
        expect(Object.keys(res.body.data)).to.include.members([
          'firstname',
          'lastname',
          'username',
          'bio',
          'image',
        ]);
        expect(res.body.data.id).to.not.be.a('string');
        expect(res.body.data.userId).to.not.be.a('string');
        done();
      });
  });

  it('should return error if username is not provided', (done) => {
    chai
      .request(app)
      .post('/api/v1/profiles')
      .send({ ...profile, username: '' })
      .set('Authorization', `Bearer ${dummyUser3.token}`)
      .end((err, res) => {
        expect(res.status).eql(BAD_REQUEST);
        expect(res.body).to.have.property('status').equal(false);
        expect(res.body).to.have.property('code').equal(400);
        expect(res.body).to.have.property('message').equal(MESSAGE.PROFILE_UPDATE_ERROR);
        expect(res.body).to.have.property('data');
        expect(res.body.data[0].field).to.be.equals('username');
        expect(res.body.data[0].message).to.be.equals('Username is required');
        done();
      });
  });

  it('should fetch all users', (done) => {
    chai
      .request(app)
      .get('/api/v1/profiles')
      .set('Authorization', `Bearer ${dummyUser3.token}`)
      .end((err, res) => {
        expect(res.status).eql(OK);
        expect(res.body.code).eql(OK);
        expect(res.body.data).to.be.an('array');
        expect(res.body.message).eql('You have successfully fetched the profile for all users');
        done();
      });
  });

  it('should not fetch a user if user does not exist', (done) => {
    chai
      .request(app)
      .get('/api/v1/profiles/k5')
      .set('Authorization', `Bearer ${dummyUser3.token}`)
      .end((err, res) => {
        expect(res).to.have.status(NOT_FOUND);
        expect(res.body.code).eql(NOT_FOUND);
        expect(res.body.message).eql('This user does not exist');
        done();
      });
  });

  it('should fetch a user profile successfully', async () => {
    const usersToken = await generateToken({ email: 'user@user.com', id: 2, password: 'secret' });
    const res = await chai.request(app)
      .get('/api/v1/profiles/user')
      .set('authorization', `Bearer ${usersToken}`);
    expect(res).to.have.status(OK);
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.be.equals('Successfully returned a user');
  });
});
describe('POST /api/v1/profiles/:username/follow', async () => {
  it('should allow a user to follow another user', async () => {
    const usersToken = await generateToken({ email: 'user@user.com', id: 2, password: 'secret' });
    const res = await chai.request(app)
      .post('/api/v1/profiles/admin/follow')
      .set('authorization', `Bearer ${usersToken}`);
    expect(res).to.have.status(STATUS.OK);
    expect(res.body)
      .to.haveOwnProperty('message')
      .to.equal('Successfully followed admin');
  });
  it('should get a list of user (followedUser) followers', async () => {
    const followerToken = await generateToken({ email: 'admin@admin.com', id: 1, password: 'secret' });
    const res = await chai
      .request(app)
      .get('/api/v1/profiles/followers')
      .set('authorization', `Bearer ${followerToken}`);
    expect(res).to.have.status(STATUS.OK);
    expect(res.body)
      .to.haveOwnProperty('data')
      .to.be.an('array')
      .lengthOf(1);
  });
  it('should get a list of user following', async () => {
    const usersToken = await generateToken({ email: 'user@user.com', id: 2, password: 'secret' });
    const res = await chai.request(app)
      .get('/api/v1/profiles/following')
      .set('authorization', `Bearer ${usersToken}`);
    expect(res).to.have.status(STATUS.OK);
    expect(res.body)
      .to.haveOwnProperty('data')
      .to.be.an('array')
      .lengthOf(1);
  });
  it('should allow a user to unfollow user', async () => {
    const usersToken = await generateToken({ email: 'user@user.com', id: 2, password: 'secret' });
    const res = await chai.request(app)
      .post('/api/v1/profiles/admin/unfollow')
      .set('authorization', `Bearer ${usersToken}`);
    expect(res).to.have.status(STATUS.OK);
    expect(res.body)
      .to.haveOwnProperty('message')
      .to.equal('Successfully unfollowed admin');
  });
  it('should not allow a user to follow self', async () => {
    const usersToken = await generateToken({ email: 'user@user.com', id: 2, password: 'secret' });
    const res = await chai.request(app)
      .post('/api/v1/profiles/user/follow')
      .set('authorization', `Bearer ${usersToken}`);
    expect(res).to.have.status(STATUS.BAD_REQUEST);
    expect(res.body)
      .to.haveOwnProperty('message')
      .to.equal(MESSAGE.FOLLOW_ERROR);
  });
});
