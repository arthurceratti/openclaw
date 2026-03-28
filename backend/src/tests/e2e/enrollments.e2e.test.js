const request = require('supertest');
const app = require('../../app'); // Adjust path based on your project structure

describe('E2E - Enrollments API', () => {
  const validEnrollment = {
    studentRef: 'STU001',
    courseRef: '1'
  };

  const invalidEnrollment = {
    studentRef: '',
    courseRef: '-1'
  };

  beforeAll(async () => {
    // Start the application before tests
  });

  afterAll(async () => {
    // Cleanup after tests
  });

  describe('POST /api/enrollments', () => {
    it('should enroll a student in a course with valid data', async () => {
      const response = await request(app)
        .post('/api/enrollments')
        .send(validEnrollment)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.studentRef).toBe(validEnrollment.studentRef);
      expect(response.body.courseRef).toBe(validEnrollment.courseRef);
    });

    it('should reject enrollment with invalid student ref', async () => {
      const response = await request(app)
        .post('/api/enrollments')
        .send(invalidEnrollment)
        .expect(400);

      expect(response.body.message).toContain('Invalid studentRef');
    });

    it('should reject enrollment when student already enrolled', async () => {
      const response = await request(app)
        .post('/api/enrollments')
        .send({ studentRef: 'STU001', courseRef: '1' })
        .expect(409);
    });
  });

  describe('GET /api/enrollments', () => {
    it('should return list of all enrollments', async () => {
      const response = await request(app)
        .get('/api/enrollments')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return enrollments with pagination', async () => {
      const response = await request(app)
        .get('/api/enrollments?limit=2&offset=0')
        .expect(200);

      expect(response.body.limit).toBe(2);
    });

    it('should filter enrollments by student', async () => {
      const response = await request(app)
        .get('/api/enrollments?studentRef=STU001')
        .expect(200);
    });

    it('should filter enrollments by course', async () => {
      const response = await request(app)
        .get('/api/enrollments?courseRef=1')
        .expect(200);
    });
  });

  describe('GET /api/enrollments/:id', () => {
    it('should return a specific enrollment', async () => {
      const response = await request(app)
        .get('/api/enrollments/1')
        .expect(200);

      expect(response.body.studentRef).toBeDefined();
      expect(response.body.courseRef).toBeDefined();
    });
  });

  describe('PUT /api/enrollments/:id', () => {
    it('should update an enrollment', async () => {
      const updateData = {
        studentRef: 'STU002',
        courseRef: '1'
      };

      const response = await request(app)
        .put('/api/enrollments/1')
        .send(updateData)
        .expect(200);

      expect(response.body.studentRef).toBe(updateData.studentRef);
    });
  });

  describe('DELETE /api/enrollments/:id', () => {
    it('should delete an enrollment', async () => {
      const response = await request(app)
        .delete('/api/enrollments/1')
        .expect(204);
    });
  });
});
