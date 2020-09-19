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

describe('Logging in', () => {
  test('Login success', async () => {
    const response = await api
      .post('/api/auth/login')
      .send({username: validAccount.username, password: validAccount.password})
      .expect(200);

    expect(response.body.token).toBeDefined();
    expect(response.body.profilePicture).toBeDefined();
    expect(response.body.profilePicture).toBe(null);
  });

  test("Login injection attempt fails", async () => {
    // Database is emptied beforeAll and only one user is created,
    // so this is valid
    const response = await api
      .post('/api/auth/login')
      .send({username: {$ne: ''}, password: validAccount.password})
      .expect(200);

    expect(response.body.token).not.toBeDefined();
  });

  test("Login failure with incorrect username", async () => {
    const response = await api
      .post('/api/auth/login')
      .send(validAccount)
      .send({username: 'invalidUsername', password: validAccount.password})
      .expect(200);

    expect(response.body.token).not.toBeDefined();
    expect(response.body).toEqual({message: 'invalid username or password'});
  });

  test("Login failure with incorrect password", async () => {
    const response = await api
      .post('/api/auth/login')
      .send(validAccount)
      .send({username: validAccount.username, password: '123'})
      .expect(200);

      expect(response.body.token).not.toBeDefined();
      expect(response.body).toEqual({message: 'invalid username or password'});
  });

  test("Login failure before email verification", async () => {
    await User.findOneAndUpdate({username: validAccount.username},
      {emailVerification: '123'}
    );
    const response = await api
      .post('/api/auth/login')
      .send(validAccount)
      .send({username: validAccount.username, password: validAccount.password})
      .expect(200);

    expect(response.body.token).not.toBeDefined();
    expect(response.body).toEqual({message: 'email not verified'});
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

  afterAll(() => {
    mongoose.connection.close();
  });
});
