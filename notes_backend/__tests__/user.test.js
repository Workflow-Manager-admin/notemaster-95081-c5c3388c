const request = require('supertest');
const app = require('../src/app');
const { resetDataFiles } = require('./testUtils');

/**
 * Test Suite: User Authentication and Profile Tests
 * Inspired by the Recipe App Testing Strategy.
 */

describe('User API Authentication & Profile', () => {
  const username = `testuser_${Date.now()}_${Math.floor(Math.random()*10000)}`;
  const password = 'TestPass123';
  let token = '';

  beforeEach(() => {
    resetDataFiles();
  });

  it('should signup successfully', async () => {
    const res = await request(app)
      .post('/api/signup')
      .send({ username, password })
      .expect(201);

    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.username).toBe(username);
  });

  it('should forbid duplicate username signup', async () => {
    await request(app).post('/api/signup').send({ username, password });
    const res = await request(app)
      .post('/api/signup')
      .send({ username, password: 'somethingelse' })
      .expect(400);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/already exists/);
  });

  it('should login with correct credentials', async () => {
    await request(app).post('/api/signup').send({ username, password });
    const res = await request(app)
      .post('/api/login')
      .send({ username, password })
      .expect(200);

    expect(res.body).toHaveProperty('token');
    expect(res.body.user.username).toBe(username);
    token = res.body.token;
  });

  it('should reject login with wrong password', async () => {
    await request(app).post('/api/signup').send({ username, password });
    await request(app)
      .post('/api/login')
      .send({ username, password: 'wrongpass' })
      .expect(401);
  });

  it('should get current user profile with valid token', async () => {
    await request(app).post('/api/signup').send({ username, password });
    const login = await request(app).post('/api/login').send({ username, password });
    const jwt = login.body.token;

    const res = await request(app)
      .get('/api/me')
      .set('Authorization', `Bearer ${jwt}`)
      .expect(200);

    expect(res.body).toHaveProperty('id');
    expect(res.body.username).toBe(username);
  });

  it('should reject unauthenticated /api/me', async () => {
    await request(app)
      .get('/api/me')
      .expect(401);
  });
});
