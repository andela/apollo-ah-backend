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

describe('API end point for User profile', () => {
  after(() => models.Profile.destroy({ truncate: true }));
  it('it should create profile with correct details', (done) => {
    chai
      .request(app)
      .post('/api/v1/profile')
      .send(profile)
      .set('Authorization', token)
      .end((err, res) => {
        console.log(res);
        expect(res.status).eql(201);
        expect(res.body).to.have.property('message');
        expect(res.body.profile).to.be.an('object');
        expect(Object.keys(res.body.profile)).to.include.members([
          'firstname',
          'lastname',
          'username',
          'gender',
          'bio',
          'phone',
          'address',
          'image',
        ]);
        expect(res.body.profile.id).to.not.be.a('string');
        expect(res.body.profile.user_id).to.not.be.a('string');
        expect(res.body.message).to.be.equals('Profile created successfully');
        done();
      });
  });

  it('it should throw an error if firstname is not supplied', (done) => {
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

  it('it should throw an error if lastname is not supplied', (done) => {
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

  it('it should throw an error if username is not supplied', (done) => {
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

  it('it should throw an error if gender is not supplied', (done) => {
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

  it('it should throw an error if gender type is not M or F', (done) => {
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

  it('it should throw an error if bio is not provided', (done) => {
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

  it('it should throw an error if image url is invalid', (done) => {
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

  it('it should throw an error if phone number is invalid', (done) => {
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
