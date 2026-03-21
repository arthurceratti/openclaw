/**
 * Integration Tests for Assignment Module
 * Tests the integration between assignment controller, service, and database
 */

const { v4: uuidv4 } = require('uuid');

// Mock dependencies
const mockAssignmentController = {
  getAssignment: jest.fn(),
  getCourseAssignments: jest.fn(),
  createAssignment: jest.fn(),
  updateAssignment: jest.fn(),
  deleteAssignment: jest.fn(),
  submitAssignment: jest.fn(),
  getSubmission: jest.fn(),
  gradeSubmission: jest.fn(),
  getSubmissions: jest.fn()
};

const mockAssignmentService = {
  getAssignmentById: jest.fn(),
  getCourseAssignments: jest.fn(),
  createAssignment: jest.fn(),
  updateAssignment: jest.fn(),
  deleteAssignment: jest.fn(),
  submitAssignment: jest.fn(),
  getSubmission: jest.fn(),
  gradeSubmission: jest.fn(),
  getSubmissions: jest.fn()
};

const mockAssignmentRepository = {
  findAssignmentById: jest.fn(),
  findCourseAssignments: jest.fn(),
  createAssignment: jest.fn(),
  updateAssignment: jest.fn(),
  deleteAssignment: jest.fn(),
  submitAssignment: jest.fn(),
  getSubmission: jest.fn(),
  gradeSubmission: jest.fn(),
  getSubmissions: jest.fn()
};

