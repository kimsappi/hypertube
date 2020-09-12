const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const User = require('../models/User');

const api = supertest(app);

const validAccount = {
  username: 'test123',
  password: 'asdASD123',
  firstName: 'Test',
  lastName: 'Account',
  email: 'test@example.com'
};

describe('Registration', () => {
  test('Account can be created', async () => {
    const response = await api
      .post('/api/auth/register')
      .send(validAccount)
      .expect(201);

    expect(response.body).toBe(true);
  });

  test("Can't create another account with same unique fields", async () => {
    const response = await api
      .post('/api/auth/register')
      .send(validAccount)
      .expect(400);

    expect(response.body).toBe(false);
  });

  test("Can't create account with a missing field", async () => {
    const {username, ...missingUsername} = validAccount;
    const response = await api
      .post('/api/auth/register')
      .send({...missingUsername, email: 'test2@example.com'})
      .expect(400);

    expect(response.body).toBe(false);
  });

  test("Can't create account with a weak password", async () => {
    const response = await api
      .post('/api/auth/register')
      .send({...validAccount, email: 'test2@example.com', password: '123asd123'})
      .expect(400);

    expect(response.body).toBe(false);
  });

  beforeAll(async () => {
    await User.deleteMany({});
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
