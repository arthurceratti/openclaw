import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../../app';
import db from '../../config/database';

describe('Integration Tests - Assignments', () => {
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

  it('should create a new assignment', async () => {
    const newAssignment = {
      title: 'First Assignment',
      description: 'Complete the initial project',
      course_id: 1,
      due_date: '2026-04-01',
      max_points: 100
    };

    const response = await request(app)
      .post('/assignments')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newAssignment);

    expect(response.status).toBe(201);
    expect(response.body.assignment.title).toBe('First Assignment');
    expect(response.body.assignment.max_points).toBe(100);
  });

  it('should get an assignment by ID', async () => {
    const response = await request(app)
      .get('/assignments/1')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.assignment.id).toBe(1);
  });

  it('should update an assignment', async () => {
    const updatedAssignment = {
      title: 'Updated Assignment',
      description: 'Revised project requirements',
      max_points: 120
    };

    const response = await request(app)
      .put('/assignments/1')
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedAssignment);

    expect(response.status).toBe(200);
    expect(response.body.assignment.title).toBe('Updated Assignment');
  });

  it('should delete an assignment', async () => {
    const response = await request(app)
      .delete('/assignments/1')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
  });

  it('should list all assignments', async () => {
    const response = await request(app)
      .get('/assignments')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.assignments)).toBe(true);
  });

  it('should get assignment with submissions', async () => {
    const response = await request(app)
      .get('/assignments/1')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.assignment.submissions).toBeDefined();
  });
});
