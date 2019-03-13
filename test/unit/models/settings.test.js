import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import models from '../../../models/index';

chai.use(chaiHttp);

describe('Settings Model', () => {
  it('should create a user with settings', async () => {
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
    const data = models.Setting.create({ user_id: dummyUser.user_id });
    expect(data).to.be.an('object');
  });
});
