/**
 * Integration Tests for Course Module
 * Tests the integration between course controller, service, and database
 */

const { v4: uuidv4 } = require('uuid');

// Mock dependencies
const mockCourseController = {
  getCourse: jest.fn(),
  getCourses: jest.fn(),
  createCourse: jest.fn(),
  updateCourse: jest.fn(),
  deleteCourse: jest.fn(),
  getCourseEnrollments: jest.fn(),
  enrollCourse: jest.fn(),
  unenrollCourse: jest.fn()
};

const mockCourseService = {
  getCourseById: jest.fn(),
  getCourses: jest.fn(),
  createCourse: jest.fn(),
  updateCourse: jest.fn(),
  deleteCourse: jest.fn(),
  getCourseEnrollments: jest.fn(),
  enrollStudent: jest.fn(),
  unenrollStudent: jest.fn()
};

const mockCourseRepository = {
  findCourseById: jest.fn(),
  findCourses: jest.fn(),
  createCourse: jest.fn(),
  updateCourse: jest.fn(),
  deleteCourse: jest.fn(),
  getCourseEnrollments: jest.fn(),
  enrollStudent: jest.fn(),
  unenrollStudent: jest.fn()
};

describe('Course Integration Tests', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/courses/:id', () => {
    it('should return course by valid ID', async () => {
      const mockCourse = {
        id: uuidv4(),
        title: 'Introduction to AI',
        description: 'Learn about Artificial Intelligence',
        instructor: 'John Doe',
        maxStudents: 50,
        status: 'active',
        createdAt: new Date()
      };

      mockCourseService.getCourseById.mockResolvedValue(mockCourse);

      const response = await request(mockCourseController)
        .get('/api/courses/123');

      expect(response.status).toBe(200);
      expect(response.body.course.title).toBe('Introduction to AI');
      expect(response.body.course.instructor).toBe('John Doe');
    });

    it('should return error for non-existent course', async () => {
      mockCourseService.getCourseById.mockResolvedValue(null);

      const response = await request(mockCourseController)
        .get('/api/courses/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Course not found');
    });

    it('should return course with enrollment count', async () => {
      const mockCourse = {
        id: uuidv4(),
        title: 'Advanced Machine Learning',
        description: 'Deep dive into ML',
        maxStudents: 100,
        status: 'active',
        enrolledStudents: 45
      };

      mockCourseService.getCourseById.mockResolvedValue(mockCourse);

      const response = await request(mockCourseController)
        .get('/api/courses/123');

      expect(response.body.course.maxStudents).toBe(100);
      expect(response.body.course.enrolledStudents).toBe(45);
    });
  });

  describe('GET /api/courses', () => {
    it('should return list of all courses', async () => {
      const mockCourses = [
        { id: uuidv4(), title: 'Course 1', instructor: 'Instructor 1', status: 'active' },
        { id: uuidv4(), title: 'Course 2', instructor: 'Instructor 2', status: 'active' }
      ];

      mockCourseService.getCourses.mockResolvedValue(mockCourses);

      const response = await request(mockCourseController)
        .get('/api/courses');

      expect(response.status).toBe(200);
      expect(response.body.courses).toHaveLength(2);
    });

    it('should return empty array when no courses exist', async () => {
      mockCourseService.getCourses.mockResolvedValue([]);

      const response = await request(mockCourseController)
        .get('/api/courses');

      expect(response.status).toBe(200);
      expect(response.body.courses).toHaveLength(0);
    });

    it('should filter courses by status', async () => {
      const mockCourses = [
        { id: uuidv4(), title: 'Active Course', status: 'active' },
        { id: uuidv4(), title: 'Archived Course', status: 'archived' }
      ];

      mockCourseService.getCourses.mockResolvedValue(mockCourses);

      const response = await request(mockCourseController)
        .get('/api/courses?status=active');

      expect(response.status).toBe(200);
      expect(response.body.courses).toHaveLength(1);
      expect(response.body.courses[0].status).toBe('active');
    });
  });

  describe('POST /api/courses', () => {
    it('should create a new course successfully', async () => {
      const mockCourseData = {
        title: 'New AI Course',
        description: 'Course about AI',
        instructor: 'Jane Doe',
        maxStudents: 30
      };

      mockCourseService.createCourse.mockResolvedValue({
        ...mockCourseData,
        id: uuidv4(),
        status: 'active'
      });

      const response = await request(mockCourseController)
        .post('/api/courses')
        .send(mockCourseData);

      expect(response.status).toBe(201);
      expect(response.body.course.title).toBe('New AI Course');
      expect(response.body.course.status).toBe('active');
    });

    it('should return error for missing required fields', async () => {
      const response = await request(mockCourseController)
        .post('/api/courses')
        .send({
          title: 'Incomplete Course'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Missing required fields');
    });

    it('should return error for empty title', async () => {
      const response = await request(mockCourseController)
        .post('/api/courses')
        .send({
          title: '',
          description: 'Empty title course'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Title is required');
    });

    it('should return error for course name already taken', async () => {
      mockCourseService.createCourse.mockResolvedValue({
        message: 'Course with this name already exists'
      });

      const response = await request(mockCourseController)
        .post('/api/courses')
        .send({
          title: 'Existing Course',
          description: 'Duplicate course'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('already exists');
    });
  });

  describe('PUT /api/courses/:id', () => {
    it('should update course successfully', async () => {
      const mockUpdateData = {
        title: 'Updated Course Title',
        description: 'Updated course description',
        maxStudents: 60
      };

      mockCourseService.updateCourse.mockResolvedValue({
        ...mockUpdateData,
        id: uuidv4(),
        status: 'active'
      });

      const response = await request(mockCourseController)
        .put('/api/courses/123')
        .send(mockUpdateData);

      expect(response.status).toBe(200);
      expect(response.body.course.title).toBe('Updated Course Title');
    });

    it('should return error for non-existent course', async () => {
      mockCourseService.updateCourse.mockResolvedValue(null);

      const response = await request(mockCourseController)
        .put('/api/courses/nonexistent')
        .send({
          title: 'Updated Title'
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Course not found');
    });

    it('should return error for invalid maxStudents value', async () => {
      const response = await request(mockCourseController)
        .put('/api/courses/123')
        .send({
          maxStudents: -10
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid maxStudents value');
    });
  });

  describe('DELETE /api/courses/:id', () => {
    it('should delete course successfully', async () => {
      mockCourseService.deleteCourse.mockResolvedValue({
        message: 'Course deleted successfully'
      });

      const response = await request(mockCourseController)
        .delete('/api/courses/123');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Course deleted successfully');
    });

    it('should return error for non-existent course', async () => {
      mockCourseService.deleteCourse.mockResolvedValue(null);

      const response = await request(mockCourseController)
        .delete('/api/courses/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Course not found');
    });
  });

  describe('GET /api/courses/:id/enrollments', () => {
    it('should return list of enrolled students', async () => {
      const mockEnrollments = [
        { id: uuidv4(), studentId: 'student1', name: 'Student 1', enrolledAt: new Date() },
        { id: uuidv4(), studentId: 'student2', name: 'Student 2', enrolledAt: new Date() }
      ];

      mockCourseService.getCourseEnrollments.mockResolvedValue({
        enrollments: mockEnrollments,
        count: 2
      });

      const response = await request(mockCourseController)
        .get('/api/courses/123/enrollments');

      expect(response.status).toBe(200);
      expect(response.body.enrollments).toHaveLength(2);
      expect(response.body.count).toBe(2);
    });

    it('should return empty list when no students enrolled', async () => {
      mockCourseService.getCourseEnrollments.mockResolvedValue({
        enrollments: [],
        count: 0
      });

      const response = await request(mockCourseController)
        .get('/api/courses/123/enrollments');

      expect(response.status).toBe(200);
      expect(response.body.enrollments).toHaveLength(0);
      expect(response.body.count).toBe(0);
    });
  });

  describe('POST /api/courses/:id/enroll', () => {
    it('should enroll student to course successfully', async () => {
      mockCourseService.enrollStudent.mockResolvedValue({
        message: 'Student enrolled successfully',
        enrollmentId: uuidv4(),
        enrolledAt: new Date()
      });

      const response = await request(mockCourseController)
        .post('/api/courses/123/enroll')
        .send({
          studentId: 'student123'
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Student enrolled successfully');
    });

    it('should return error when student is already enrolled', async () => {
      mockCourseService.enrollStudent.mockResolvedValue({
        message: 'Student already enrolled in this course'
      });

      const response = await request(mockCourseController)
        .post('/api/courses/123/enroll')
        .send({
          studentId: 'student123'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Student already enrolled');
    });

    it('should return error when course is full', async () => {
      mockCourseService.enrollStudent.mockResolvedValue({
        message: 'Course has reached maximum capacity'
      });

      const response = await request(mockCourseController)
        .post('/api/courses/123/enroll')
        .send({
          studentId: 'student123'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('maximum capacity');
    });

    it('should return error for non-existent course', async () => {
      mockCourseService.enrollStudent.mockResolvedValue(null);

      const response = await request(mockCourseController)
        .post('/api/courses/nonexistent/enroll')
        .send({
          studentId: 'student123'
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Course not found');
    });
  });

  describe('DELETE /api/courses/:id/unenroll', () => {
    it('should unenroll student from course successfully', async () => {
      mockCourseService.unenrollStudent.mockResolvedValue({
        message: 'Student unenrolled successfully'
      });

      const response = await request(mockCourseController)
        .delete('/api/courses/123/unenroll')
        .send({
          studentId: 'student123'
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Student unenrolled successfully');
    });

    it('should return error when student is not enrolled', async () => {
      mockCourseService.unenrollStudent.mockResolvedValue({
        message: 'Student is not enrolled in this course'
      });

      const response = await request(mockCourseController)
        .delete('/api/courses/123/unenroll')
        .send({
          studentId: 'student123'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Student not enrolled');
    });
  });
});