describe('Assignment Integration Tests', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/assignments/:id', () => {
    it('should return assignment by valid ID', async () => {
      const mockAssignment = {
        id: uuidv4(),
        title: 'Introduction to Python',
        description: 'Learn Python basics',
        maxPoints: 100,
        dueDate: new Date('2026-04-15'),
        courseTitle: 'Python Programming',
        status: 'open',
        isOpenForSubmission: true,
        isOpenForGrading: true
      };

      mockAssignmentService.getAssignmentById.mockResolvedValue(mockAssignment);

      const response = await request(mockAssignmentController)
        .get('/api/assignments/123');

      expect(response.status).toBe(200);
      expect(response.body.assignment.title).toBe('Introduction to Python');
      expect(response.assignment.maxPoints).toBe(100);
    });

    it('should return error for non-existent assignment', async () => {
      mockAssignmentService.getAssignmentById.mockResolvedValue(null);

      const response = await request(mockAssignmentController)
        .get('/api/assignments/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Assignment not found');
    });

    it('should return assignment with submission status', async () => {
      const mockAssignment = {
        id: uuidv4(),
        title: 'JavaScript Basics',
        maxPoints: 50,
        dueDate: new Date('2026-04-20'),
        status: 'open',
        isOpenForSubmission: true,
        isOpenForGrading: true,
        submissions: 25
      };

      mockAssignmentService.getAssignmentById.mockResolvedValue(mockAssignment);

      const response = await request(mockAssignmentController)
        .get('/api/assignments/123');

      expect(response.body.assignment.submissions).toBe(25);
    });
  });

  describe('GET /api/courses/:courseId/assignments', () => {
    it('should return list of assignments for a course', async () => {
      const mockAssignments = [
        {
          id: uuidv4(),
          title: 'First Assignment',
          description: 'First homework',
          maxPoints: 100,
          dueDate: new Date('2026-04-15'),
          status: 'open',
          isOpenForSubmission: true
        },
        {
          id: uuidv4(),
          title: 'Second Assignment',
          description: 'Second homework',
          maxPoints: 100,
          dueDate: new Date('2026-04-22'),
          status: 'open',
          isOpenForSubmission: true
        }
      ];

      mockAssignmentService.getCourseAssignments.mockResolvedValue(mockAssignments);

      const response = await request(mockAssignmentController)
        .get('/api/courses/course123/assignments');

      expect(response.status).toBe(200);
      expect(response.body.assignments).toHaveLength(2);
    });

    it('should return empty array when course has no assignments', async () => {
      mockAssignmentService.getCourseAssignments.mockResolvedValue([]);

      const response = await request(mockAssignmentController)
        .get('/api/courses/course123/assignments');

      expect(response.status).toBe(200);
      expect(response.body.assignments).toHaveLength(0);
    });

    it('should filter assignments by status', async () => {
      const mockAssignments = [
        { id: uuidv4(), title: 'Open Assignment', status: 'open' },
        { id: uuidv4(), title: 'Graded Assignment', status: 'graded' },
        { id: uuidv4(), title: 'Draft Assignment', status: 'draft' }
      ];

      mockAssignmentService.getCourseAssignments.mockResolvedValue(mockAssignments);

      const response = await request(mockAssignmentController)
        .get('/api/courses/course123/assignments?status=open');

      expect(response.status).toBe(200);
      expect(response.body.assignments).toHaveLength(1);
      expect(response.body.assignments[0].status).toBe('open');
    });
  });

  describe('POST /api/assignments', () => {
    it('should create a new assignment successfully', async () => {
      const mockAssignmentData = {
        title: 'New Assignment',
        description: 'Assignment about something',
        maxPoints: 100,
        dueDate: new Date('2026-05-01'),
        courseId: 'course123',
        isOpenForSubmission: true
      };

      mockAssignmentService.createAssignment.mockResolvedValue({
        ...mockAssignmentData,
        id: uuidv4(),
        status: 'open'
      });

      const response = await request(mockAssignmentController)
        .post('/api/assignments')
        .send(mockAssignmentData);

      expect(response.status).toBe(201);
      expect(response.body.assignment.title).toBe('New Assignment');
      expect(response.body.assignment.maxPoints).toBe(100);
    });

    it('should return error for missing required fields', async () => {
      const response = await request(mockAssignmentController)
        .post('/api/assignments')
        .send({
          title: 'Incomplete Assignment'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Missing required fields');
    });

    it('should return error for empty title', async () => {
      const response = await request(mockAssignmentController)
        .post('/api/assignments')
        .send({
          title: '',
          description: 'Empty title assignment'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Title is required');
    });

    it('should return error for invalid maxPoints value', async () => {
      const response = await request(mockAssignmentController)
        .post('/api/assignments')
        .send({
          title: 'Negative Points',
          maxPoints: -10
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid maxPoints value');
    });

    it('should return error for past due date', async () => {
      const response = await request(mockAssignmentController)
        .post('/api/assignments')
        .send({
          title: 'Past Due Date',
          dueDate: new Date('2024-01-01')
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid due date');
    });
  });

  describe('PUT /api/assignments/:id', () => {
    it('should update assignment successfully', async () => {
      const mockUpdateData = {
        title: 'Updated Assignment Title',
        description: 'Updated assignment description',
        maxPoints: 120,
        dueDate: new Date('2026-05-15'),
        isOpenForSubmission: true
      };

      mockAssignmentService.updateAssignment.mockResolvedValue({
        ...mockUpdateData,
        id: uuidv4(),
        status: 'open'
      });

      const response = await request(mockAssignmentController)
        .put('/api/assignments/123')
        .send(mockUpdateData);

      expect(response.status).toBe(200);
      expect(response.body.assignment.title).toBe('Updated Assignment Title');
      expect(response.body.assignment.maxPoints).toBe(120);
    });

    it('should return error for non-existent assignment', async () => {
      mockAssignmentService.updateAssignment.mockResolvedValue(null);

      const response = await request(mockAssignmentController)
        .put('/api/assignments/nonexistent')
        .send({
          title: 'Updated Title'
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Assignment not found');
    });

    it('should return error for changing maxPoints after deadline', async () => {
      mockAssignmentService.updateAssignment.mockResolvedValue({
        message: 'Cannot change maxPoints after deadline'
      });

      const response = await request(mockAssignmentController)
        .put('/api/assignments/123')
        .send({
          maxPoints: 150
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Cannot change maxPoints');
    });

    it('should return error for changing status after deadline', async () => {
      mockAssignmentService.updateAssignment.mockResolvedValue({
        message: 'Cannot change status after deadline'
      });

      const response = await request(mockAssignmentController)
        .put('/api/assignments/123')
        .send({
          status: 'closed'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Cannot change status');
    });
  });

  describe('DELETE /api/assignments/:id', () => {
    it('should delete assignment successfully', async () => {
      mockAssignmentService.deleteAssignment.mockResolvedValue({
        message: 'Assignment deleted successfully'
      });

      const response = await request(mockAssignmentController)
        .delete('/api/assignments/123');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Assignment deleted successfully');
    });

    it('should return error for non-existent assignment', async () => {
      mockAssignmentService.deleteAssignment.mockResolvedValue(null);

      const response = await request(mockAssignmentController)
        .delete('/api/assignments/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Assignment not found');
    });

    it('should return error for assignment with submissions', async () => {
      mockAssignmentService.deleteAssignment.mockResolvedValue({
        message: 'Cannot delete assignment with existing submissions'
      });

      const response = await request(mockAssignmentController)
        .delete('/api/assignments/123');

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('existing submissions');
    });

    it('should return error for assignment that is closed', async () => {
      mockAssignmentService.deleteAssignment.mockResolvedValue({
        message: 'Cannot delete closed assignment'
      });

      const response = await request(mockAssignmentController)
        .delete('/api/assignments/123');

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('closed assignment');
    });
  });

  describe('POST /api/assignments/:id/submit', () => {
    it('should submit assignment successfully', async () => {
      const mockSubmission = {
        submissionId: uuidv4(),
        assignmentId: uuidv4(),
        studentId: 'student123',
        fileUrl: 'https://example.com/assignment.pdf',
        submittedAt: new Date(),
        status: 'submitted'
      };

      mockAssignmentService.submitAssignment.mockResolvedValue(mockSubmission);

      const response = await request(mockAssignmentController)
        .post('/api/assignments/123/submit')
        .send({
          fileUrl: 'https://example.com/assignment.pdf'
        });

      expect(response.status).toBe(200);
      expect(response.body.submission.fileUrl).toBe('https://example.com/assignment.pdf');
      expect(response.body.submission.status).toBe('submitted');
    });

    it('should return error when assignment is not open for submission', async () => {
      mockAssignmentService.submitAssignment.mockResolvedValue({
        message: 'Assignment is not open for submission'
      });

      const response = await request(mockAssignmentController)
        .post('/api/assignments/123/submit')
        .send({
          fileUrl: 'https://example.com/assignment.pdf'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('not open for submission');
    });

    it('should return error when assignment deadline has passed', async () => {
      mockAssignmentService.submitAssignment.mockResolvedValue({
        message: 'Assignment deadline has passed'
      });

      const response = await request(mockAssignmentController)
        .post('/api/assignments/123/submit')
        .send({
          fileUrl: 'https://example.com/assignment.pdf'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('deadline has passed');
    });

    it('should return error when student already submitted', async () => {
      mockAssignmentService.submitAssignment.mockResolvedValue({
        message: 'Student already submitted this assignment'
      });

      const response = await request(mockAssignmentController)
        .post('/api/assignments/123/submit')
        .send({
          fileUrl: 'https://example.com/assignment.pdf'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Already submitted');
    });

    it('should return error for non-existent assignment', async () => {
      mockAssignmentService.submitAssignment.mockResolvedValue(null);

      const response = await request(mockAssignmentController)
        .post('/api/assignments/nonexistent/submit')
        .send({
          fileUrl: 'https://example.com/assignment.pdf'
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Assignment not found');
    });
  });

  describe('GET /api/assignments/:id/submissions', () => {
    it('should return list of submissions for assignment', async () => {
      const mockSubmissions = [
        {
          submissionId: uuidv4(),
          studentId: 'student1',
          name: 'Student 1',
          fileUrl: 'https://example.com/sub1.pdf',
          submittedAt: new Date(),
          status: 'submitted',
          grade: null
        },
        {
          submissionId: uuidv4(),
          studentId: 'student2',
          name: 'Student 2',
          fileUrl: 'https://example.com/sub2.pdf',
          submittedAt: new Date(),
          status: 'graded',
          grade: 95
        }
      ];

      mockAssignmentService.getSubmissions.mockResolvedValue(mockSubmissions);

      const response = await request(mockAssignmentController)
        .get('/api/assignments/123/submissions');

      expect(response.status).toBe(200);
      expect(response.body.submissions).toHaveLength(2);
    });

    it('should return empty array when no submissions exist', async () => {
      mockAssignmentService.getSubmissions.mockResolvedValue([]);

      const response = await request(mockAssignmentController)
        .get('/api/assignments/123/submissions');

      expect(response.status).toBe(200);
      expect(response.body.submissions).toHaveLength(0);
    });

    it('should filter submissions by status', async () => {
      const mockSubmissions = [
        { id: uuidv4(), status: 'submitted', grade: null },
        { id: uuidv4(), status: 'graded', grade: 90 },
        { id: uuidv4(), status: 'pending', grade: null }
      ];

      mockAssignmentService.getSubmissions.mockResolvedValue(mockSubmissions);

      const response = await request(mockAssignmentController)
        .get('/api/assignments/123/submissions?status=submitted');

      expect(response.status).toBe(200);
      expect(response.body.submissions).toHaveLength(1);
    });
  });

  describe('POST /api/assignments/:id/grade/:submissionId', () => {
    it('should grade submission successfully', async () => {
      const mockGradedSubmission = {
        submissionId: uuidv4(),
        assignmentId: uuidv4(),
        studentId: 'student1',
        fileUrl: 'https://example.com/assignment.pdf',
        grade: 95,
        maxGrade: 100,
        status: 'graded',
        feedback: 'Excellent work! Great understanding of the concepts.',
        gradedAt: new Date()
      };

      mockAssignmentService.gradeSubmission.mockResolvedValue(mockGradedSubmission);

      const response = await request(mockAssignmentController)
        .post('/api/assignments/123/grade/submission123')
        .send({
          grade: 95,
          feedback: 'Excellent work! Great understanding of the concepts.'
        });

      expect(response.status).toBe(200);
      expect(response.body.submission.grade).toBe(95);
      expect(response.body.submission.maxGrade).toBe(100);
      expect(response.body.submission.status).toBe('graded');
    });

    it('should return error for invalid grade value', async () => {
      mockAssignmentService.gradeSubmission.mockResolvedValue({
        message: 'Grade must be between 0 and maxGrade'
      });

      const response = await request(mockAssignmentController)
        .post('/api/assignments/123/grade/submission123')
        .send({
          grade: 150
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Grade must be between');
    });

    it('should return error for non-existent submission', async () => {
      mockAssignmentService.gradeSubmission.mockResolvedValue(null);

      const response = await request(mockAssignmentController)
        .post('/api/assignments/123/grade/nonexistent')
        .send({
          grade: 95
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Submission not found');
    });

    it('should return error when grading is closed', async () => {
      mockAssignmentService.gradeSubmission.mockResolvedValue({
        message: 'Grading is closed for this assignment'
      });

      const response = await request(mockAssignmentController)
        .post('/api/assignments/123/grade/submission123')
        .send({
          grade: 95
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Grading is closed');
    });
  });

  describe('GET /api/assignments/:id/submit/:submissionId', () => {
    it('should return submission details', async () => {
      const mockSubmission = {
        submissionId: uuidv4(),
        assignmentId: uuidv4(),
        studentId: 'student1',
        name: 'Student 1',
        fileUrl: 'https://example.com/assignment.pdf',
        submittedAt: new Date(),
        status: 'submitted',
        grade: null,
        feedback: null
      };

      mockAssignmentService.getSubmission.mockResolvedValue(mockSubmission);

      const response = await request(mockAssignmentController)
        .get('/api/assignments/123/submit/submission123');

      expect(response.status).toBe(200);
      expect(response.body.submission.fileUrl).toBe('https://example.com/assignment.pdf');
      expect(response.body.submission.status).toBe('submitted');
    });

    it('should return error for non-existent submission', async () => {
      mockAssignmentService.getSubmission.mockResolvedValue(null);

      const response = await request(mockAssignmentController)
        .get('/api/assignments/123/submit/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Submission not found');
    });
  });
});
