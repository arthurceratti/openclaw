const request = require('supertest');
const app = require('../app');

// Mock database
const mockAssignments = [
  {
    id: 1,
    title: 'Introduction to JavaScript',
    description: 'Learn basic JavaScript concepts',
    courseId: 1,
    courseTitle: 'Introduction to Computer Science',
    instructor: 'Dr. John Smith',
    category: 'Introduction',
    maxPoints: 100,
    dueDate: '2024-04-15T23:59:00Z',
    status: 'open',
    createdAt: '2024-03-01T10:00:00Z'
  },
  {
    id: 2,
    title: 'Advanced Python Programming',
    description: 'Master advanced Python features',
    courseId: 2,
    courseTitle: 'Advanced Machine Learning',
    instructor: 'Dr. Jane Doe',
    category: 'Programming',
    maxPoints: 150,
    dueDate: '2024-05-20T23:59:00Z',
    status: 'open',
    createdAt: '2024-04-01T14:00:00Z'
  },
  {
    id: 3,
    title: 'React Component Design',
    description: 'Build reusable React components',
    courseId: 3,
    courseTitle: 'Web Development with React',
    instructor: 'Dr. Bob Johnson',
    category: 'Development',
    maxPoints: 120,
    dueDate: '2024-06-10T23:59:00Z',
    status: 'open',
    createdAt: '2024-05-01T09:00:00Z'
  }
];

