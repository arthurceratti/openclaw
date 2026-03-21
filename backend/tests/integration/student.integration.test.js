/**
 * Integration Tests for Student Module
 * Tests the integration between student controller, service, and database
 */

const { v4: uuidv4 } = require('uuid');

// Mock dependencies
const mockStudentController = {
  getProfile: jest.fn(),
  updateProfile: jest.fn(),
  deleteProfile: jest.fn(),
  getEnrolledCourses: jest.fn(),
  enrollCourse: jest.fn(),
  unenrollCourse: jest.fn(),
  submitAssignment: jest.fn(),
  getGrade: jest.fn()
};

const mockStudentService = {
  getStudentById: jest.fn(),
  getStudentByEmail: jest.fn(),
  updateProfile: jest.fn(),
  deleteProfile: jest.fn(),
  getEnrolledCourses: jest.fn(),
  enrollCourse: jest.fn(),
  unenrollCourse: jest.fn(),
  submitAssignment: jest.fn(),
  getGrade: jest.fn()
};

const mockStudentRepository = {
  findStudentById: jest.fn(),
  findStudentByEmail: jest.fn(),
  updateProfile: jest.fn(),
  deleteProfile: jest.fn(),
  getEnrolledCourses: jest.fn(),
  enrollCourse: jest.fn(),
  unenrollCourse: jest.fn(),
  submitAssignment: jest.fn(),
  getGrade: jest.fn()
};

