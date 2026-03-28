import { test, expect } from '@playwright/test';
import { api } from '../../../src/api';

test.describe('Courses Performance Tests', () => {
  test('GET /courses - should list courses within acceptable time', async () => {
    const startTime = Date.now();
    const response = await api.get('/courses');
    const endTime = Date.now();
    
    expect(response.status).toBe(200);
    const executionTime = endTime - startTime;
    
    // Performance benchmark: should complete within 1000ms
    console.log(`GET /courses execution time: ${executionTime}ms`);
    expect(executionTime).toBeLessThan(1000);
    
    expect(Array.isArray(response.data)).toBe(true);
  });

  test('GET /courses/:id - should retrieve single course within acceptable time', async () => {
    const courseId = 1;
    const startTime = Date.now();
    const response = await api.get(`/courses/${courseId}`);
    const endTime = Date.now();
    
    expect(response.status).toBe(200);
    const executionTime = endTime - startTime;
    
    // Performance benchmark: should complete within 500ms
    console.log(`GET /courses/:${courseId} execution time: ${executionTime}ms`);
    expect(executionTime).toBeLessThan(500);
    
    expect(response.data.id).toBe(courseId);
  });

  test('POST /courses - should create course within acceptable time', async () => {
    const courseData = {
      name: 'Advanced Mathematics',
      code: 'MATH-301',
      description: 'Advanced calculus and linear algebra',
      maxStudents: 50
    };
    
    const startTime = Date.now();
    const response = await api.post('/courses', courseData);
    const endTime = Date.now();
    
    expect(response.status).toBe(201);
    const executionTime = endTime - startTime;
    
    // Performance benchmark: should complete within 800ms
    console.log(`POST /courses execution time: ${executionTime}ms`);
    expect(executionTime).toBeLessThan(800);
    
    expect(response.data.name).toBe(courseData.name);
  });

  test('PUT /courses/:id - should update course within acceptable time', async () => {
    const courseId = 1;
    const updateData = { name: 'Updated Course Name' };
    
    const startTime = Date.now();
    const response = await api.put(`/courses/${courseId}`, updateData);
    const endTime = Date.now();
    
    expect(response.status).toBe(200);
    const executionTime = endTime - startTime;
    
    // Performance benchmark: should complete within 600ms
    console.log(`PUT /courses/:${courseId} execution time: ${executionTime}ms`);
    expect(executionTime).toBeLessThan(600);
    
    expect(response.data.name).toBe(updateData.name);
  });

  test('DELETE /courses/:id - should delete course within acceptable time', async () => {
    const courseId = 999;
    
    const startTime = Date.now();
    const response = await api.delete(`/courses/${courseId}`);
    const endTime = Date.now();
    
    expect(response.status).toBe(204);
    const executionTime = endTime - startTime;
    
    // Performance benchmark: should complete within 400ms
    console.log(`DELETE /courses/:${courseId} execution time: ${executionTime}ms`);
    expect(executionTime).toBeLessThan(400);
  });

  test('GET /courses?search=math - should search courses within acceptable time', async () => {
    const startTime = Date.now();
    const response = await api.get('/courses?search=math');
    const endTime = Date.now();
    
    expect(response.status).toBe(200);
    const executionTime = endTime - startTime;
    
    // Performance benchmark: should complete within 700ms
    console.log(`GET /courses?search=math execution time: ${executionTime}ms`);
    expect(executionTime).toBeLessThan(700);
  });
});
