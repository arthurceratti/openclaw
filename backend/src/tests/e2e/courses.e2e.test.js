const request = require('supertest');
const app = require('../../app'); // Adjust path based on your project structure

describe('E2E - Courses API', () => {
  const validCourse = {
    name: 'Introduction to Programming',
    description: 'Learn the basics of programming',
    instructor: 'Dr. Example',
    maxStudents: 30
  };

  const invalidCourse = {
    name: 'Short',
    description: '',
    instructor: '',
    maxStudents: -1
  };

  beforeAll(async () => {
    // Start the application before tests
  });

  afterAll(async () => {
    // Cleanup after tests
  });

  describe('POST /api/courses', () => {
    it('should create a new course with valid data', async () => {
      const response = await request(app)
        .post('/api/courses')
        .send(validCourse)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.name).toBe(validCourse.name);
      expect(response.body.description).toBe(validCourse.description);
      expect(response.body.instructor).toBe(validCourse.instructor);
      expect(response.body.maxStudents).toBe(validCourse.maxStudents);
    });

    it('should reject course creation with invalid max students', async () => {
      const response = await request(app)
        .post('/api/courses')
        .send(invalidCourse)
        .expect(400);

      expect(response.body.message).toContain('Invalid maxStudents');
    });
  });

  describe('GET /api/courses', () => {
    it('should return list of all courses', async () => {
      const response = await request(app)
        .get('/api/courses')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return courses with pagination', async () => {
      const response = await request(app)
        .get('/api/courses?limit=1&offset=0')
        .expect(200);

      expect(response.body.limit).toBe(1);
    });

    it('should filter courses by instructor', async () => {
      const response = await request(app)
        .get('/api/courses?instructor=Dr.Example')
        .expect(200);
    });
  });

  describe('PUT /api/courses/:id', () => {
    it('should update an existing course', async () => {
      const updateData = {
        name: 'Updated Course Name',
        description: 'Updated description',
        instructor: 'Updated Instructor',
        maxStudents: 25
      };

      const response = await request(app)
        .put('/api/courses/1')
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe(updateData.name);
      expect(response.body.description).toBe(updateData.description);
      expect(response.body.instructor).toBe(updateData.instructor);
      expect(response.body.maxStudents).toBe(updateData.maxStudents);
    });
  });

  describe('DELETE /api/courses/:id', () => {
    it('should delete a course', async () => {
      const response = await request(app)
        .delete('/api/courses/1')
        .expect(204);
    });
  });
});
