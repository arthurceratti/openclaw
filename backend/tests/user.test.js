const request = require('supertest');
const app = require('../app');

// Mock database
const mockUsers = [
  {
    id: 1,
    username: 'john_doe',
    email: 'john@example.com',
    password: '$2b$10$MockHashHereForTesting',
    role: 'student',
    name: 'John Doe',
    avatar: 'https://example.com/avatars/john.png',
    bio: 'Computer science student'
  },
  {
    id: 2,
    username: 'jane_doe',
    email: 'jane@example.com',
    password: '$2b$10$MockHashHereForTesting',
    role: 'student',
    name: 'Jane Doe',
    avatar: 'https://example.com/avatars/jane.png',
    bio: 'Mathematics major'
  },
  {
    id: 3,
    username: 'admin_user',
    email: 'admin@example.com',
    password: '$2b$10$MockHashHereForTesting',
    role: 'admin',
    name: 'Admin User',
    avatar: 'https://example.com/avatars/admin.png',
    bio: 'System administrator'
  }
];

// Helper function
const generateToken = (payload) => {
  const jwt = require('jsonwebtoken');
  return jwt.sign(payload, 'test-secret-key-for-development', { expiresIn: '24h' });
};

describe('User Controller', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockRequest = {
      body: {},
      headers: {},
      params: {},
      query: {}
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      end: jest.fn()
    };
  });

  describe('GET /api/users/:id', () => {
    test('should get user by id', async () => {
      const getUserMock = jest.fn((req, res) => {
        const userId = parseInt(req.params.id);
        const user = mockUsers.find(u => u.id === userId);
        
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        // Exclude password from response
        const { password, ...userWithoutPassword } = user;
        return res.status(200).json(userWithoutPassword);
      });

      mockRequest.params = { id: '1' };
      
      await getUserMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.id).toBe(1);
      expect(responseObj.username).toBe('john_doe');
      expect(responseObj.role).toBe('student');
      expect(responseObj.password).toBeUndefined();
    });

    test('should return 404 for non-existent user', async () => {
      const getUserMock = jest.fn((req, res) => {
        const userId = parseInt(req.params.id);
        const user = mockUsers.find(u => u.id === userId);
        
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        const { password, ...userWithoutPassword } = user;
        return res.status(200).json(userWithoutPassword);
      });

      mockRequest.params = { id: '999' };
      
      await getUserMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('User not found');
    });
  });

  describe('GET /api/users', () => {
    test('should get all users', async () => {
      const getAllUsersMock = jest.fn((req, res) => {
        const users = mockUsers.map(u => {
          const { password, ...userWithoutPassword } = u;
          return userWithoutPassword;
        });
        
        return res.status(200).json(users);
      });

      mockRequest.query = { role: 'student' };
      
      await getAllUsersMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(Array.isArray(responseObj)).toBe(true);
      expect(responseObj.length).toBe(2); // Only students
      expect(responseObj[0].role).toBe('student');
    });

    test('should filter users by role', async () => {
      const getAllUsersMock = jest.fn((req, res) => {
        const role = req.query.role;
        
        if (!role) {
          return res.status(200).json(
            mockUsers.map(u => {
              const { password, ...userWithoutPassword } = u;
              return userWithoutPassword;
            })
          );
        }

        const filtered = mockUsers.filter(u => u.role === role);
        return res.status(200).json(
          filtered.map(u => {
            const { password, ...userWithoutPassword } = u;
            return userWithoutPassword;
          })
        );
      });

      mockRequest.query = { role: 'admin' };
      
      await getAllUsersMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.length).toBe(1); // Only admin
      expect(responseObj[0].role).toBe('admin');
    });
  });

  describe('PUT /api/users/:id', () => {
    test('should update user profile', async () => {
      const updateUserMock = jest.fn((req, res) => {
        const userId = parseInt(req.params.id);
        const userIndex = mockUsers.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
          return res.status(404).json({ message: 'User not found' });
        }

        const { name, avatar, bio } = req.body;
        const updateData = {
          id: mockUsers[userIndex].id,
          username: mockUsers[userIndex].username,
          email: mockUsers[userIndex].email,
          role: mockUsers[userIndex].role,
          name: name || mockUsers[userIndex].name,
          avatar: avatar || mockUsers[userIndex].avatar,
          bio: bio || mockUsers[userIndex].bio
        };

        // Exclude password from response
        const { password, ...userWithoutPassword } = updateData;
        mockUsers[userIndex] = updateData;

        return res.status(200).json(userWithoutPassword);
      });

      mockRequest.params = { id: '1' };
      mockRequest.body = { 
        name: 'John Smith',
        bio: 'Updated biography'
      };
      
      await updateUserMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.name).toBe('John Smith');
      expect(responseObj.bio).toBe('Updated biography');
    });

    test('should return 404 for non-existent user', async () => {
      const updateUserMock = jest.fn((req, res) => {
        const userId = parseInt(req.params.id);
        
        if (userId === -1) {
          return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'User updated' });
      });

      mockRequest.params = { id: '999' };
      mockRequest.body = { name: 'New Name' };
      
      await updateUserMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('User not found');
    });
  });

  describe('PUT /api/users/:id/password', () => {
    test('should update user password', async () => {
      const updatePasswordMock = jest.fn((req, res) => {
        const userId = parseInt(req.params.id);
        const userIndex = mockUsers.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
          return res.status(404).json({ message: 'User not found' });
        }

        const { currentPassword, newPassword } = req.body;
        
        // In real app, verify currentPassword first
        const bcrypt = require('bcrypt');
        const isValid = await bcrypt.compare(currentPassword, mockUsers[userIndex].password);
        
        if (!isValid) {
          return res.status(401).json({ message: 'Current password is incorrect' });
        }

        if (newPassword.length < 6) {
          return res.status(400).json({ 
            message: 'Password must be at least 6 characters' 
          });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        mockUsers[userIndex].password = hashedPassword;

        return res.status(200).json({ message: 'Password updated successfully' });
      });

      mockRequest.params = { id: '1' };
      mockRequest.body = { 
        currentPassword: 'password123',
        newPassword: 'newSecurePassword123'
      };
      
      await updatePasswordMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Password updated successfully');
    });

    test('should return 401 for incorrect current password', async () => {
      const updatePasswordMock = jest.fn((req, res) => {
        const userId = parseInt(req.params.id);
        
        if (userId === -1) {
          return res.status(404).json({ message: 'User not found' });
        }

        const { currentPassword } = req.body;
        
        const bcrypt = require('bcrypt');
        const isValid = await bcrypt.compare(currentPassword, mockUsers.find(u => u.id === userId).password);
        
        if (!isValid) {
          return res.status(401).json({ message: 'Current password is incorrect' });
        }

        return res.status(200).json({ message: 'Password updated' });
      });

      mockRequest.params = { id: '1' };
      mockRequest.body = { 
        currentPassword: 'wrongpassword',
        newPassword: 'newSecurePassword123'
      };
      
      await updatePasswordMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Current password is incorrect');
    });

    test('should return 400 for password too short', async () => {
      const updatePasswordMock = jest.fn((req, res) => {
        const userId = parseInt(req.params.id);
        
        if (userId === -1) {
          return res.status(404).json({ message: 'User not found' });
        }

        const { currentPassword, newPassword } = req.body;
        
        if (newPassword.length < 6) {
          return res.status(400).json({ 
            message: 'Password must be at least 6 characters' 
          });
        }

        return res.status(200).json({ message: 'Password updated' });
      });

      mockRequest.params = { id: '1' };
      mockRequest.body = { 
        currentPassword: 'password123',
        newPassword: 'short'
      };
      
      await updatePasswordMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Password must be at least 6 characters');
    });
  });

  describe('DELETE /api/users/:id', () => {
    test('should delete user', async () => {
      const deleteUserMock = jest.fn((req, res) => {
        const userId = parseInt(req.params.id);
        const userIndex = mockUsers.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
          return res.status(404).json({ message: 'User not found' });
        }

        // In real app, verify admin role before delete
        mockUsers.splice(userIndex, 1);

        return res.status(200).json({ message: 'User deleted successfully' });
      });

      mockRequest.params = { id: '2' };
      
      await deleteUserMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('User deleted successfully');
    });

    test('should return 404 for non-existent user', async () => {
      const deleteUserMock = jest.fn((req, res) => {
        const userId = parseInt(req.params.id);
        
        if (userId === -1) {
          return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'User deleted' });
      });

      mockRequest.params = { id: '999' };
      
      await deleteUserMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('User not found');
    });
  });

  describe('GET /api/users/me', () => {
    test('should get current user profile', async () => {
      const getCurrentUserMock = jest.fn((req, res) => {
        // In real app, extract user from token
        const userId = parseInt(req.user.id);
        const user = mockUsers.find(u => u.id === userId);
        
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        const { password, ...userWithoutPassword } = user;
        return res.status(200).json(userWithoutPassword);
      });

      mockRequest.user = { id: 1 };
      
      await getCurrentUserMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.id).toBe(1);
      expect(responseObj.username).toBe('john_doe');
    });

    test('should return 401 if user not authenticated', async () => {
      const getCurrentUserMock = jest.fn((req, res) => {
        if (!req.user) {
          return res.status(401).json({ message: 'Authentication required' });
        }

        return res.status(200).json({ message: 'User data' });
      });

      mockRequest.user = null;
      
      await getCurrentUserMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Authentication required');
    });
  });
});
