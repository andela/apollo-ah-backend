/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import jwt from 'jsonwebtoken';
import app from '../../../index';
import models from '../../../models';
import { STATUS } from '../../../helpers/constants';

chai.use(chaiHttp);

const {
  CREATED,
  BAD_REQUEST,
  OK,
  NOT_FOUND,
} = STATUS;

const profile = {
  firstname: faker.name.firstName(),
  lastname: faker.name.lastName(),
  phone: '+23438776199',
  bio: faker.random.words(),
  address: faker.address.streetAddress(),
  gender: 'M',
  userId: 1,
  username: faker.random.words(),
  image: faker.image.imageUrl(),
};

const userDummy = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  username: faker.random.words(5),
};

const token = `Bearer ${jwt.sign({ user: { id: 1 } }, 'secret', { expiresIn: '24hrs' })}`;

describe('Testing user profile feature', () => {
  after(() => models.Profile.destroy({ truncate: true }));
  it('should create profile when details are correct', async () => {
    try {
      const res = await chai.request(app)
        .post('/api/v1/profiles')
        .send(profile)
        .set('Authorization', token);
      expect(res).to.have.status(CREATED);
      expect(res.body).to.have.property('message');
      expect(res.body.data).to.be.an('object');
      expect(res.body.status).to.be.equals(true);
      expect(Object.keys(res.body.data)).to.include.members([
        'firstname',
        'lastname',
        'username',
        'gender',
        'bio',
        'phone',
        'address',
        'image',
      ]);
      expect(res.body.data.id).to.not.be.a('string');
      expect(res.body.data.userId).to.not.be.a('string');
      expect(res.body.message).to.be.equals('Profile created successfully');
    } catch (err) {
      expect(err).to.not.be.null;
    }
  });

  it('should return an error if firstname is not provided', (done) => {
    chai
      .request(app)
      .post('/api/v1/profiles')
      .send({ ...profile, firstname: '' })
      .set('Authorization', token)
      .end((err, res) => {
        expect(res.status).eql(BAD_REQUEST);
        expect(res.body.data[0]).to.have.property('errors');
        expect(res.body.data[0].errors).to.have.property('firstname');
        expect(res.body.data[0].errors.firstname).to.be.equals('Firstname is required');
        done();
      });
  });

  it('should return an error if lastname is not provided', (done) => {
    chai
      .request(app)
      .post('/api/v1/profiles')
      .send({ ...profile, lastname: '' })
      .set('Authorization', token)
      .end((err, res) => {
        expect(res.status).eql(BAD_REQUEST);
        expect(res.body.data[0]).to.have.property('errors');
        expect(res.body.data[0].errors).to.have.property('lastname');
        expect(res.body.data[0].errors.lastname).to.be.equals('Lastname is required');
        done();
      });
  });

  it('should return error if username is not provided', (done) => {
    chai
      .request(app)
      .post('/api/v1/profiles')
      .send({ ...profile, username: '' })
      .set('Authorization', token)
      .end((err, res) => {
        expect(res.status).eql(BAD_REQUEST);
        expect(res.body.data[0]).to.have.property('errors');
        expect(res.body.data[0].errors).to.have.property('username');
        expect(res.body.data[0].errors.username).to.be.equals('username field cannot be emnpty');
        done();
      });
  });

  it('should throw an error if bio is not provided', (done) => {
    chai
      .request(app)
      .post('/api/v1/profiles')
      .send({ ...profile, bio: '' })
      .set('Authorization', token)
      .end((err, res) => {
        expect(res.status).eql(BAD_REQUEST);
        expect(res.body.data[0]).to.have.property('errors');
        expect(res.body.data[0].errors).to.have.property('bio');
        expect(res.body.data[0].errors.bio).to.be.equals('Please provide a brief description about yourself');
        done();
      });
  });

  it('should throw an error if image url is invalid', (done) => {
    chai
      .request(app)
      .post('/api/v1/profiles')
      .send({ ...profile, image: 'hffhh.cam' })
      .set('Authorization', token)
      .end((err, res) => {
        expect(res.status).eql(BAD_REQUEST);
        expect(res.body.data[0]).to.have.property('errors');
        expect(res.body.data[0].errors).to.have.property('image');
        expect(res.body.data[0].errors.image).to.be.equals('image URL is not valid');
        done();
      });
  });

  it('should fetch all users', (done) => {
    chai
      .request(app)
      .get('/api/v1/profiles')
      .set('Authorization', token)
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
      .set('Authorization', token)
      .end((err, res) => {
        expect(res).to.have.status(NOT_FOUND);
        expect(res.body.code).eql(NOT_FOUND);
        expect(res.body.message).eql('This user does not exist');
        done();
      });
  });

  it('should fetch a user successfully', (done) => {
    models.User.create(userDummy)
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
          username: userDummy.username,
        })
          .then((newProfile) => {
            const theUsername = newProfile.dataValues.username;
            chai
              .request(app)
              .get(`/api/v1/profiles/${theUsername}`)
              .set('Authorization', token)
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
