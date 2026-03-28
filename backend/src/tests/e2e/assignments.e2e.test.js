const request = require('supertest');
const app = require('../../app'); // Adjust path based on your project structure

describe('E2E - Assignments API', () => {
  const validAssignment = {
    title: 'First Assignment',
    description: 'Complete the basic exercises',
    dueDate: '2026-04-15T23:59:59Z',
    courseRef: '1'
  };

  const invalidAssignment = {
    title: '',
    description: 'No description',
    dueDate: 'invalid-date',
    courseRef: '-1'
  };

  beforeAll(async () => {
    // Start the application before tests
  });

  afterAll(async () => {
    // Cleanup after tests
  });

  describe('POST /api/assignments', () => {
    it('should create a new assignment with valid data', async () => {
      const response = await request(app)
        .post('/api/assignments')
        .send(validAssignment)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.title).toBe(validAssignment.title);
      expect(response.body.description).toBe(validAssignment.description);
      expect(response.body.dueDate).toBe(validAssignment.dueDate);
      expect(response.body.courseRef).toBe(validAssignment.courseRef);
    });

    it('should reject assignment creation with invalid title', async () => {
      const response = await request(app)
        .post('/api/assignments')
        .send(invalidAssignment)
        .expect(400);

      expect(response.body.message).toContain('Invalid title');
    });

    it('should reject assignment with invalid due date', async () => {
      const response = await request(app)
        .post('/api/assignments')
        .send({ ...validAssignment, dueDate: '2025-01-01T00:00:00Z' })
        .expect(400);
    });
  });

  describe('GET /api/assignments', () => {
    it('should return list of all assignments', async () => {
      const response = await request(app)
        .get('/api/assignments')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return assignments with pagination', async () => {
      const response = await request(app)
        .get('/api/assignments?limit=2&offset=0')
        .expect(200);

      expect(response.body.limit).toBe(2);
    });

    it('should filter assignments by course', async () => {
      const response = await request(app)
        .get('/api/assignments?courseRef=1')
        .expect(200);
    });
  });

  describe('PUT /api/assignments/:id', () => {
    it('should update an existing assignment', async () => {
      const updateData = {
        title: 'Updated Assignment Title',
        description: 'Updated description',
        dueDate: '2026-04-20T23:59:59Z',
        courseRef: '1'
      };

      const response = await request(app)
        .put('/api/assignments/1')
        .send(updateData)
        .expect(200);

      expect(response.body.title).toBe(updateData.title);
      expect(response.body.description).toBe(updateData.description);
      expect(response.body.dueDate).toBe(updateData.dueDate);
    });
  });

  describe('DELETE /api/assignments/:id', () => {
    it('should delete an assignment', async () => {
      const response = await request(app)
        .delete('/api/assignments/1')
        .expect(204);
    });
  });
});
