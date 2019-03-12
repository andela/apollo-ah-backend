import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import models from '../../models';
import ProfileController from '../../controllers/profileController';

chai.use(chaiHttp);

describe('usernameExists function', () => {
  it('should return true if username exists', async () => {
    const dummyUser = {
      email: faker.internet.email(),
      password: 'l23456787960',
      username: 'hddjjhfjuieiu',
      firstname: '',
      lastname: '',
      bio: '',
      gender: '',
    };
    const { dataValues: { id } } = await models.User.create(dummyUser);
    dummyUser.user_id = id;
    await models.Profile.create(dummyUser);
    const userExists = await (ProfileController.usernameExists(dummyUser.username));
    expect(userExists).to.equal(true);
  });
  it('should return false if username does not exists', async () => {
    const dummyUser = {
      email: faker.internet.email(),
      password: 'l23456787960',
      username: 'DOES_NOT_EXISTS',
      firstname: '',
      lastname: '',
      bio: '',
      gender: '',
    };
    const userExists = await (ProfileController.usernameExists(dummyUser.username));
    expect(userExists).to.equal(false);
  });
});
