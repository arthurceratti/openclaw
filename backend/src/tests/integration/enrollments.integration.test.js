import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../../app';
import db from '../../config/database';

describe('Integration Tests - Enrollments', () => {
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

  it('should enroll a student in a course', async () => {
    const enrollment = {
      student_id: 1,
      course_id: 1
    };

    const response = await request(app)
      .post('/enrollments')
      .set('Authorization', `Bearer ${authToken}`)
      .send(enrollment);

    expect(response.status).toBe(201);
    expect(response.body.enrollment.student_id).toBe(1);
    expect(response.body.enrollment.course_id).toBe(1);
  });

  it('should get an enrollment by ID', async () => {
    const response = await request(app)
      .get('/enrollments/1')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.enrollment.id).toBe(1);
  });

  it('should update an enrollment', async () => {
    const updatedEnrollment = {
      grade: 'A',
      grade_points: 4.0
    };

    const response = await request(app)
      .put('/enrollments/1')
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedEnrollment);

    expect(response.status).toBe(200);
    expect(response.body.enrollment.grade).toBe('A');
  });

  it('should delete an enrollment', async () => {
    const response = await request(app)
      .delete('/enrollments/1')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
  });

  it('should list all enrollments', async () => {
    const response = await request(app)
      .get('/enrollments')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.enrollments)).toBe(true);
  });

  it('should get student enrollments', async () => {
    const response = await request(app)
      .get('/students/1/enrollments')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.enrollments)).toBe(true);
  });

  it('should get course enrollments', async () => {
    const response = await request(app)
      .get('/courses/1/enrollments')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.enrollments)).toBe(true);
  });
});
