import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../../app';
import db from '../../config/database';

describe('Integration Tests - Students', () => {
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

  it('should create a new student', async () => {
    const newStudent = {
      name: 'Alice Student',
      email: 'alice@student.com',
      password: 'student123'
    };

    const response = await request(app)
      .post('/students')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newStudent);

    expect(response.status).toBe(201);
    expect(response.body.student.name).toBe('Alice Student');
    expect(response.body.student.email).toBe('alice@student.com');
  });

  it('should get a student by ID', async () => {
    const response = await request(app)
      .get('/students/1')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.student.id).toBe(1);
  });

  it('should update a student', async () => {
    const updatedStudent = {
      name: 'Alice Updated',
      email: 'alice.updated@student.com'
    };

    const response = await request(app)
      .put('/students/1')
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedStudent);

    expect(response.status).toBe(200);
    expect(response.body.student.name).toBe('Alice Updated');
  });

  it('should delete a student', async () => {
    const response = await request(app)
      .delete('/students/1')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
  });

  it('should list all students', async () => {
    const response = await request(app)
      .get('/students')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.students)).toBe(true);
  });

  it('should get student with enrolled courses', async () => {
    const response = await request(app)
      .get('/students/1')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.student.enrolled_courses).toBeDefined();
  });
});
