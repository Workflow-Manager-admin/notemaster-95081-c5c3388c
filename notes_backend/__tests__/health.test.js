const request = require('supertest');
const app = require('../src/app');
const { resetDataFiles } = require('./testUtils');

/**
 * Test Suite: Health Endpoint
 */

describe('Health Endpoint', () => {
  beforeEach(() => resetDataFiles());

  it('should return status ok', async () => {
    const res = await request(app)
      .get('/')
      .expect(200);

    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('message', 'Service is healthy');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('environment');
  });
});
