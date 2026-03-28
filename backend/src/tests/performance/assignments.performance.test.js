import { test, expect } from '@playwright/test';
import { api } from '../../../src/api';

test.describe('Assignments Performance Tests', () => {
  test('GET /assignments - should list assignments within acceptable time', async () => {
    const startTime = Date.now();
    const response = await api.get('/assignments');
    const endTime = Date.now();
    
    expect(response.status).toBe(200);
    const executionTime = endTime - startTime;
    
    // Performance benchmark: should complete within 1000ms
    console.log(`GET /assignments execution time: ${executionTime}ms`);
    expect(executionTime).toBeLessThan(1000);
    
    expect(Array.isArray(response.data)).toBe(true);
  });

  test('GET /assignments/:id - should retrieve single assignment within acceptable time', async () => {
    const assignmentId = 1;
    const startTime = Date.now();
    const response = await api.get(`/assignments/${assignmentId}`);
    const endTime = Date.now();
    
    expect(response.status).toBe(200);
    const executionTime = endTime - startTime;
    
    // Performance benchmark: should complete within 500ms
    console.log(`GET /assignments/:${assignmentId} execution time: ${executionTime}ms`);
    expect(executionTime).toBeLessThan(500);
    
    expect(response.data.id).toBe(assignmentId);
  });

  test('POST /assignments - should create assignment within acceptable time', async () => {
    const assignmentData = {
      name: 'Final Project',
      description: 'Complete final project submission',
      dueDate: '2026-06-01',
      maxPoints: 100,
      courseId: 1
    };
    
    const startTime = Date.now();
    const response = await api.post('/assignments', assignmentData);
    const endTime = Date.now();
    
    expect(response.status).toBe(201);
    const executionTime = endTime - startTime;
    
    // Performance benchmark: should complete within 800ms
    console.log(`POST /assignments execution time: ${executionTime}ms`);
    expect(executionTime).toBeLessThan(800);
    
    expect(response.data.name).toBe(assignmentData.name);
  });

  test('PUT /assignments/:id - should update assignment within acceptable time', async () => {
    const assignmentId = 1;
    const updateData = { name: 'Updated Assignment Name' };
    
    const startTime = Date.now();
    const response = await api.put(`/assignments/${assignmentId}`, updateData);
    const endTime = Date.now();
    
    expect(response.status).toBe(200);
    const executionTime = endTime - startTime;
    
    // Performance benchmark: should complete within 600ms
    console.log(`PUT /assignments/:${assignmentId} execution time: ${executionTime}ms`);
    expect(executionTime).toBeLessThan(600);
    
    expect(response.data.name).toBe(updateData.name);
  });

  test('DELETE /assignments/:id - should delete assignment within acceptable time', async () => {
    const assignmentId = 999;
    
    const startTime = Date.now();
    const response = await api.delete(`/assignments/${assignmentId}`);
    const endTime = Date.now();
    
    expect(response.status).toBe(204);
    const executionTime = endTime - startTime;
    
    // Performance benchmark: should complete within 400ms
    console.log(`DELETE /assignments/:${assignmentId} execution time: ${executionTime}ms`);
    expect(executionTime).toBeLessThan(400);
  });

  test('GET /assignments?courseId=1 - should filter by course within acceptable time', async () => {
    const startTime = Date.now();
    const response = await api.get('/assignments?courseId=1');
    const endTime = Date.now();
    
    expect(response.status).toBe(200);
    const executionTime = endTime - startTime;
    
    // Performance benchmark: should complete within 700ms
    console.log(`GET /assignments?courseId=1 execution time: ${executionTime}ms`);
    expect(executionTime).toBeLessThan(700);
  });

  test('GET /assignments/:id/submit - should submit assignment within acceptable time', async () => {
    const assignmentId = 1;
    const submissionData = {
      fileName: 'project.pdf',
      content: 'Project content here'
    };
    
    const startTime = Date.now();
    const response = await api.post(`/assignments/${assignmentId}/submit`, submissionData);
    const endTime = Date.now();
    
    expect(response.status).toBe(201);
    const executionTime = endTime - startTime;
    
    // Performance benchmark: should complete within 900ms
    console.log(`POST /assignments/:${assignmentId}/submit execution time: ${executionTime}ms`);
    expect(executionTime).toBeLessThan(900);
  });
});
