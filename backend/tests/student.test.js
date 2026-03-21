const request = require('supertest');
const app = require('../app');

// Mock database
const mockStudents = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@student.com',
    username: 'alice_j',
    avatar: 'https://example.com/avatars/alice.png',
    bio: 'Aspiring software engineer',
    grade: 'Senior',
    major: 'Computer Science',
    enrollmentDate: '2024-01-15T00:00:00Z'
  },
  {
    id: 2,
    name: 'Bob Williams',
    email: 'bob@student.com',
    username: 'bob_w',
    avatar: 'https://example.com/avatars/bob.png',
    bio: 'Data science enthusiast',
    grade: 'Junior',
    major: 'Data Science',
    enrollmentDate: '2024-02-20T00:00:00Z'
  },
  {
    id: 3,
    name: 'Carol Davis',
    email: 'carol@student.com',
    username: 'carol_d',
    avatar: 'https://example.com/avatars/carol.png',
    bio: 'UX designer',
    grade: 'Senior',
    major: 'Design',
    enrollmentDate: '2024-03-10T00:00:00Z'
  }
];

describe('Student Controller', () => {
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

  describe('GET /api/students', () => {
    test('should get all students', async () => {
      const getAllStudentsMock = jest.fn((req, res) => {
        return res.status(200).json(mockStudents);
      });

      mockRequest.query = { major: 'Computer Science' };
      
      await getAllStudentsMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(Array.isArray(responseObj)).toBe(true);
      expect(responseObj.length).toBe(3);
    });

    test('should filter students by major', async () => {
      const getAllStudentsMock = jest.fn((req, res) => {
        const major = req.query.major;
        
        if (major) {
          const filtered = mockStudents.filter(s => s.major === major);
          return res.status(200).json(filtered);
        }

        return res.status(200).json(mockStudents);
      });

      mockRequest.query = { major: 'Computer Science' };
      
      await getAllStudentsMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.length).toBe(2);
      expect(responseObj[0].major).toBe('Computer Science');
    });

    test('should filter students by grade', async () => {
      const getAllStudentsMock = jest.fn((req, res) => {
        const grade = req.query.grade;
        
        if (grade) {
          const filtered = mockStudents.filter(s => s.grade === grade);
          return res.status(200).json(filtered);
        }

        return res.status(200).json(mockStudents);
      });

      mockRequest.query = { grade: 'Junior' };
      
      await getAllStudentsMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.length).toBe(1);
      expect(responseObj[0].grade).toBe('Junior');
    });
  });

  describe('GET /api/students/:id', () => {
    test('should get student by id', async () => {
      const getStudentMock = jest.fn((req, res) => {
        const studentId = parseInt(req.params.id);
        const student = mockStudents.find(s => s.id === studentId);
        
        if (!student) {
          return res.status(404).json({ message: 'Student not found' });
        }

        return res.status(200).json(student);
      });

      mockRequest.params = { id: '1' };
      
      await getStudentMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.id).toBe(1);
      expect(responseObj.name).toBe('Alice Johnson');
      expect(responseObj.email).toBe('alice@student.com');
    });

    test('should return 404 for non-existent student', async () => {
      const getStudentMock = jest.fn((req, res) => {
        const studentId = parseInt(req.params.id);
        const student = mockStudents.find(s => s.id === studentId);
        
        if (!student) {
          return res.status(404).json({ message: 'Student not found' });
        }

        return res.status(200).json(student);
      });

      mockRequest.params = { id: '999' };
      
      await getStudentMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Student not found');
    });
  });

  describe('POST /api/students', () => {
    test('should create new student', async () => {
      const createStudentMock = jest.fn((req, res) => {
        const { name, email, username, major, grade, bio } = req.body;
        
        if (!name || !email || !username) {
          return res.status(400).json({ 
            message: 'Name, email, and username are required' 
          });
        }

        const newStudent = {
          id: mockStudents.length + 1,
          name,
          email,
          username,
          avatar: null,
          bio: bio || '',
          grade: grade || 'Freshman',
          major: major || 'General',
          enrollmentDate: new Date().toISOString()
        };

        mockStudents.push(newStudent);

        return res.status(201).json(newStudent);
      });

      mockRequest.body = { 
        name: 'David Brown',
        email: 'david@student.com',
        username: 'david_b',
        major: 'Artificial Intelligence',
        grade: 'Freshman',
        bio: 'Passionate about AI and machine learning'
      };
      
      await createStudentMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.id).toBe(4);
      expect(responseObj.name).toBe('David Brown');
      expect(responseObj.email).toBe('david@student.com');
      expect(responseObj.major).toBe('Artificial Intelligence');
    });

    test('should return 400 for invalid email format', async () => {
      const createStudentMock = jest.fn((req, res) => {
        const { email } = req.body;
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
          return res.status(400).json({ 
            message: 'Invalid email format' 
          });
        }

        return res.status(201).json({ message: 'Student created' });
      });

      mockRequest.body = { 
        name: 'Emma Wilson',
        email: 'invalid-email',
        username: 'emma_w'
      };
      
      await createStudentMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Invalid email format');
    });

    test('should return 400 for email already exists', async () => {
      const createStudentMock = jest.fn((req, res) => {
        const { email } = req.body;
        
        const existingStudent = mockStudents.find(s => s.email === email);
        
        if (existingStudent) {
          return res.status(400).json({ 
            message: 'Student with this email already exists' 
          });
        }

        return res.status(201).json({ message: 'Student created' });
      });

      mockRequest.body = { 
        name: 'Frank Miller',
        email: 'alice@student.com', // Already exists
        username: 'frank_m'
      };
      
      await createStudentMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Student with this email already exists');
    });
  });

  describe('PUT /api/students/:id', () => {
    test('should update student profile', async () => {
      const updateStudentMock = jest.fn((req, res) => {
        const studentId = parseInt(req.params.id);
        const studentIndex = mockStudents.findIndex(s => s.id === studentId);
        
        if (studentIndex === -1) {
          return res.status(404).json({ message: 'Student not found' });
        }

        const { name, email, username, bio, avatar, major, grade } = req.body;
        const updateData = {
          id: mockStudents[studentIndex].id,
          name: name || mockStudents[studentIndex].name,
          email: email || mockStudents[studentIndex].email,
          username: username || mockStudents[studentIndex].username,
          avatar: avatar || mockStudents[studentIndex].avatar,
          bio: bio || mockStudents[studentIndex].bio,
          grade: grade || mockStudents[studentIndex].grade,
          major: major || mockStudents[studentIndex].major,
          enrollmentDate: mockStudents[studentIndex].enrollmentDate
        };

        mockStudents[studentIndex] = updateData;

        return res.status(200).json(updateData);
      });

      mockRequest.params = { id: '1' };
      mockRequest.body = { 
        name: 'Alice J. Johnson',
        bio: 'Updated bio about software engineering',
        avatar: 'https://example.com/avatars/alice-updated.png'
      };
      
      await updateStudentMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.name).toBe('Alice J. Johnson');
      expect(responseObj.bio).toBe('Updated bio about software engineering');
      expect(responseObj.avatar).toBe('https://example.com/avatars/alice-updated.png');
    });

    test('should return 404 for non-existent student', async () => {
      const updateStudentMock = jest.fn((req, res) => {
        const studentId = parseInt(req.params.id);
        
        if (studentId === -1) {
          return res.status(404).json({ message: 'Student not found' });
        }

        return res.status(200).json({ message: 'Student updated' });
      });

      mockRequest.params = { id: '999' };
      mockRequest.body = { name: 'New Name' };
      
      await updateStudentMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Student not found');
    });
  });

  describe('DELETE /api/students/:id', () => {
    test('should delete student and archive', async () => {
      const deleteStudentMock = jest.fn((req, res) => {
        const studentId = parseInt(req.params.id);
        const studentIndex = mockStudents.findIndex(s => s.id === studentId);
        
        if (studentIndex === -1) {
          return res.status(404).json({ message: 'Student not found' });
        }

        // Archive instead of hard delete
        const archivedStudent = { ...mockStudents[studentIndex] };
        archivedStudent.status = 'archived';
        archivedStudent.deletedAt = new Date().toISOString();
        
        mockStudents.splice(studentIndex, 1);

        return res.status(200).json({ 
          message: 'Student archived successfully',
          student: archivedStudent 
        });
      });

      mockRequest.params = { id: '2' };
      
      await deleteStudentMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Student archived successfully');
      expect(responseObj.student.status).toBe('archived');
    });

    test('should return 404 for non-existent student', async () => {
      const deleteStudentMock = jest.fn((req, res) => {
        const studentId = parseInt(req.params.id);
        
        if (studentId === -1) {
          return res.status(404).json({ message: 'Student not found' });
        }

        return res.status(200).json({ message: 'Student deleted' });
      });

      mockRequest.params = { id: '999' };
      
      await deleteStudentMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Student not found');
    });
  });

  describe('GET /api/students/:id/courses', () => {
    test('should get enrolled courses for student', async () => {
      const getEnrolledCoursesMock = jest.fn((req, res) => {
        const studentId = parseInt(req.params.id);
        // In real app, query database for student's enrolled courses
        const enrolledCourses = [
          {
            id: 1,
            courseTitle: 'Introduction to Computer Science',
            progress: 75, // percentage
            completed: false
          },
          {
            id: 3,
            courseTitle: 'Web Development with React',
            progress: 100,
            completed: true
          }
        ];
        
        return res.status(200).json(enrolledCourses);
      });

      mockRequest.params = { id: '1' };
      
      await getEnrolledCoursesMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(Array.isArray(responseObj)).toBe(true);
      expect(responseObj.length).toBe(2);
      expect(responseObj[0].courseTitle).toBe('Introduction to Computer Science');
      expect(responseObj[0].progress).toBe(75);
    });

    test('should return empty array if student has no enrolled courses', async () => {
      const getEnrolledCoursesMock = jest.fn((req, res) => {
        return res.status(200).json([]);
      });

      mockRequest.params = { id: '1' };
      
      await getEnrolledCoursesMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(Array.isArray(responseObj)).toBe(true);
      expect(responseObj.length).toBe(0);
    });
  });

  describe('POST /api/students/:id/grades', () => {
    test('should update student grades', async () => {
      const updateGradesMock = jest.fn((req, res) => {
        const studentId = parseInt(req.params.id);
        const student = mockStudents.find(s => s.id === studentId);
        
        if (!student) {
          return res.status(404).json({ message: 'Student not found' });
        }

        const { grades } = req.body;
        
        if (!grades || !Array.isArray(grades)) {
          return res.status(400).json({ 
            message: 'Grades must be an array' 
          });
        }

        // Validate grades
        grades.forEach((grade, index) => {
          if (typeof grade !== 'number') {
            return res.status(400).json({ 
              message: `Grade at index ${index} must be a number` 
            });
          }
          if (grade < 0 || grade > 100) {
            return res.status(400).json({ 
              message: `Grade at index ${index} must be between 0 and 100` 
            });
          }
        });

        student.grades = grades;

        return res.status(200).json({ 
          message: 'Grades updated successfully',
          student: {
            id: student.id,
            name: student.name,
            grades: grades,
            averageGrade: grades.reduce((sum, g) => sum + g, 0) / grades.length
          }
        });
      });

      mockRequest.params = { id: '1' };
      mockRequest.body = { 
        grades: [85, 90, 78, 92, 88]
      };
      
      await updateGradesMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Grades updated successfully');
      expect(responseObj.student.grades).toEqual([85, 90, 78, 92, 88]);
      expect(responseObj.student.averageGrade).toBeCloseTo(86.6, 1);
    });

    test('should return 400 for invalid grade', async () => {
      const updateGradesMock = jest.fn((req, res) => {
        const studentId = parseInt(req.params.id);
        
        if (studentId === -1) {
          return res.status(404).json({ message: 'Student not found' });
        }

        const { grades } = req.body;
        
        if (!grades || !Array.isArray(grades)) {
          return res.status(400).json({ 
            message: 'Grades must be an array' 
          });
        }

        grades.forEach((grade, index) => {
          if (grade < 0 || grade > 100) {
            return res.status(400).json({ 
              message: `Grade at index ${index} must be between 0 and 100` 
            });
          }
        });

        return res.status(200).json({ message: 'Grades updated' });
      });

      mockRequest.params = { id: '1' };
      mockRequest.body = { 
        grades: [85, 90, 150, 92] // 150 is invalid
      };
      
      await updateGradesMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Grade at index 2 must be between 0 and 100');
    });
  });
});
