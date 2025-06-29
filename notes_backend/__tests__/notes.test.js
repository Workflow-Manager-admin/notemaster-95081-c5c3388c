const request = require('supertest');
const app = require('../src/app');
const { resetDataFiles } = require('./testUtils');

/**
 * Test Suite: Notes CRUD API Tests
 * Based on Recipe App PDF strategy for E2E CRUD, validation, and isolation.
 */
describe('Notes API CRUD Integration', () => {
  const username = `noteuser_${Date.now()}_${Math.floor(Math.random()*10000)}`;
  const password = 'NotePass123';
  let token = '';
  let userId = '';

  beforeEach(async () => {
    resetDataFiles();
    await request(app).post('/api/signup').send({ username, password });
    const res = await request(app).post('/api/login').send({ username, password });
    token = res.body.token;
    userId = res.body.user.id;
  });

  it('should create a note', async () => {
    const res = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Note', content: 'Content' })
      .expect(201);

    expect(res.body.title).toBe('Test Note');
    expect(res.body.content).toBe('Content');
    expect(res.body.userId).toBe(userId);
  });

  it('should require auth for notes endpoints', async () => {
    await request(app)
      .post('/api/notes')
      .send({ title: 'T', content: 'C' })
      .expect(401);

    await request(app)
      .get('/api/notes')
      .expect(401);
  });

  it('should validate note creation input', async () => {
    const res = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(400);

    expect(res.body.message).toMatch(/Title or content required/);
  });

  it('should fetch user notes', async () => {
    await request(app).post('/api/notes').set('Authorization', `Bearer ${token}`).send({ title: 'A' });
    const res = await request(app)
      .get('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe('A');
  });

  it('should update a note by id', async () => {
    const create = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Old', content: 'X' });
    const noteId = create.body.id;

    const res = await request(app)
      .put(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'New Title', content: 'Y' })
      .expect(200);

    expect(res.body.title).toBe('New Title');
    expect(res.body.content).toBe('Y');
  });

  it('should 404 on update/delete/get wrong id', async () => {
    const fakeId = 'fake-' + Date.now();
    await request(app)
      .put(`/api/notes/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'T' })
      .expect(404);

    await request(app)
      .get(`/api/notes/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);

    await request(app)
      .delete(`/api/notes/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });

  it('should delete a note', async () => {
    const create = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'DEL' });
    const noteId = create.body.id;

    await request(app)
      .delete(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    // Should now 404
    await request(app)
      .get(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });

  it('should prevent cross-user note access', async () => {
    // Create with user1
    const note = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Private' });

    // Signup/login as another user
    const user2 = `another_${Date.now()}`;
    await request(app).post('/api/signup').send({ username: user2, password: 'xx' });
    const login2 = await request(app).post('/api/login').send({ username: user2, password: 'xx' });
    const token2 = login2.body.token;

    // Cannot see other's note
    await request(app)
      .get(`/api/notes/${note.body.id}`)
      .set('Authorization', `Bearer ${token2}`)
      .expect(404);

    // Cannot update other's note
    await request(app)
      .put(`/api/notes/${note.body.id}`)
      .set('Authorization', `Bearer ${token2}`)
      .send({ title: 'Should fail' })
      .expect(404);

    // Cannot delete other's note
    await request(app)
      .delete(`/api/notes/${note.body.id}`)
      .set('Authorization', `Bearer ${token2}`)
      .expect(404);
  });
});
