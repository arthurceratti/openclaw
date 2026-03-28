import { test, expect } from '@playwright/test';
import { api } from '../../../src/api';

test.describe('Users Performance Tests', () => {
  test('GET /users - should list users within acceptable time', async () => {
    const startTime = Date.now();
    const response = await api.get('/users');
    const endTime = Date.now();
    
    expect(response.status).toBe(200);
    const executionTime = endTime - startTime;
    
    // Performance benchmark: should complete within 1000ms
    console.log(`GET /users execution time: ${executionTime}ms`);
    expect(executionTime).toBeLessThan(1000);
    
    expect(Array.isArray(response.data)).toBe(true);
  });

  test('GET /users/:id - should retrieve single user within acceptable time', async () => {
    const userId = 1;
    const startTime = Date.now();
    const response = await api.get(`/users/${userId}`);
    const endTime = Date.now();
    
    expect(response.status).toBe(200);
    const executionTime = endTime - startTime;
    
    // Performance benchmark: should complete within 500ms
    console.log(`GET /users/:${userId} execution time: ${executionTime}ms`);
    expect(executionTime).toBeLessThan(500);
    
    expect(response.data.id).toBe(userId);
  });

  test('POST /users - should create user within acceptable time', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'student'
    };
    
    const startTime = Date.now();
    const response = await api.post('/users', userData);
    const endTime = Date.now();
    
    expect(response.status).toBe(201);
    const executionTime = endTime - startTime;
    
    // Performance benchmark: should complete within 800ms
    console.log(`POST /users execution time: ${executionTime}ms`);
    expect(executionTime).toBeLessThan(800);
    
    expect(response.data.name).toBe(userData.name);
  });

  test('PUT /users/:id - should update user within acceptable time', async () => {
    const userId = 1;
    const updateData = { name: 'Updated Name' };
    
    const startTime = Date.now();
    const response = await api.put(`/users/${userId}`, updateData);
    const endTime = Date.now();
    
    expect(response.status).toBe(200);
    const executionTime = endTime - startTime;
    
    // Performance benchmark: should complete within 600ms
    console.log(`PUT /users/:${userId} execution time: ${executionTime}ms`);
    expect(executionTime).toBeLessThan(600);
    
    expect(response.data.name).toBe(updateData.name);
  });

  test('DELETE /users/:id - should delete user within acceptable time', async () => {
    const userId = 999;
    
    const startTime = Date.now();
    const response = await api.delete(`/users/${userId}`);
    const endTime = Date.now();
    
    expect(response.status).toBe(204);
    const executionTime = endTime - startTime;
    
    // Performance benchmark: should complete within 400ms
    console.log(`DELETE /users/:${userId} execution time: ${executionTime}ms`);
    expect(executionTime).toBeLessThan(400);
  });
});
