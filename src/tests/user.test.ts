import request from 'supertest';
import app from '../index';
import { users } from '../models/User';

describe('User API', () => {
  beforeEach(() => {
    users.length = 0;
  });

  it('should fetch all users (initially empty)', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ username: 'John', age: 30, hobbies: ['reading'] });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.username).toEqual('John');
    expect(res.body.age).toEqual(30);
    expect(res.body.hobbies).toEqual(['reading']);
  });

  it('should not create a user without required fields', async () => {
    const res = await request(app).post('/api/users').send({ username: 'John' });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Required fields are missing');
  });

  it('should fetch a user by ID', async () => {
    const newUserRes = await request(app)
      .post('/api/users')
      .send({ username: 'Jane', age: 25, hobbies: ['dancing'] });

    const userId = newUserRes.body.id;
    const res = await request(app).get(`/api/users/${userId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', userId);
    expect(res.body.username).toEqual('Jane');
  });

  it('should return 404 for a non-existing user', async () => {
    const res = await request(app).get('/api/users/non-existing-id');
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual('User not found');
  });

  it('should return 400 for invalid user ID format', async () => {
    const res = await request(app).get('/api/users/invalid-id');
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Invalid userId format');
  });

  it('should update an existing user', async () => {
    const newUserRes = await request(app)
      .post('/api/users')
      .send({ username: 'Jake', age: 28, hobbies: ['cycling'] });

    const userId = newUserRes.body.id;
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .send({ username: 'Jack', age: 29, hobbies: ['swimming'] });

    expect(res.statusCode).toEqual(200);
    expect(res.body.username).toEqual('Jack');
    expect(res.body.age).toEqual(29);
    expect(res.body.hobbies).toEqual(['swimming']);
  });

  it('should return 404 when updating a non-existing user', async () => {
    const res = await request(app)
      .put('/api/users/non-existing-id')
      .send({ username: 'Jack', age: 29, hobbies: ['swimming'] });

    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual('User not found');
  });

  it('should return 400 for invalid user ID format when updating', async () => {
    const res = await request(app)
      .put('/api/users/invalid-id')
      .send({ username: 'Jack', age: 29, hobbies: ['swimming'] });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Invalid userId format');
  });

  it('should delete a user by ID', async () => {
    const newUserRes = await request(app)
      .post('/api/users')
      .send({ username: 'John', age: 30, hobbies: ['reading'] });

    const userId = newUserRes.body.id;
    const res = await request(app).delete(`/api/users/${userId}`);
    expect(res.statusCode).toEqual(204);
  });

  it('should return 404 for deleting a non-existing user', async () => {
    const res = await request(app).delete('/api/users/non-existing-id');
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual('User not found');
  });

  it('should return 400 for invalid user ID format when deleting', async () => {
    const res = await request(app).delete('/api/users/invalid-id');
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Invalid userId format');
  });

  it('should return 404 for non-existing endpoint', async () => {
    const res = await request(app).get('/api/non-existing-endpoint');
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual('Endpoint not found');
  });
});
