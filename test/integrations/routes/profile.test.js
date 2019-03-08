/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import jwt from 'jsonwebtoken';
import app from '../../../index';
import models from '../../../models';

chai.use(chaiHttp);

const profile = {
  firstname: faker.name.firstName(),
  lastname: faker.name.lastName(),
  phone: '+23438776199',
  bio: faker.random.words(),
  address: faker.address.streetAddress(),
  gender: 'M',
  user_id: 1,
  username: faker.random.words(),
  image: faker.image.imageUrl(),
};

const token = `Bearer ${jwt.sign({ user: { id: 1 } }, 'secret', { expiresIn: '24hrs' })}`;

describe('Testing user profile feature', () => {
  after(() => models.Profile.destroy({ truncate: true }));
  it('should create profile when details are correct', (done) => {
    chai
      .request(app)
      .post('/api/v1/profile')
      .send(profile)
      .set('Authorization', token)
      .end((err, res) => {
        expect(res).to.have.status(201);
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
        expect(res.body.data.user_id).to.not.be.a('string');
        expect(res.body.message).to.be.equals('Profile created successfully');
        done();
      });
  });

  it('should return an error if firstname is not provided', (done) => {
    chai
      .request(app)
      .post('/api/v1/profile')
      .send({ ...profile, firstname: '' })
      .set('Authorization', token)
      .end((err, res) => {
        expect(res.status).eql(400);
        expect(res.body).to.have.property('errors');
        expect(Object.keys(res.body.errors)).to.include.members(['firstname']);
        expect(res.body.errors.firstname).to.be.equals('Firstname is required');
        done();
      });
  });

  it('should return an error if lastname is not provided', (done) => {
    chai
      .request(app)
      .post('/api/v1/profile')
      .send({ ...profile, lastname: '' })
      .set('Authorization', token)
      .end((err, res) => {
        expect(res.status).eql(400);
        expect(res.body).to.have.property('errors');
        expect(Object.keys(res.body.errors)).to.include.members(['lastname']);
        expect(res.body.errors.lastname).to.be.equals('Lastname is required');
        done();
      });
  });

  it('should return error if username is not provided', (done) => {
    chai
      .request(app)
      .post('/api/v1/profile')
      .send({ ...profile, username: '' })
      .set('Authorization', token)
      .end((err, res) => {
        expect(res.status).eql(400);
        expect(res.body).to.have.property('errors');
        expect(Object.keys(res.body.errors)).to.include.members(['username']);
        expect(res.body.errors.username).to.be.equals('username field cannot be emnpty');
        done();
      });
  });

  it('should throw an error if gender is not provided', (done) => {
    chai
      .request(app)
      .post('/api/v1/profile')
      .send({ ...profile, gender: '' })
      .set('Authorization', token)
      .end((err, res) => {
        expect(res.status).eql(400);
        expect(res.body).to.have.property('errors');
        expect(Object.keys(res.body.errors)).to.include.members(['gender']);
        expect(res.body.errors.gender).to.be.equals('Gender is required');
        done();
      });
  });

  it('should throw an error if gender type is not M or F', (done) => {
    chai
      .request(app)
      .post('/api/v1/profile')
      .send({ ...profile, gender: 'male' })
      .set('Authorization', token)
      .end((err, res) => {
        expect(res.status).eql(400);
        expect(res.body).to.have.property('errors');
        expect(Object.keys(res.body.errors)).to.include.members(['genderType']);
        expect(res.body.errors.genderType).to.be.equals('Gender must either be M or F');
        done();
      });
  });

  it('should throw an error if bio is not provided', (done) => {
    chai
      .request(app)
      .post('/api/v1/profile')
      .send({ ...profile, bio: '' })
      .set('Authorization', token)
      .end((err, res) => {
        expect(res.status).eql(400);
        expect(res.body).to.have.property('errors');
        expect(Object.keys(res.body.errors)).to.include.members(['bio']);
        expect(res.body.errors.bio).to.be.equals('Please provide a brief description about yourself');
        done();
      });
  });

  it('should throw an error if image url is invalid', (done) => {
    chai
      .request(app)
      .post('/api/v1/profile')
      .send({ ...profile, image: 'hffhh.cam' })
      .set('Authorization', token)
      .end((err, res) => {
        expect(res.status).eql(400);
        expect(res.body).to.have.property('errors');
        expect(Object.keys(res.body.errors)).to.include.members(['image']);
        expect(res.body.errors.image).to.be.equals('image URL is not valid');
        done();
      });
  });

  it('should throw an error if phone number is invalid', (done) => {
    chai
      .request(app)
      .post('/api/v1/profile')
      .send({ ...profile, phone: '0292922' })
      .set('Authorization', token)
      .end((err, res) => {
        expect(res.status).eql(400);
        expect(res.body).to.have.property('errors');
        expect(Object.keys(res.body.errors)).to.include.members(['phone', 'phoneLength']);
        expect(res.body.errors.phone).to.be.equals('Phone number should have a country code and not contain alphabets e.g +234');
        expect(res.body.errors.phoneLength).to.be.equals('Phone number length should adhere to international standard');
        done();
      });
  });
});
