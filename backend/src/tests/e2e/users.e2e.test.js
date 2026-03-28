const request = require('supertest');
const app = require('../../app'); // Adjust path based on your project structure

describe('E2E - Users API', () => {
  const validUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'SecurePass123'
  };

  const invalidUser = {
    name: 'John Doe',
    email: 'invalid-email',
    password: 'short'
  };

  beforeAll(async () => {
    // Start the application before tests
  });

  afterAll(async () => {
    // Cleanup after tests
  });

  describe('POST /api/users', () => {
    it('should create a new user with valid data', async () => {
      const response = await request(app)
        .post('/api/users')
        .send(validUser)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.name).toBe(validUser.name);
      expect(response.body.email).toBe(validUser.email);
    });

    it('should reject user creation with invalid email', async () => {
      const response = await request(app)
        .post('/api/users')
        .send(invalidUser)
        .expect(400);

      expect(response.body.message).toContain('Invalid email format');
    });

    it('should reject user creation with short password', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ ...validUser, password: '123' })
        .expect(400);
    });
  });

  describe('GET /api/users', () => {
    it('should return list of all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return users with pagination', async () => {
      const response = await request(app)
        .get('/api/users?limit=2&offset=0')
        .expect(200);

      expect(response.body.limit).toBe(2);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update an existing user', async () => {
      const updateData = {
        name: 'Updated User',
        email: 'updated@example.com',
        password: 'SecurePass123'
      };

      const response = await request(app)
        .put('/api/users/1')
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe(updateData.name);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete a user', async () => {
      const response = await request(app)
        .delete('/api/users/1')
        .expect(204);
    });
  });
});
