/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import app from '../../../server';
import { STATUS, MESSAGE } from '../../../server/helpers/constants';
import models from '../../../server/models';
import { users } from '../../helpers/testData';
import { auth } from '../../helpers';

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

  it('should fetch a user profile successfully', (done) => {
    models.User.create(dummyUser2)
      .then((user) => {
        const userId = user.dataValues.id;
        return userId;
      })
      .then((userId) => {
        models.Profile.create({
          firstname: '',
          lastname: '',
          bio: '',
          image: '',
          userId,
          username: dummyUser2.username,
        })
          .then((newProfile) => {
            const theUsername = newProfile.dataValues.username;
            chai
              .request(app)
              .get(`/api/v1/profiles/${theUsername}`)
              .set('Authorization', `Bearer ${dummyUser3.token}`)
              .end((err, res) => {
                expect(res).to.have.status(OK);
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.be.equals('Successfully returned a user');
                done();
              });
          });
      });
  });
});
describe('POST /api/v1/profiles/:username/follow', async () => {
  let user;
  let userToken;
  let follower;
  let followerToken;
  let followerUsername;

  before(async () => {
    let result;
    result = await models.User.findOne({
      include: [models.Profile]
    });
    user = result.get({ plain: true });
    user.password = 'secret';
    let response = await auth(user);
    userToken = response.body.token;

    result = await models.User.findByPk(2, {
      include: [models.Profile]
    });
    follower = result.get({ plain: true });
    follower.password = 'secret';
    response = await auth(follower);
    followerToken = response.body.token;
    followerUsername = follower.Profile.username;
  });

  it('should allow a user to follow another user', (done) => {
    chai
      .request(app)
      .post(`/api/v1/profiles/${followerUsername}/follow`)
      .set({ Authorization: `Bearer ${userToken}` })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(STATUS.OK);
        expect(res.body)
          .to.haveOwnProperty('message')
          .to.equal(`Successfully followed ${followerUsername}`);
        done();
      });
  });
  it('should get a list of user (followedUser) followers', (done) => {
    chai
      .request(app)
      .get('/api/v1/profiles/followers')
      .set({ Authorization: `Bearer ${followerToken}` })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(STATUS.OK);
        expect(res.body)
          .to.haveOwnProperty('data')
          .to.be.an('array')
          .lengthOf(1);
        done();
      });
  });
  it('should get a list of user following', (done) => {
    chai
      .request(app)
      .get('/api/v1/profiles/following')
      .set({ Authorization: `Bearer ${userToken}` })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(STATUS.OK);
        expect(res.body)
          .to.haveOwnProperty('data')
          .to.be.an('array')
          .lengthOf(1);
        done();
      });
  });
  it('should allow a user to unfollow user', (done) => {
    chai
      .request(app)
      .post(`/api/v1/profiles/${followerUsername}/unfollow`)
      .set({ Authorization: `Bearer ${userToken}` })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(STATUS.OK);
        expect(res.body)
          .to.haveOwnProperty('message')
          .to.equal(`Successfully unfollowed ${followerUsername}`);
        done();
      });
  });
  it('should not allow a user to follow self', (done) => {
    const { username } = user.Profile;
    chai
      .request(app)
      .post(`/api/v1/profiles/${username}/follow`)
      .set({ Authorization: `Bearer ${userToken}` })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(STATUS.BAD_REQUEST);
        expect(res.body)
          .to.haveOwnProperty('message')
          .to.equal(MESSAGE.FOLLOW_ERROR);
        done();
      });
  });
});
