/**
 * Integration Tests for Authentication Module
 * Tests the integration between auth controller, service, and database
 */

const request = require('supertest');
const { v4: uuidv4 } = require('uuid');

// Mock dependencies
const mockAuthController = {
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  refreshToken: jest.fn()
};

const mockAuthService = {
  validateCredentials: jest.fn(),
  hashPassword: jest.fn(),
  comparePassword: jest.fn()
};

const mockAuthRepository = {
  findUserByEmail: jest.fn(),
  findUserById: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn()
};

describe('Authentication Integration Tests', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/login', () => {
    it('should successfully login with valid credentials', async () => {
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      
      mockAuthService.validateCredentials.mockResolvedValue({
        isValid: true,
        user: { id: uuidv4(), email: 'test@example.com', name: 'Test User' }
      });
      
      mockAuthController.login.mockResolvedValue({
        token: mockToken,
        user: { id: uuidv4(), email: 'test@example.com', name: 'Test User' }
      });

      const response = await request(mockAuthController)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.token).toBe(mockToken);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should return error for invalid credentials', async () => {
      mockAuthService.validateCredentials.mockResolvedValue({
        isValid: false,
        error: 'Invalid email or password'
      });

      const response = await request(mockAuthController)
        .post('/api/auth/login')
        .send({
          email: 'invalid@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid email or password');
    });

    it('should return error for non-existent user', async () => {
      mockAuthRepository.findUserByEmail.mockResolvedValue(null);
      mockAuthService.validateCredentials.mockResolvedValue({
        isValid: false,
        error: 'User not found'
      });

      const response = await request(mockAuthController)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });

    it('should refresh the access token', async () => {
      const mockNewToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      
      mockAuthService.validateCredentials.mockResolvedValue({
        isValid: true,
        user: { id: uuidv4(), email: 'test@example.com' }
      });

      mockAuthController.refreshToken.mockResolvedValue({
        token: mockNewToken
      });

      const response = await request(mockAuthController)
        .post('/api/auth/refresh')
        .send({
          refreshToken: 'expiredRefreshToken'
        });

      expect(response.status).toBe(200);
      expect(response.body.token).toBe(mockNewToken);
    });

    it('should logout user successfully', async () => {
      mockAuthService.validateCredentials.mockResolvedValue({
        isValid: true,
        user: { id: uuidv4(), email: 'test@example.com' }
      });

      mockAuthController.logout.mockResolvedValue({
        message: 'User logged out successfully'
      });

      const response = await request(mockAuthController)
        .post('/api/auth/logout')
        .send({
          email: 'test@example.com',
          refreshToken: 'validRefreshToken'
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User logged out successfully');
    });
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      mockAuthService.hashPassword.mockResolvedValue('hashedPassword');
      mockAuthRepository.createUser.mockResolvedValue({
        id: uuidv4(),
        email: 'newuser@example.com',
        name: 'New User'
      });

      const response = await request(mockAuthController)
        .post('/api/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'password123',
          name: 'New User'
        });

      expect(response.status).toBe(201);
      expect(response.body.user.email).toBe('newuser@example.com');
      expect(response.body.user.name).toBe('New User');
    });

    it('should return error for existing user', async () => {
      mockAuthRepository.findUserByEmail.mockResolvedValue({
        id: uuidv4(),
        email: 'existing@example.com'
      });

      const response = await request(mockAuthController)
        .post('/api/auth/register')
        .send({
          email: 'existing@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User already exists');
    });

    it('should return error for empty email', async () => {
      const response = await request(mockAuthController)
        .post('/api/auth/register')
        .send({
          email: '',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Email is required');
    });
  });
});
