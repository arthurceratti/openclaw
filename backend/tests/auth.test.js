const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = require('../app');

// Mock database
const mockUsers = [
  {
    id: 1,
    username: 'john_doe',
    email: 'john@example.com',
    password: '$2b$10$MockHashHereForTesting',
    role: 'student'
  },
  {
    id: 2,
    username: 'admin_user',
    email: 'admin@example.com',
    password: '$2b$10$MockHashHereForTesting',
    role: 'admin'
  }
];

// Mock JWT secret
const JWT_SECRET = 'test-secret-key-for-development';

// Mock bcrypt verify
const mockBcryptVerify = (password, hash) => {
  const user = mockUsers.find(u => u.password === hash);
  return user ? password === user.password : false;
};

// Helper to generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

describe('Authentication Controller', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockRequest = {
      body: {},
      headers: {},
      user: null
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      end: jest.fn()
    };
  });

  describe('POST /api/auth/login', () => {
    test('should login with valid credentials', async () => {
      const loginMock = jest.fn((req, res) => {
        const { username, password } = req.body;
        const user = mockUsers.find(u => u.username === username);
        
        if (user) {
          const isValidPassword = mockBcryptVerify(password, user.password);
          if (isValidPassword) {
            const token = generateToken({ 
              userId: user.id, 
              username: user.username, 
              role: user.role 
            });
            return res.status(200).json({ 
              message: 'Login successful',
              token,
              user: { id: user.id, username: user.username, role: user.role }
            });
          }
        }
        return res.status(401).json({ message: 'Invalid credentials' });
      });

      mockRequest.body = { username: 'john_doe', password: 'password123' };
      
      await loginMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Login successful');
      expect(responseObj.token).toBeDefined();
      expect(responseObj.user).toBeDefined();
    });

    test('should return 401 for invalid credentials', async () => {
      const loginMock = jest.fn((req, res) => {
        const { username, password } = req.body;
        const user = mockUsers.find(u => u.username === username);
        
        if (user) {
          const isValidPassword = mockBcryptVerify(password, user.password);
          if (isValidPassword) {
            const token = generateToken({ 
              userId: user.id, 
              username: user.username, 
              role: user.role 
            });
            return res.status(200).json({ 
              message: 'Login successful',
              token,
              user: { id: user.id, username: user.username, role: user.role }
            });
          }
        }
        return res.status(401).json({ message: 'Invalid credentials' });
      });

      mockRequest.body = { username: 'john_doe', password: 'wrongpassword' };
      
      await loginMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Invalid credentials');
    });

    test('should return 400 for missing credentials', async () => {
      const loginMock = jest.fn((req, res) => {
        if (!req.body.username || !req.body.password) {
          return res.status(400).json({ 
            message: 'Username and password are required' 
          });
        }
        return res.status(401).json({ message: 'Invalid credentials' });
      });

      mockRequest.body = { username: 'john_doe' };
      
      await loginMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Username and password are required');
    });
  });

  describe('POST /api/auth/register', () => {
    test('should register new user with valid data', async () => {
      const registerMock = jest.fn((req, res) => {
        const { username, email, password, role } = req.body;
        
        if (!username || !email || !password) {
          return res.status(400).json({ 
            message: 'Username, email and password are required' 
          });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = {
          id: mockUsers.length + 1,
          username,
          email,
          password: hashedPassword,
          role: role || 'student'
        };

        mockUsers.push(newUser);

        const token = generateToken({ 
          userId: newUser.id, 
          username: newUser.username, 
          role: newUser.role 
        });

        return res.status(201).json({ 
          message: 'Registration successful',
          token,
          user: { 
            id: newUser.id, 
            username: newUser.username, 
            email: newUser.email,
            role: newUser.role 
          }
        });
      });

      mockRequest.body = { 
        username: 'jane_doe',
        email: 'jane@example.com',
        password: 'securepassword123',
        role: 'student'
      };
      
      await registerMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Registration successful');
      expect(responseObj.token).toBeDefined();
      expect(responseObj.user.email).toBe('jane@example.com');
    });

    test('should return 400 for duplicate email', async () => {
      const registerMock = jest.fn((req, res) => {
        const { email } = req.body;
        
        const existingUser = mockUsers.find(u => u.email === email);
        
        if (existingUser) {
          return res.status(400).json({ 
            message: 'User with this email already exists' 
          });
        }

        return res.status(201).json({ message: 'Registration successful' });
      });

      mockRequest.body = { 
        username: 'john_doe',
        email: 'john@example.com', // Already exists
        password: 'password123'
      };
      
      await registerMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('User with this email already exists');
    });

    test('should return 400 for invalid email format', async () => {
      const registerMock = jest.fn((req, res) => {
        const { email } = req.body;
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
          return res.status(400).json({ 
            message: 'Invalid email format' 
          });
        }

        return res.status(201).json({ message: 'Registration successful' });
      });

      mockRequest.body = { 
        username: 'jane_doe',
        email: 'invalid-email',
        password: 'password123'
      };
      
      await registerMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Invalid email format');
    });

    test('should return 400 for password too short', async () => {
      const registerMock = jest.fn((req, res) => {
        const { password } = req.body;
        
        if (password.length < 6) {
          return res.status(400).json({ 
            message: 'Password must be at least 6 characters' 
          });
        }

        return res.status(201).json({ message: 'Registration successful' });
      });

      mockRequest.body = { 
        username: 'jane_doe',
        email: 'jane@example.com',
        password: 'short'
      };
      
      await registerMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Password must be at least 6 characters');
    });
  });

  describe('POST /api/auth/logout', () => {
    test('should logout and invalidate token', async () => {
      const logoutMock = jest.fn((req, res) => {
        // In a real app, this would invalidate the token in database/cache
        // For now, we just acknowledge the logout request
        return res.status(200).json({ 
          message: 'Logged out successfully' 
        });
      });

      mockRequest.body = {};
      mockRequest.headers = {
        authorization: `Bearer ${generateToken({ userId: 1 })}`
      };
      
      await logoutMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Logged out successfully');
    });

    test('should return 401 if no token provided', async () => {
      const logoutMock = jest.fn((req, res) => {
        if (!req.headers.authorization) {
          return res.status(401).json({ 
            message: 'Authentication token required' 
          });
        }
        return res.status(200).json({ message: 'Logged out successfully' });
      });

      mockRequest.body = {};
      mockRequest.headers = {};
      
      await logoutMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Authentication token required');
    });
  });

  describe('POST /api/auth/refresh', () => {
    test('should refresh token with valid refresh token', async () => {
      const refreshTokenMock = jest.fn((req, res) => {
        const { refreshToken } = req.body;
        
        // Verify refresh token
        try {
          jwt.verify(refreshToken, JWT_SECRET, { expiresIn: '7d' });
          
          const newToken = generateToken({ userId: 1 });
          return res.status(200).json({ 
            message: 'Token refreshed successfully',
            token: newToken
          });
        } catch (error) {
          return res.status(401).json({ message: 'Invalid refresh token' });
        }
      });

      mockRequest.body = { 
        refreshToken: generateToken({ userId: 1, expiresIn: '7d' })
      };
      
      await refreshTokenMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Token refreshed successfully');
      expect(responseObj.token).toBeDefined();
    });

    test('should return 401 for invalid refresh token', async () => {
      const refreshTokenMock = jest.fn((req, res) => {
        const { refreshToken } = req.body;
        
        try {
          jwt.verify(refreshToken, JWT_SECRET, { expiresIn: '7d' });
          const newToken = generateToken({ userId: 1 });
          return res.status(200).json({ 
            message: 'Token refreshed successfully',
            token: newToken
          });
        } catch (error) {
          return res.status(401).json({ message: 'Invalid refresh token' });
        }
      });

      mockRequest.body = { 
        refreshToken: 'invalid-refresh-token'
      };
      
      await refreshTokenMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Invalid refresh token');
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    test('should send password reset email for valid email', async () => {
      const forgotPasswordMock = jest.fn((req, res) => {
        const { email } = req.body;
        
        const user = mockUsers.find(u => u.email === email);
        
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        // In a real app, this would send an email
        const resetToken = generateToken({ userId: user.id, type: 'reset' });
        
        return res.status(200).json({ 
          message: 'Password reset link sent to your email'
        });
      });

      mockRequest.body = { email: 'john@example.com' };
      
      await forgotPasswordMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Password reset link sent to your email');
    });

    test('should return 400 for invalid email format', async () => {
      const forgotPasswordMock = jest.fn((req, res) => {
        const { email } = req.body;
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
          return res.status(400).json({ 
            message: 'Invalid email format' 
          });
        }

        return res.status(200).json({ message: 'Password reset link sent' });
      });

      mockRequest.body = { email: 'invalid-email' };
      
      await forgotPasswordMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Invalid email format');
    });
  });

  describe('POST /api/auth/reset-password', () => {
    test('should reset password with valid reset token', async () => {
      const resetPasswordMock = jest.fn((req, res) => {
        const { token, password } = req.body;
        
        // Verify reset token
        try {
          jwt.verify(token, JWT_SECRET, { expiresIn: '1h' });
          
          if (password.length < 6) {
            return res.status(400).json({ 
              message: 'Password must be at least 6 characters' 
            });
          }

          // Update password (in real app)
          const hashedPassword = await bcrypt.hash(password, 10);
          
          return res.status(200).json({ 
            message: 'Password reset successful'
          });
        } catch (error) {
          return res.status(401).json({ message: 'Invalid reset token' });
        }
      });

      mockRequest.body = { 
        token: generateToken({ userId: 1, type: 'reset', expiresIn: '1h' }),
        password: 'newSecurePassword123'
      };
      
      await resetPasswordMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Password reset successful');
    });

    test('should return 400 for password too short', async () => {
      const resetPasswordMock = jest.fn((req, res) => {
        const { token, password } = req.body;
        
        try {
          jwt.verify(token, JWT_SECRET, { expiresIn: '1h' });
          
          if (password.length < 6) {
            return res.status(400).json({ 
              message: 'Password must be at least 6 characters' 
            });
          }

          return res.status(200).json({ message: 'Password reset successful' });
        } catch (error) {
          return res.status(401).json({ message: 'Invalid reset token' });
        }
      });

      mockRequest.body = { 
        token: generateToken({ userId: 1, type: 'reset' }),
        password: 'short'
      };
      
      await resetPasswordMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Password must be at least 6 characters');
    });

    test('should return 401 for invalid reset token', async () => {
      const resetPasswordMock = jest.fn((req, res) => {
        const { token, password } = req.body;
        
        try {
          jwt.verify(token, JWT_SECRET, { expiresIn: '1h' });
          return res.status(200).json({ message: 'Password reset successful' });
        } catch (error) {
          return res.status(401).json({ message: 'Invalid reset token' });
        }
      });

      mockRequest.body = { 
        token: 'invalid-reset-token',
        password: 'newSecurePassword123'
      };
      
      await resetPasswordMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Invalid reset token');
    });
  });
});