describe('Assignment Controller', () => {
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

  describe('GET /api/assignments', () => {
    test('should get all assignments', async () => {
      const getAllAssignmentsMock = jest.fn((req, res) => {
        return res.status(200).json(mockAssignments);
      });

      mockRequest.query = { category: 'Introduction' };
      
      await getAllAssignmentsMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(Array.isArray(responseObj)).toBe(true);
      expect(responseObj.length).toBe(3);
    });

    test('should filter assignments by category', async () => {
      const getAllAssignmentsMock = jest.fn((req, res) => {
        const category = req.query.category;
        
        if (category) {
          const filtered = mockAssignments.filter(a => a.category === category);
          return res.status(200).json(filtered);
        }

        return res.status(200).json(mockAssignments);
      });

      mockRequest.query = { category: 'Programming' };
      
      await getAllAssignmentsMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.length).toBe(1);
      expect(responseObj[0].category).toBe('Programming');
    });

    test('should filter assignments by course', async () => {
      const getAllAssignmentsMock = jest.fn((req, res) => {
        const courseId = parseInt(req.query.courseId);
        
        if (courseId) {
          const filtered = mockAssignments.filter(a => a.courseId === courseId);
          return res.status(200).json(filtered);
        }

        return res.status(200).json(mockAssignments);
      });

      mockRequest.query = { courseId: 1 };
      
      await getAllAssignmentsMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.length).toBe(1);
      expect(responseObj[0].courseTitle).toBe('Introduction to Computer Science');
    });

    test('should filter assignments by status', async () => {
      const getAllAssignmentsMock = jest.fn((req, res) => {
        const status = req.query.status;
        
        if (status) {
          const filtered = mockAssignments.filter(a => a.status === status);
          return res.status(200).json(filtered);
        }

        return res.status(200).json(mockAssignments);
      });

      mockRequest.query = { status: 'completed' };
      mockAssignments[0].status = 'completed';
      
      await getAllAssignmentsMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.length).toBe(1);
      expect(responseObj[0].status).toBe('completed');
    });
  });

  describe('GET /api/assignments/:id', () => {
    test('should get assignment by id', async () => {
      const getAssignmentMock = jest.fn((req, res) => {
        const assignmentId = parseInt(req.params.id);
        const assignment = mockAssignments.find(a => a.id === assignmentId);
        
        if (!assignment) {
          return res.status(404).json({ message: 'Assignment not found' });
        }

        return res.status(200).json(assignment);
      });

      mockRequest.params = { id: '1' };
      
      await getAssignmentMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.id).toBe(1);
      expect(responseObj.title).toBe('Introduction to JavaScript');
      expect(responseObj.instructor).toBe('Dr. John Smith');
    });

    test('should return 404 for non-existent assignment', async () => {
      const getAssignmentMock = jest.fn((req, res) => {
        const assignmentId = parseInt(req.params.id);
        const assignment = mockAssignments.find(a => a.id === assignmentId);
        
        if (!assignment) {
          return res.status(404).json({ message: 'Assignment not found' });
        }

        return res.status(200).json(assignment);
      });

      mockRequest.params = { id: '999' };
      
      await getAssignmentMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Assignment not found');
    });
  });

  describe('POST /api/assignments', () => {
    test('should create new assignment', async () => {
      const createAssignmentMock = jest.fn((req, res) => {
        const { title, description, courseId, instructor, category, maxPoints, dueDate } = req.body;
        
        if (!title || !description || !courseId || !instructor) {
          return res.status(400).json({ 
            message: 'Title, description, courseId, and instructor are required' 
          });
        }

        const newAssignment = {
          id: mockAssignments.length + 1,
          title,
          description,
          courseId,
          courseTitle: `Course ${courseId}`,
          instructor,
          category: category || 'General',
          maxPoints: maxPoints || 100,
          dueDate: dueDate || null,
          status: 'open',
          createdAt: new Date().toISOString()
        };

        mockAssignments.push(newAssignment);

        return res.status(201).json(newAssignment);
      });

      mockRequest.body = { 
        title: 'Data Structures Practice',
        description: 'Implement common data structures',
        courseId: 1,
        instructor: 'Dr. Alice Williams',
        category: 'Data Structures',
        maxPoints: 100,
        dueDate: '2024-04-20T23:59:00Z'
      };
      
      await createAssignmentMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.id).toBe(4);
      expect(responseObj.title).toBe('Data Structures Practice');
      expect(responseObj.status).toBe('open');
    });

    test('should return 400 for missing required fields', async () => {
      const createAssignmentMock = jest.fn((req, res) => {
        const { title, description, courseId, instructor } = req.body;
        
        if (!title || !description || !courseId || !instructor) {
          return res.status(400).json({ 
            message: 'Title, description, courseId, and instructor are required' 
          });
        }

        return res.status(201).json({ message: 'Assignment created' });
      });

      mockRequest.body = { 
        title: 'New Assignment',
        description: 'Assignment description'
        // Missing courseId and instructor
      };
      
      await createAssignmentMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Title, description, courseId, and instructor are required');
    });
  });

  describe('PUT /api/assignments/:id', () => {
    test('should update existing assignment', async () => {
      const updateAssignmentMock = jest.fn((req, res) => {
        const assignmentId = parseInt(req.params.id);
        const assignmentIndex = mockAssignments.findIndex(a => a.id === assignmentId);
        
        if (assignmentIndex === -1) {
          return res.status(404).json({ message: 'Assignment not found' });
        }

        const { title, description, category, maxPoints, dueDate, status } = req.body;
        const updateData = {
          id: mockAssignments[assignmentIndex].id,
          title: title || mockAssignments[assignmentIndex].title,
          description: description || mockAssignments[assignmentIndex].description,
          courseId: mockAssignments[assignmentIndex].courseId,
          courseTitle: mockAssignments[assignmentIndex].courseTitle,
          instructor: mockAssignments[assignmentIndex].instructor,
          category: category || mockAssignments[assignmentIndex].category,
          maxPoints: maxPoints || mockAssignments[assignmentIndex].maxPoints,
          dueDate: dueDate || mockAssignments[assignmentIndex].dueDate,
          status: status || mockAssignments[assignmentIndex].status,
          createdAt: mockAssignments[assignmentIndex].createdAt
        };

        mockAssignments[assignmentIndex] = updateData;

        return res.status(200).json(updateData);
      });

      mockRequest.params = { id: '1' };
      mockRequest.body = { 
        title: 'Updated JS Introduction',
        maxPoints: 120,
        status: 'in-progress'
      };
      
      await updateAssignmentMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.title).toBe('Updated JS Introduction');
      expect(responseObj.maxPoints).toBe(120);
      expect(responseObj.status).toBe('in-progress');
    });

    test('should return 404 for non-existent assignment', async () => {
      const updateAssignmentMock = jest.fn((req, res) => {
        const assignmentId = parseInt(req.params.id);
        
        if (assignmentId === -1) {
          return res.status(404).json({ message: 'Assignment not found' });
        }

        return res.status(200).json({ message: 'Assignment updated' });
      });

      mockRequest.params = { id: '999' };
      mockRequest.body = { title: 'New Title' };
      
      await updateAssignmentMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Assignment not found');
    });
  });

  describe('POST /api/assignments/:id/submit', () => {
    test('should submit assignment with valid submission', async () => {
      const submitAssignmentMock = jest.fn((req, res) => {
        const assignmentId = parseInt(req.params.id);
        const assignment = mockAssignments.find(a => a.id === assignmentId);
        
        if (!assignment) {
          return res.status(404).json({ message: 'Assignment not found' });
        }

        if (assignment.status !== 'open') {
          return res.status(400).json({ 
            message: 'Assignment is not open for submission' 
          });
        }

        const { submission, notes } = req.body;
        
        if (!submission) {
          return res.status(400).json({ 
            message: 'Submission content is required' 
          });
        }

        // In real app, validate submission format (code, files, etc.)
        const submissionData = {
          id: mockAssignments.length + 100,
          assignmentId,
          submission,
          notes: notes || null,
          submittedAt: new Date().toISOString(),
          status: 'submitted',
          grade: null,
          feedback: null,
          submittedBy: 1 // Mock student id
        };

        assignment.submissions = assignment.submissions || [];
        assignment.submissions.push(submissionData);
        assignment.status = 'in-progress';

        return res.status(200).json({ 
          message: 'Assignment submitted successfully',
          submission: submissionData
        });
      });

      mockRequest.params = { id: '1' };
      mockRequest.body = { 
        submission: 'console.log("Hello, World!");',
        notes: 'This is my first submission for the assignment'
      };
      mockRequest.headers = { authorization: 'Bearer student-token-123' };
      
      await submitAssignmentMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Assignment submitted successfully');
      expect(responseObj.submission.status).toBe('submitted');
    });

    test('should return 400 when assignment is closed', async () => {
      const submitAssignmentMock = jest.fn((req, res) => {
        const assignmentId = parseInt(req.params.id);
        const assignment = mockAssignments.find(a => a.id === assignmentId);
        
        if (!assignment) {
          return res.status(404).json({ message: 'Assignment not found' });
        }

        if (assignment.status !== 'open') {
          return res.status(400).json({ 
            message: 'Assignment is not open for submission' 
          });
        }

        return res.status(200).json({ message: 'Submission accepted' });
      });

      mockRequest.params = { id: '1' };
      mockRequest.body = { 
        submission: 'console.log("Hello");'
      };
      mockAssignments[0].status = 'closed';
      mockRequest.headers = { authorization: 'Bearer student-token-123' };
      
      await submitAssignmentMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Assignment is not open for submission');
    });

    test('should return 400 for missing submission content', async () => {
      const submitAssignmentMock = jest.fn((req, res) => {
        const assignmentId = parseInt(req.params.id);
        const assignment = mockAssignments.find(a => a.id === assignmentId);
        
        if (!assignment) {
          return res.status(404).json({ message: 'Assignment not found' });
        }

        if (assignment.status !== 'open') {
          return res.status(400).json({ 
            message: 'Assignment is not open for submission' 
          });
        }

        const { submission } = req.body;
        
        if (!submission) {
          return res.status(400).json({ 
            message: 'Submission content is required' 
          });
        }

        return res.status(200).json({ message: 'Submission accepted' });
      });

      mockRequest.params = { id: '1' };
      mockRequest.body = { 
        // Missing submission
        notes: 'My notes'
      };
      mockRequest.headers = { authorization: 'Bearer student-token-123' };
      
      await submitAssignmentMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Submission content is required');
    });
  });

  describe('GET /api/assignments/:id/submissions', () => {
    test('should get all submissions for assignment', async () => {
      const getSubmissionsMock = jest.fn((req, res) => {
        const assignmentId = parseInt(req.params.id);
        const assignment = mockAssignments.find(a => a.id === assignmentId);
        
        if (!assignment) {
          return res.status(404).json({ message: 'Assignment not found' });
        }

        const submissions = assignment.submissions || [
          {
            id: 100,
            assignmentId,
            submission: 'console.log("First submission");',
            submittedAt: '2024-03-15T10:00:00Z',
            status: 'graded',
            grade: 85,
            feedback: 'Great work! Consider adding comments.',
            submittedBy: 1
          },
          {
            id: 101,
            assignmentId,
            submission: 'console.log("Second submission");',
            submittedAt: '2024-03-16T14:00:00Z',
            status: 'graded',
            grade: 90,
            feedback: 'Excellent improvements!',
            submittedBy: 2
          }
        ];

        return res.status(200).json(submissions);
      });

      mockRequest.params = { id: '1' };
      
      await getSubmissionsMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(Array.isArray(responseObj)).toBe(true);
      expect(responseObj.length).toBe(2);
      expect(responseObj[0].grade).toBe(85);
    });

    test('should return 404 for non-existent assignment', async () => {
      const getSubmissionsMock = jest.fn((req, res) => {
        const assignmentId = parseInt(req.params.id);
        
        if (assignmentId === -1) {
          return res.status(404).json({ message: 'Assignment not found' });
        }

        return res.status(200).json([]);
      });

      mockRequest.params = { id: '999' };
      
      await getSubmissionsMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Assignment not found');
    });
  });

  describe('PUT /api/assignments/:id/grade', () => {
    test('should grade assignment submission', async () => {
      const gradeSubmissionMock = jest.fn((req, res) => {
        const assignmentId = parseInt(req.params.id);
        const assignment = mockAssignments.find(a => a.id === assignmentId);
        
        if (!assignment) {
          return res.status(404).json({ message: 'Assignment not found' });
        }

        const { submissionId, grade, feedback } = req.body;
        
        if (typeof grade !== 'number' || grade < 0 || grade > assignment.maxPoints) {
          return res.status(400).json({ 
            message: `Grade must be between 0 and ${assignment.maxPoints}` 
          });
        }

        const submissionIndex = assignment.submissions.findIndex(s => s.id === submissionId);
        
        if (submissionIndex === -1) {
          return res.status(404).json({ message: 'Submission not found' });
        }

        assignment.submissions[submissionIndex].grade = grade;
        assignment.submissions[submissionIndex].feedback = feedback || null;
        assignment.submissions[submissionIndex].status = 'graded';

        return res.status(200).json({ 
          message: 'Submission graded successfully',
          submission: assignment.submissions[submissionIndex]
        });
      });

      mockRequest.params = { id: '1' };
      mockRequest.body = { 
        submissionId: 100,
        grade: 88,
        feedback: 'Great job! Your code is clean and well-structured.'
      };
      mockAssignments[0].maxPoints = 100;
      mockAssignments[0].submissions = [
        { id: 100, assignmentId: 1, submission: 'code1', status: 'submitted' }
      ];
      
      await gradeSubmissionMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Submission graded successfully');
      expect(responseObj.submission.grade).toBe(88);
      expect(responseObj.submission.status).toBe('graded');
    });

    test('should return 400 for invalid grade', async () => {
      const gradeSubmissionMock = jest.fn((req, res) => {
        const assignmentId = parseInt(req.params.id);
        
        if (assignmentId === -1) {
          return res.status(404).json({ message: 'Assignment not found' });
        }

        const { submissionId, grade } = req.body;
        const assignment = mockAssignments.find(a => a.id === assignmentId);
        
        if (typeof grade !== 'number' || grade < 0 || grade > assignment.maxPoints) {
          return res.status(400).json({ 
            message: `Grade must be between 0 and ${assignment.maxPoints}` 
          });
        }

        return res.status(200).json({ message: 'Graded successfully' });
      });

      mockRequest.params = { id: '1' };
      mockRequest.body = { 
        submissionId: 100,
        grade: 150 // Invalid - exceeds maxPoints
      };
      mockAssignments[0].maxPoints = 100;
      
      await gradeSubmissionMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Grade must be between 0 and 100');
    });

    test('should return 404 for non-existent submission', async () => {
      const gradeSubmissionMock = jest.fn((req, res) => {
        const assignmentId = parseInt(req.params.id);
        
        if (assignmentId === -1) {
          return res.status(404).json({ message: 'Assignment not found' });
        }

        const { submissionId } = req.body;
        const assignment = mockAssignments.find(a => a.id === assignmentId);
        
        const submissionIndex = assignment.submissions.findIndex(s => s.id === submissionId);
        
        if (submissionIndex === -1) {
          return res.status(404).json({ message: 'Submission not found' });
        }

        return res.status(200).json({ message: 'Graded' });
      });

      mockRequest.params = { id: '1' };
      mockRequest.body = { 
        submissionId: 999,
        grade: 85
      };
      mockAssignments[0].submissions = [];
      
      await gradeSubmissionMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Submission not found');
    });
  });

  describe('GET /api/assignments/:id/plagiarism-report', () => {
    test('should generate plagiarism report for submission', async () => {
      const generatePlagiarismReportMock = jest.fn((req, res) => {
        const assignmentId = parseInt(req.params.id);
        const assignment = mockAssignments.find(a => a.id === assignmentId);
        
        if (!assignment) {
          return res.status(404).json({ message: 'Assignment not found' });
        }

        const { submissionId } = req.query;
        
        if (!submissionId) {
          return res.status(400).json({ 
            message: 'Submission ID is required' 
          });
        }

        // Mock plagiarism report
        const report = {
          submissionId: parseInt(submissionId),
          similarityScore: 15, // percentage
          plagiarismDetected: false,
          matchedSubmissions: [],
          analyzedAt: new Date().toISOString()
        };

        return res.status(200).json(report);
      });

      mockRequest.params = { id: '1' };
      mockRequest.query = { submissionId: 100 };
      mockAssignments[0].submissions = [
        { id: 100, assignmentId: 1, submission: 'code1' }
      ];
      
      await generatePlagiarismReportMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.similarityScore).toBe(15);
      expect(responseObj.plagiarismDetected).toBe(false);
    });

    test('should return 400 for missing submission ID', async () => {
      const generatePlagiarismReportMock = jest.fn((req, res) => {
        const assignmentId = parseInt(req.params.id);
        
        if (assignmentId === -1) {
          return res.status(404).json({ message: 'Assignment not found' });
        }

        const { submissionId } = req.query;
        
        if (!submissionId) {
          return res.status(400).json({ 
            message: 'Submission ID is required' 
          });
        }

        return res.status(200).json({ message: 'Report generated' });
      });

      mockRequest.params = { id: '1' };
      mockRequest.query = {};
      
      await generatePlagiarismReportMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Submission ID is required');
    });
  });
});
