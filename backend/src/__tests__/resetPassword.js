const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const User = require('../models/User');
const { hashPassword } = require('../utils/auth');

const api = supertest(app);

const validAccount = {
  username: 'test123',
  password: 'asdASD123',
  firstName: 'Test',
  lastName: 'Account',
  email: 'test@example.com'
};

describe('Resetting password', () => {
  test('With invalid email', async () => {
    const response = await api
      .post('/api/auth/forgotPassword')
      .send({email: 'emailShouldNotExist'})
      .expect(400);

    expect(response.body).toBe(false);
  });

  test('Success with valid email', async () => {
    const response = await api
      .post('/api/auth/forgotPassword')
      .send({email: validAccount.email})
      .expect(200);

    expect(response.body).toBe(true);
  });

  test('Account password is reset', async () => {
    const user = await User.findOne({email: validAccount.email});

    expect (user.password).toBe(null);
    expect (user.emailVerification).not.toBe(null);
    emailVerification = user.emailVerification;
  });

  beforeAll(async done => {
    await User.deleteMany({});
    const hashedPassword = await hashPassword(validAccount.password);
    const user = User({...validAccount, password: hashedPassword});
    const res = await user.save();
    if (res) {
      done();
    }
  });
});

describe('Setting a new password', () => {
  let userInDB = null;

  test('Can\'t set a new password with invalid code', async () => {
    const response = await api
      .patch(`/api/auth/forgotPassword/${userInDB._id}?code=${userInDB.emailVerification}`)
      .send({password: validAccount.password, confirmPassword: validAccount.password})
      .expect(400);

    expect(response.body).toBe(null);
  });

  test('Password is reset when all details are correct', async () => {
    console.warn(`/api/auth/forgotPassword/${userInDB._id}?code=${userInDB.emailVerification}`);
    const response = await api
      .patch(`/api/auth/forgotPassword/${userInDB._id}&code=${userInDB.emailVerification}`)
      .send({password: validAccount.password, confirmPassword: validAccount.password})
      .expect(200);

    expect(response.body).toBe(true);
  });

  beforeAll(async () => {
    userInDB = await User.findOne({
      email: validAccount.email
    });
  });

  afterAll(() => {
    mongoose.connection.close();
  })
});
