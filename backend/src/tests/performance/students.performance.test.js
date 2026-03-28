import { test, expect } from '@playwright/test';
import { api } from '../../../src/api';

test.describe('Students Performance Tests', () => {
  test('GET /students - should list students within acceptable time', async () => {
    const startTime = Date.now();
    const response = await api.get('/students');
    const endTime = Date.now();
    
    expect(response.status).toBe(200);
    const executionTime = endTime - startTime;
    
    // Performance benchmark: should complete within 1000ms
    console.log(`GET /students execution time: ${executionTime}ms`);
    expect(executionTime).toBeLessThan(1000);
    
    expect(Array.isArray(response.data)).toBe(true);
  });

  test('GET /students/:id - should retrieve single student within acceptable time', async () => {
    const studentId = 1;
    const startTime = Date.now();
    const response = await api.get(`/students/${studentId}`);
    const endTime = Date.now();
    
    expect(response.status).toBe(200);
    const executionTime = endTime - startTime;
    
    // Performance benchmark: should complete within 500ms
    console.log(`GET /students/:${studentId} execution time: ${executionTime}ms`);
    expect(executionTime).toBeLessThan(500);
    
    expect(response.data.id).toBe(studentId);
  });

  test('POST /students - should create student within acceptable time', async () => {
    const studentData = {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      birthDate: '2006-05-15',
      role: 'student',
      grade: 10
    };
    
    const startTime = Date.now();
    const response = await api.post('/students', studentData);
    const endTime = Date.now();
    
    expect(response.status).toBe(201);
    const executionTime = endTime - startTime;
    
    // Performance benchmark: should complete within 800ms
    console.log(`POST /students execution time: ${executionTime}ms`);
    expect(executionTime).toBeLessThan(800);
    
    expect(response.data.name).toBe(studentData.name);
  });

  test('PUT /students/:id - should update student within acceptable time', async () => {
    const studentId = 1;
    const updateData = { name: 'Updated Student Name' };
    
    const startTime = Date.now();
    const response = await api.put(`/students/${studentId}`, updateData);
    const endTime = Date.now();
    
    expect(response.status).toBe(200);
    const executionTime = endTime - startTime;
    
    // Performance benchmark: should complete within 600ms
    console.log(`PUT /students/:${studentId} execution time: ${executionTime}ms`);
    expect(executionTime).toBeLessThan(600);
    
    expect(response.data.name).toBe(updateData.name);
  });

  test('DELETE /students/:id - should delete student within acceptable time', async () => {
    const studentId = 999;
    
    const startTime = Date.now();
    const response = await api.delete(`/students/${studentId}`);
    const endTime = Date.now();
    
    expect(response.status).toBe(204);
    const executionTime = endTime - startTime;
    
    // Performance benchmark: should complete within 400ms
    console.log(`DELETE /students/:${studentId} execution time: ${executionTime}ms`);
    expect(executionTime).toBeLessThan(400);
  });

  test('GET /students?grade=10 - should filter by grade within acceptable time', async () => {
    const startTime = Date.now();
    const response = await api.get('/students?grade=10');
    const endTime = Date.now();
    
    expect(response.status).toBe(200);
    const executionTime = endTime - startTime;
    
    // Performance benchmark: should complete within 700ms
    console.log(`GET /students?grade=10 execution time: ${executionTime}ms`);
    expect(executionTime).toBeLessThan(700);
  });

  test('GET /students/:id/transcript - should retrieve student transcript within acceptable time', async () => {
    const studentId = 1;
    
    const startTime = Date.now();
    const response = await api.get(`/students/${studentId}/transcript`);
    const endTime = Date.now();
    
    expect(response.status).toBe(200);
    const executionTime = endTime - startTime;
    
    // Performance benchmark: should complete within 800ms
    console.log(`GET /students/:${studentId}/transcript execution time: ${executionTime}ms`);
    expect(executionTime).toBeLessThan(800);
  });
});
