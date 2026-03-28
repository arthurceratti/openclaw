import { test, expect } from '@playwright/test';
import { api } from '../../../src/api';

test.describe('Enrollments Performance Tests', () => {
  test('GET /enrollments - should list enrollments within acceptable time', async () => {
    const startTime = Date.now();
    const response = await api.get('/enrollments');
    const endTime = Date.now();
    
    expect(response.status).toBe(200);
    const executionTime = endTime - startTime;
    
    // Performance benchmark: should complete within 1000ms
    console.log(`GET /enrollments execution time: ${executionTime}ms`);
    expect(executionTime).toBeLessThan(1000);
    
    expect(Array.isArray(response.data)).toBe(true);
  });

  test('GET /enrollments/:id - should retrieve single enrollment within acceptable time', async () => {
    const enrollmentId = 1;
    const startTime = Date.now();
    const response = await api.get(`/enrollments/${enrollmentId}`);
    const endTime = Date.now();
    
    expect(response.status).toBe(200);
    const executionTime = endTime - startTime;
    
    // Performance benchmark: should complete within 500ms
    console.log(`GET /enrollments/:${enrollmentId} execution time: ${executionTime}ms`);
    expect(executionTime).toBeLessThan(500);
    
    expect(response.data.id).toBe(enrollmentId);
  });

  test('POST /enrollments - should enroll student in course within acceptable time', async () => {
    const enrollmentData = {
      studentId: 1,
      courseId: 1,
      gradeLevel: 'A'
    };
    
    const startTime = Date.now();
    const response = await api.post('/enrollments', enrollmentData);
    const endTime = Date.now();
    
    expect(response.status).toBe(201);
    const executionTime = endTime - startTime;
    
    // Performance benchmark: should complete within 800ms
    console.log(`POST /enrollments execution time: ${executionTime}ms`);
    expect(executionTime).toBeLessThan(800);
    
    expect(response.data.studentId).toBe(enrollmentData.studentId);
    expect(response.data.courseId).toBe(enrollmentData.courseId);
  });

  test('PUT /enrollments/:id - should update enrollment within acceptable time', async () => {
    const enrollmentId = 1;
    const updateData = { gradeLevel: 'B' };
    
    const startTime = Date.now();
    const response = await api.put(`/enrollments/${enrollmentId}`, updateData);
    const endTime = Date.now();
    
    expect(response.status).toBe(200);
    const executionTime = endTime - startTime;
    
    // Performance benchmark: should complete within 600ms
    console.log(`PUT /enrollments/:${enrollmentId} execution time: ${executionTime}ms`);
    expect(executionTime).toBeLessThan(600);
    
    expect(response.data.gradeLevel).toBe(updateData.gradeLevel);
  });

  test('DELETE /enrollments/:id - should drop from course within acceptable time', async () => {
    const enrollmentId = 999;
    
    const startTime = Date.now();
    const response = await api.delete(`/enrollments/${enrollmentId}`);
    const endTime = Date.now();
    
    expect(response.status).toBe(204);
    const executionTime = endTime - startTime;
    
    // Performance benchmark: should complete within 400ms
    console.log(`DELETE /enrollments/:${enrollmentId} execution time: ${executionTime}ms`);
    expect(executionTime).toBeLessThan(400);
  });

  test('GET /enrollments?studentId=1 - should filter by student within acceptable time', async () => {
    const startTime = Date.now();
    const response = await api.get('/enrollments?studentId=1');
    const endTime = Date.now();
    
    expect(response.status).toBe(200);
    const executionTime = endTime - startTime;
    
    // Performance benchmark: should complete within 700ms
    console.log(`GET /enrollments?studentId=1 execution time: ${executionTime}ms`);
    expect(executionTime).toBeLessThan(700);
  });

  test('GET /enrollments?courseId=1 - should filter by course within acceptable time', async () => {
    const startTime = Date.now();
    const response = await api.get('/enrollments?courseId=1');
    const endTime = Date.now();
    
    expect(response.status).toBe(200);
    const executionTime = endTime - startTime;
    
    // Performance benchmark: should complete within 700ms
    console.log(`GET /enrollments?courseId=1 execution time: ${executionTime}ms`);
    expect(executionTime).toBeLessThan(700);
  });

  test('GET /enrollments/stats - should get enrollment statistics within acceptable time', async () => {
    const startTime = Date.now();
    const response = await api.get('/enrollments/stats');
    const endTime = Date.now();
    
    expect(response.status).toBe(200);
    const executionTime = endTime - startTime;
    
    // Performance benchmark: should complete within 600ms
    console.log(`GET /enrollments/stats execution time: ${executionTime}ms`);
    expect(executionTime).toBeLessThan(600);
  });
});
