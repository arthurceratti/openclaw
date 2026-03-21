/**
 * Integration Tests for User Module
 * Tests the integration between user controller, service, and database
 */

const { v4: uuidv4 } = require('uuid');

// Mock dependencies
const mockUserController = {
  getProfile: jest.fn(),
  updateProfile: jest.fn(),
  deleteProfile: jest.fn(),
  getFollowing: jest.fn(),
  getFollowers: jest.fn(),
  followUser: jest.fn(),
  unfollowUser: jest.fn()
};

const mockUserService = {
  getUserById: jest.fn(),
  getUserByEmail: jest.fn(),
  updateProfile: jest.fn(),
  deleteUser: jest.fn(),
  getFollowing: jest.fn(),
  getFollowers: jest.fn(),
  followUser: jest.fn(),
  unfollowUser: jest.fn()
};

const mockUserRepository = {
  findUserById: jest.fn(),
  findUserByEmail: jest.fn(),
  getUserByIdWithRelations: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  getFollowing: jest.fn(),
  getFollowers: jest.fn(),
  createFollowship: jest.fn(),
  deleteFollowship: jest.fn()
};

describe('User Integration Tests', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/users/:id', () => {
    it('should return user profile by valid ID', async () => {
      const mockUser = {
        id: uuidv4(),
        email: 'test@example.com',
        name: 'Test User',
        avatar: 'https://example.com/avatar.jpg',
        bio: 'Test user bio',
        following: 15,
        followers: 10
      };

      mockUserService.getUserById.mockResolvedValue(mockUser);

      const response = await request(mockUserController)
        .get('/api/users/123');

      expect(response.status).toBe(200);
      expect(response.body.user.id).toBe(mockUser.id);
      expect(response.body.user.email).toBe(mockUser.email);
    });

    it('should return error for non-existent user', async () => {
      mockUserService.getUserById.mockResolvedValue(null);

      const response = await request(mockUserController)
        .get('/api/users/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });

    it('should return user with following count', async () => {
      const mockUser = {
        id: uuidv4(),
        email: 'test@example.com',
        name: 'Test User',
        following: 20,
        followers: 15
      };

      mockUserService.getUserById.mockResolvedValue(mockUser);

      const response = await request(mockUserController)
        .get('/api/users/123');

      expect(response.body.user.following).toBe(20);
      expect(response.body.user.followers).toBe(15);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user profile successfully', async () => {
      const mockUpdateData = {
        email: 'updated@example.com',
        name: 'Updated User',
        avatar: 'https://example.com/new-avatar.jpg',
        bio: 'Updated bio'
      };

      mockUserService.updateProfile.mockResolvedValue({
        ...mockUpdateData,
        id: uuidv4()
      });

      const response = await request(mockUserController)
        .put('/api/users/123')
        .send({
          email: 'updated@example.com',
          name: 'Updated User',
          bio: 'Updated bio'
        });

      expect(response.status).toBe(200);
      expect(response.body.user.email).toBe('updated@example.com');
      expect(response.body.user.name).toBe('Updated User');
    });

    it('should return error for invalid email format', async () => {
      const response = await request(mockUserController)
        .put('/api/users/123')
        .send({
          email: 'invalid-email',
          name: 'Test User'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid email format');
    });

    it('should return error for non-existent user', async () => {
      mockUserService.updateProfile.mockResolvedValue(null);

      const response = await request(mockUserController)
        .put('/api/users/123')
        .send({
          email: 'test@example.com',
          name: 'Test User'
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete user profile successfully', async () => {
      mockUserService.deleteUser.mockResolvedValue({
        message: 'User deleted successfully'
      });

      const response = await request(mockUserController)
        .delete('/api/users/123');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User deleted successfully');
    });

    it('should return error for non-existent user', async () => {
      mockUserService.deleteUser.mockResolvedValue(null);

      const response = await request(mockUserController)
        .delete('/api/users/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });
  });

  describe('GET /api/users/:id/following', () => {
    it('should return list of following users', async () => {
      const mockFollowingUsers = [
        { id: uuidv4(), name: 'User 1', email: 'user1@example.com' },
        { id: uuidv4(), name: 'User 2', email: 'user2@example.com' }
      ];

      mockUserService.getFollowing.mockResolvedValue({
        users: mockFollowingUsers,
        count: 2
      });

      const response = await request(mockUserController)
        .get('/api/users/123/following');

      expect(response.status).toBe(200);
      expect(response.body.users).toHaveLength(2);
      expect(response.body.count).toBe(2);
    });

    it('should return empty list when user is not following anyone', async () => {
      mockUserService.getFollowing.mockResolvedValue({
        users: [],
        count: 0
      });

      const response = await request(mockUserController)
        .get('/api/users/123/following');

      expect(response.status).toBe(200);
      expect(response.body.users).toHaveLength(0);
      expect(response.body.count).toBe(0);
    });
  });

  describe('GET /api/users/:id/followers', () => {
    it('should return list of follower users', async () => {
      const mockFollowerUsers = [
        { id: uuidv4(), name: 'Follower 1', email: 'follower1@example.com' },
        { id: uuidv4(), name: 'Follower 2', email: 'follower2@example.com' }
      ];

      mockUserService.getFollowers.mockResolvedValue({
        users: mockFollowerUsers,
        count: 2
      });

      const response = await request(mockUserController)
        .get('/api/users/123/followers');

      expect(response.status).toBe(200);
      expect(response.body.users).toHaveLength(2);
      expect(response.body.count).toBe(2);
    });
  });

  describe('POST /api/users/:id/follow', () => {
    it('should follow a user successfully', async () => {
      mockUserService.followUser.mockResolvedValue({
        message: 'User followed successfully',
        following: 20
      });

      const response = await request(mockUserController)
        .post('/api/users/123/follow');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User followed successfully');
    });

    it('should return error when already following', async () => {
      mockUserService.followUser.mockResolvedValue({
        message: 'Already following this user'
      });

      const response = await request(mockUserController)
        .post('/api/users/123/follow');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Already following this user');
    });

    it('should return error for non-existent user', async () => {
      mockUserService.followUser.mockResolvedValue(null);

      const response = await request(mockUserController)
        .post('/api/users/nonexistent/follow');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });
  });

  describe('DELETE /api/users/:id/follow', () => {
    it('should unfollow a user successfully', async () => {
      mockUserService.unfollowUser.mockResolvedValue({
        message: 'User unfollowed successfully',
        following: 19
      });

      const response = await request(mockUserController)
        .delete('/api/users/123/follow');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User unfollowed successfully');
    });

    it('should return error when not following', async () => {
      mockUserService.unfollowUser.mockResolvedValue({
        message: 'You are not following this user'
      });

      const response = await request(mockUserController)
        .delete('/api/users/123/follow');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('You are not following this user');
    });
  });
});
