import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../../app';
import db from '../../config/database';

describe('Integration Tests - Users', () => {
  let authToken;

  beforeAll(async () => {
    // Connect to database
    await db.authenticate();
    
    // Get admin token for authenticated requests
    const response = await request(app)
      .get('/auth/login')
      .send({ email: 'admin@admin.com', password: 'admin123' });
    
    authToken = response.body.token;
  });

  afterAll(async () => {
    // Close database connection
    await db.close();
  });

  it('should create a new user', async () => {
    const newUser = {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newUser);

    expect(response.status).toBe(201);
    expect(response.body.user.name).toBe('Test User');
    expect(response.body.user.email).toBe('testuser@example.com');
  });

  it('should get a user by ID', async () => {
    const response = await request(app)
      .get('/users/1')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.user.id).toBe(1);
  });

  it('should update a user', async () => {
    const updatedUser = {
      name: 'Updated Name',
      email: 'updated@example.com'
    };

    const response = await request(app)
      .put('/users/1')
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedUser);

    expect(response.status).toBe(200);
    expect(response.body.user.name).toBe('Updated Name');
  });

  it('should delete a user', async () => {
    const response = await request(app)
      .delete('/users/1')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
  });

  it('should list all users', async () => {
    const response = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.users)).toBe(true);
  });
});