describe('Student Integration Tests', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/students/:id', () => {
    it('should return student profile by valid ID', async () => {
      const mockStudent = {
        id: uuidv4(),
        email: 'student@example.com',
        firstName: 'John',
        lastName: 'Doe',
        enrollmentNumber: 'STU2024001',
        enrollmentDate: new Date(),
        status: 'active'
      };

      mockStudentService.getStudentById.mockResolvedValue(mockStudent);

      const response = await request(mockStudentController)
        .get('/api/students/123');

      expect(response.status).toBe(200);
      expect(response.body.student.firstName).toBe('John');
      expect(response.body.student.lastName).toBe('Doe');
    });

    it('should return error for non-existent student', async () => {
      mockStudentService.getStudentById.mockResolvedValue(null);

      const response = await request(mockStudentController)
        .get('/api/students/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Student not found');
    });

    it('should return student with enrollment number', async () => {
      const mockStudent = {
        id: uuidv4(),
        email: 'student@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        enrollmentNumber: 'STU2024002',
        status: 'active'
      };

      mockStudentService.getStudentById.mockResolvedValue(mockStudent);

      const response = await request(mockStudentController)
        .get('/api/students/123');

      expect(response.body.student.enrollmentNumber).toBe('STU2024002');
    });
  });

  describe('PUT /api/students/:id', () => {
    it('should update student profile successfully', async () => {
      const mockUpdateData = {
        firstName: 'Updated',
        lastName: 'Name',
        email: 'updated@example.com'
      };

      mockStudentService.updateProfile.mockResolvedValue({
        ...mockUpdateData,
        id: uuidv4(),
        enrollmentNumber: 'STU2024003',
        status: 'active'
      });

      const response = await request(mockStudentController)
        .put('/api/students/123')
        .send(mockUpdateData);

      expect(response.status).toBe(200);
      expect(response.body.student.firstName).toBe('Updated');
      expect(response.body.student.lastName).toBe('Name');
    });

    it('should return error for non-existent student', async () => {
      mockStudentService.updateProfile.mockResolvedValue(null);

      const response = await request(mockStudentController)
        .put('/api/students/nonexistent')
        .send({
          firstName: 'New',
          lastName: 'Name'
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Student not found');
    });

    it('should return error for invalid email format', async () => {
      const response = await request(mockStudentController)
        .put('/api/students/123')
        .send({
          email: 'invalid-email'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid email format');
    });
  });

  describe('DELETE /api/students/:id', () => {
    it('should delete student profile successfully', async () => {
      mockStudentService.deleteProfile.mockResolvedValue({
        message: 'Student profile deleted successfully'
      });

      const response = await request(mockStudentController)
        .delete('/api/students/123');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Student profile deleted successfully');
    });

    it('should return error for non-existent student', async () => {
      mockStudentService.deleteProfile.mockResolvedValue(null);

      const response = await request(mockStudentController)
        .delete('/api/students/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Student not found');
    });
  });

  describe('GET /api/students/:id/enrolled-courses', () => {
    it('should return list of enrolled courses', async () => {
      const mockCourses = [
        {
          courseId: uuidv4(),
          courseTitle: 'Introduction to AI',
          instructor: 'John Doe',
          enrollmentDate: new Date()
        },
        {
          courseId: uuidv4(),
          courseTitle: 'Machine Learning Basics',
          instructor: 'Jane Smith',
          enrollmentDate: new Date()
        }
      ];

      mockStudentService.getEnrolledCourses.mockResolvedValue({
        courses: mockCourses,
        count: 2
      });

      const response = await request(mockStudentController)
        .get('/api/students/123/enrolled-courses');

      expect(response.status).toBe(200);
      expect(response.body.courses).toHaveLength(2);
      expect(response.body.count).toBe(2);
    });

    it('should return empty list when student has no enrolled courses', async () => {
      mockStudentService.getEnrolledCourses.mockResolvedValue({
        courses: [],
        count: 0
      });

      const response = await request(mockStudentController)
        .get('/api/students/123/enrolled-courses');

      expect(response.status).toBe(200);
      expect(response.body.courses).toHaveLength(0);
      expect(response.body.count).toBe(0);
    });
  });

  describe('POST /api/students/:id/enroll-course', () => {
    it('should enroll student to course successfully', async () => {
      mockStudentService.enrollCourse.mockResolvedValue({
        message: 'Student enrolled to course successfully',
        courseId: uuidv4(),
        courseTitle: 'New Course',
        enrolledAt: new Date()
      });

      const response = await request(mockStudentController)
        .post('/api/students/123/enroll-course')
        .send({
          courseId: 'course456'
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Student enrolled to course successfully');
    });

    it('should return error when student is already enrolled', async () => {
      mockStudentService.enrollCourse.mockResolvedValue({
        message: 'Student already enrolled in this course'
      });

      const response = await request(mockStudentController)
        .post('/api/students/123/enroll-course')
        .send({
          courseId: 'course456'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Already enrolled');
    });

    it('should return error when course is full', async () => {
      mockStudentService.enrollCourse.mockResolvedValue({
        message: 'Course has reached maximum capacity'
      });

      const response = await request(mockStudentController)
        .post('/api/students/123/enroll-course')
        .send({
          courseId: 'course456'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('maximum capacity');
    });

    it('should return error for non-existent course', async () => {
      mockStudentService.enrollCourse.mockResolvedValue(null);

      const response = await request(mockStudentController)
        .post('/api/students/123/enroll-course')
        .send({
          courseId: 'nonexistent'
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Course not found');
    });

    it('should return error when course is not active', async () => {
      mockStudentService.enrollCourse.mockResolvedValue({
        message: 'Course is not currently active'
      });

      const response = await request(mockStudentController)
        .post('/api/students/123/enroll-course')
        .send({
          courseId: 'course456'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('not active');
    });
  });

  describe('DELETE /api/students/:id/unenroll-course', () => {
    it('should unenroll student from course successfully', async () => {
      mockStudentService.unenrollCourse.mockResolvedValue({
        message: 'Student unenrolled from course successfully'
      });

      const response = await request(mockStudentController)
        .delete('/api/students/123/unenroll-course')
        .send({
          courseId: 'course456'
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Student unenrolled from course successfully');
    });

    it('should return error when student is not enrolled', async () => {
      mockStudentService.unenrollCourse.mockResolvedValue({
        message: 'Student is not enrolled in this course'
      });

      const response = await request(mockStudentController)
        .delete('/api/students/123/unenroll-course')
        .send({
          courseId: 'course456'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Not enrolled');
    });
  });

  describe('POST /api/students/:id/submit-assignment', () => {
    it('should submit assignment successfully', async () => {
      const mockAssignment = {
        assignmentId: uuidv4(),
        title: 'First Assignment',
        submittedAt: new Date(),
        status: 'submitted',
        grade: null
      };

      mockStudentService.submitAssignment.mockResolvedValue(mockAssignment);

      const response = await request(mockStudentController)
        .post('/api/students/123/submit-assignment')
        .send({
          assignmentId: 'assignment789',
          fileUrl: 'https://example.com/assignment.pdf'
        });

      expect(response.status).toBe(200);
      expect(response.body.assignment.title).toBe('First Assignment');
      expect(response.body.assignment.status).toBe('submitted');
    });

    it('should return error for non-existent assignment', async () => {
      mockStudentService.submitAssignment.mockResolvedValue(null);

      const response = await request(mockStudentController)
        .post('/api/students/123/submit-assignment')
        .send({
          assignmentId: 'nonexistent',
          fileUrl: 'https://example.com/assignment.pdf'
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Assignment not found');
    });

    it('should return error when assignment is not open for submission', async () => {
      mockStudentService.submitAssignment.mockResolvedValue({
        message: 'Assignment is not open for submission'
      });

      const response = await request(mockStudentController)
        .post('/api/students/123/submit-assignment')
        .send({
          assignmentId: 'assignment789',
          fileUrl: 'https://example.com/assignment.pdf'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('not open for submission');
    });

    it('should return error when student already submitted', async () => {
      mockStudentService.submitAssignment.mockResolvedValue({
        message: 'Student already submitted this assignment'
      });

      const response = await request(mockStudentController)
        .post('/api/students/123/submit-assignment')
        .send({
          assignmentId: 'assignment789',
          fileUrl: 'https://example.com/assignment.pdf'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Already submitted');
    });
  });

  describe('GET /api/students/:id/assignments/:assignmentId/grade', () => {
    it('should return student grade for assignment', async () => {
      const mockGrade = {
        assignmentId: uuidv4(),
        title: 'First Assignment',
        grade: 8.5,
        maxGrade: 10,
        status: 'graded',
        feedback: 'Excellent work on this assignment'
      };

      mockStudentService.getGrade.mockResolvedValue(mockGrade);

      const response = await request(mockStudentController)
        .get('/api/students/123/assignments/assignment789/grade');

      expect(response.status).toBe(200);
      expect(response.body.grade).toBe(8.5);
      expect(response.body.maxGrade).toBe(10);
    });

    it('should return null when assignment is not graded', async () => {
      mockStudentService.getGrade.mockResolvedValue(null);

      const response = await request(mockStudentController)
        .get('/api/students/123/assignments/assignment789/grade');

      expect(response.status).toBe(200);
      expect(response.body.grade).toBeNull();
      expect(response.body.status).toBe('pending');
    });

    it('should return error for non-existent assignment', async () => {
      mockStudentService.getGrade.mockResolvedValue(null);

      const response = await request(mockStudentController)
        .get('/api/students/123/assignments/nonexistent/grade');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Assignment not found');
    });
  });
});
