const request = require('supertest');
const app = require('../../app'); // Adjust path based on your project structure

describe('E2E - Students API', () => {
  const validStudent = {
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice.smith@example.com',
    dateOfBirth: '2000-01-15',
    studentId: 'STU001'
  };

  const invalidStudent = {
    firstName: '',
    lastName: '',
    email: 'invalid-email',
    dateOfBirth: 'invalid-date',
    studentId: ''
  };

  beforeAll(async () => {
    // Start the application before tests
  });

  afterAll(async () => {
    // Cleanup after tests
  });

  describe('POST /api/students', () => {
    it('should create a new student with valid data', async () => {
      const response = await request(app)
        .post('/api/students')
        .send(validStudent)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.firstName).toBe(validStudent.firstName);
      expect(response.body.lastName).toBe(validStudent.lastName);
      expect(response.body.email).toBe(validStudent.email);
      expect(response.body.dateOfBirth).toBe(validStudent.dateOfBirth);
      expect(response.body.studentId).toBe(validStudent.studentId);
    });

    it('should reject student creation with invalid email', async () => {
      const response = await request(app)
        .post('/api/students')
        .send(invalidStudent)
        .expect(400);

      expect(response.body.message).toContain('Invalid email format');
    });

    it('should reject student with invalid date of birth', async () => {
      const response = await request(app)
        .post('/api/students')
        .send({ ...validStudent, dateOfBirth: '2026-01-01' })
        .expect(400);
    });
  });

  describe('GET /api/students', () => {
    it('should return list of all students', async () => {
      const response = await request(app)
        .get('/api/students')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return students with pagination', async () => {
      const response = await request(app)
        .get('/api/students?limit=1&offset=0')
        .expect(200);

      expect(response.body.limit).toBe(1);
    });

    it('should filter students by student ID', async () => {
      const response = await request(app)
        .get('/api/students?studentId=STU001')
        .expect(200);
    });
  });

  describe('PUT /api/students/:id', () => {
    it('should update an existing student', async () => {
      const updateData = {
        firstName: 'Alice Updated',
        lastName: 'Smith Updated',
        email: 'alice.updated@example.com',
        dateOfBirth: '2000-01-15',
        studentId: 'STU001'
      };

      const response = await request(app)
        .put('/api/students/1')
        .send(updateData)
        .expect(200);

      expect(response.body.firstName).toBe(updateData.firstName);
      expect(response.body.lastName).toBe(updateData.lastName);
      expect(response.body.email).toBe(updateData.email);
    });
  });

  describe('DELETE /api/students/:id', () => {
    it('should delete a student', async () => {
      const response = await request(app)
        .delete('/api/students/1')
        .expect(204);
    });
  });
});
