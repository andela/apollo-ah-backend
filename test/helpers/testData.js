import faker from 'faker';

const users = {
  dummyUser: {
    email: 'fejiro@gmail.com',
    password: 'password',
    username: 'feji2017',
    isConfirmed: false,
    roleId: 2,
  },
  dummyUser2: {
    email: 'white@gmail.com',
    password: 'password',
    username: 'whyte123',
    isConfirmed: false,
    roleId: 2,
  },
  dummyUser3: {
    email: 'valentine@andela.com',
    password: 'password',
    username: 'val123',
    isConfirmed: false,
    roleId: 2,
  },
  dummyUser4: {
    email: 'andra@gmail.com',
    password: 'password',
    username: 'andra2018',
    isConfirmed: false,
    roleId: 2,
  },
};

const article = {
  title: faker.lorem.words(10),
  description: faker.lorem.words(50),
  body: faker.lorem.words(50)
};

const newArticle = {
  title: faker.lorem.words(15),
  description: faker.lorem.words(50),
  body: 'I love boats'
};

const newComment = {
  body: 'This is a ask feedback',
};

const newUser = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  username: faker.internet.userName(),
};

export {
  newArticle,
  newComment,
  users,
  newUser,
  article,
};
