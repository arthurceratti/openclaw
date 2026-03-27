import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../../app';
import db from '../../config/database';

describe('Integration Tests - Courses', () => {
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

  it('should create a new course', async () => {
    const newCourse = {
      name: 'JavaScript Essentials',
      description: 'Learn JavaScript from scratch',
      instructor: 'John Doe',
      max_students: 50
    };

    const response = await request(app)
      .post('/courses')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newCourse);

    expect(response.status).toBe(201);
    expect(response.body.course.name).toBe('JavaScript Essentials');
    expect(response.body.course.max_students).toBe(50);
  });

  it('should get a course by ID', async () => {
    const response = await request(app)
      .get('/courses/1')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.course.id).toBe(1);
  });

  it('should update a course', async () => {
    const updatedCourse = {
      name: 'Advanced JavaScript',
      description: 'Master JavaScript concepts'
    };

    const response = await request(app)
      .put('/courses/1')
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedCourse);

    expect(response.status).toBe(200);
    expect(response.body.course.name).toBe('Advanced JavaScript');
  });

  it('should delete a course', async () => {
    const response = await request(app)
      .delete('/courses/1')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
  });

  it('should list all courses', async () => {
    const response = await request(app)
      .get('/courses')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.courses)).toBe(true);
  });

  it('should get course with enrolled students', async () => {
    const response = await request(app)
      .get('/courses/1')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.course.enrolled_students).toBeDefined();
  });
});
