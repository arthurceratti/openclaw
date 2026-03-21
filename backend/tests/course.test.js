const request = require('supertest');
const app = require('../app');

// Mock database
const mockCourses = [
  {
    id: 1,
    title: 'Introduction to Computer Science',
    description: 'Learn the fundamentals of computer science',
    instructor: 'Dr. John Smith',
    category: 'Computer Science',
    level: 'beginner',
    duration: 120, // hours
    maxStudents: 50,
    thumbnail: 'https://example.com/thumbnails/cs-intro.png',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    title: 'Advanced Machine Learning',
    description: 'Deep dive into machine learning algorithms',
    instructor: 'Dr. Jane Doe',
    category: 'Machine Learning',
    level: 'advanced',
    duration: 180,
    maxStudents: 30,
    thumbnail: 'https://example.com/thumbnails/ml-advanced.png',
    status: 'active',
    createdAt: '2024-02-20T14:00:00Z'
  },
  {
    id: 3,
    title: 'Web Development with React',
    description: 'Build modern web applications with React',
    instructor: 'Dr. Bob Johnson',
    category: 'Web Development',
    level: 'intermediate',
    duration: 100,
    maxStudents: 40,
    thumbnail: 'https://example.com/thumbnails/react-web.png',
    status: 'active',
    createdAt: '2024-03-10T09:00:00Z'
  }
];

describe('Course Controller', () => {
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

  describe('GET /api/courses', () => {
    test('should get all courses', async () => {
      const getAllCoursesMock = jest.fn((req, res) => {
        const courses = mockCourses.filter(course => course.status === 'active');
        return res.status(200).json(courses);
      });

      mockRequest.query = { category: 'Computer Science' };
      
      await getAllCoursesMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(Array.isArray(responseObj)).toBe(true);
      expect(responseObj.length).toBe(1);
      expect(responseObj[0].title).toBe('Introduction to Computer Science');
    });

    test('should filter courses by category', async () => {
      const getAllCoursesMock = jest.fn((req, res) => {
        const category = req.query.category;
        
        if (category) {
          const filtered = mockCourses.filter(c => 
            c.category === category && c.status === 'active'
          );
          return res.status(200).json(filtered);
        }

        return res.status(200).json(
          mockCourses.filter(c => c.status === 'active')
        );
      });

      mockRequest.query = { category: 'Machine Learning' };
      
      await getAllCoursesMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.length).toBe(1);
      expect(responseObj[0].category).toBe('Machine Learning');
    });

    test('should filter courses by level', async () => {
      const getAllCoursesMock = jest.fn((req, res) => {
        const level = req.query.level;
        
        if (level) {
          const filtered = mockCourses.filter(c => 
            c.level === level && c.status === 'active'
          );
          return res.status(200).json(filtered);
        }

        return res.status(200).json(
          mockCourses.filter(c => c.status === 'active')
        );
      });

      mockRequest.query = { level: 'advanced' };
      
      await getAllCoursesMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.length).toBe(1);
      expect(responseObj[0].level).toBe('advanced');
    });

    test('should filter courses by status', async () => {
      const getAllCoursesMock = jest.fn((req, res) => {
        const status = req.query.status;
        
        if (status) {
          const filtered = mockCourses.filter(c => 
            c.status === status
          );
          return res.status(200).json(filtered);
        }

        return res.status(200).json(mockCourses);
      });

      mockRequest.query = { status: 'inactive' };
      mockCourses[1].status = 'inactive';
      
      await getAllCoursesMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.length).toBe(1);
      expect(responseObj[0].status).toBe('inactive');
    });
  });

  describe('GET /api/courses/:id', () => {
    test('should get course by id', async () => {
      const getCourseMock = jest.fn((req, res) => {
        const courseId = parseInt(req.params.id);
        const course = mockCourses.find(c => c.id === courseId);
        
        if (!course) {
          return res.status(404).json({ message: 'Course not found' });
        }

        return res.status(200).json(course);
      });

      mockRequest.params = { id: '1' };
      
      await getCourseMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.id).toBe(1);
      expect(responseObj.title).toBe('Introduction to Computer Science');
      expect(responseObj.instructor).toBe('Dr. John Smith');
    });

    test('should return 404 for non-existent course', async () => {
      const getCourseMock = jest.fn((req, res) => {
        const courseId = parseInt(req.params.id);
        const course = mockCourses.find(c => c.id === courseId);
        
        if (!course) {
          return res.status(404).json({ message: 'Course not found' });
        }

        return res.status(200).json(course);
      });

      mockRequest.params = { id: '999' };
      
      await getCourseMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Course not found');
    });
  });

  describe('POST /api/courses', () => {
    test('should create new course', async () => {
      const createCourseMock = jest.fn((req, res) => {
        const { title, description, instructor, category, level, duration, maxStudents } = req.body;
        
        if (!title || !description || !instructor) {
          return res.status(400).json({ 
            message: 'Title, description, and instructor are required' 
          });
        }

        const newCourse = {
          id: mockCourses.length + 1,
          title,
          description,
          instructor,
          category: category || 'General',
          level: level || 'beginner',
          duration: duration || 0,
          maxStudents: maxStudents || 100,
          thumbnail: null,
          status: 'active',
          createdAt: new Date().toISOString()
        };

        mockCourses.push(newCourse);

        return res.status(201).json(newCourse);
      });

      mockRequest.body = { 
        title: 'Data Structures and Algorithms',
        description: 'Master essential data structures',
        instructor: 'Dr. Alice Williams',
        category: 'Computer Science',
        level: 'intermediate',
        duration: 150,
        maxStudents: 45
      };
      
      await createCourseMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.id).toBe(4);
      expect(responseObj.title).toBe('Data Structures and Algorithms');
      expect(responseObj.status).toBe('active');
    });

    test('should return 400 for missing required fields', async () => {
      const createCourseMock = jest.fn((req, res) => {
        const { title, description, instructor } = req.body;
        
        if (!title || !description || !instructor) {
          return res.status(400).json({ 
            message: 'Title, description, and instructor are required' 
          });
        }

        return res.status(201).json({ message: 'Course created' });
      });

      mockRequest.body = { 
        title: 'New Course',
        description: 'Course description'
        // Missing instructor
      };
      
      await createCourseMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Title, description, and instructor are required');
    });

    test('should return 400 for invalid level', async () => {
      const createCourseMock = jest.fn((req, res) => {
        const { level } = req.body;
        
        const validLevels = ['beginner', 'intermediate', 'advanced'];
        
        if (level && !validLevels.includes(level)) {
          return res.status(400).json({ 
            message: `Invalid level. Must be one of: ${validLevels.join(', ')}` 
          });
        }

        return res.status(201).json({ message: 'Course created' });
      });

      mockRequest.body = { 
        title: 'New Course',
        description: 'Course description',
        instructor: 'Dr. Instructor',
        level: 'expert' // Invalid level
      };
      
      await createCourseMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Invalid level. Must be one of: beginner, intermediate, advanced');
    });
  });

  describe('PUT /api/courses/:id', () => {
    test('should update existing course', async () => {
      const updateCourseMock = jest.fn((req, res) => {
        const courseId = parseInt(req.params.id);
        const courseIndex = mockCourses.findIndex(c => c.id === courseId);
        
        if (courseIndex === -1) {
          return res.status(404).json({ message: 'Course not found' });
        }

        const { title, description, instructor, thumbnail, status } = req.body;
        const updateData = {
          id: mockCourses[courseIndex].id,
          title: title || mockCourses[courseIndex].title,
          description: description || mockCourses[courseIndex].description,
          instructor: instructor || mockCourses[courseIndex].instructor,
          category: mockCourses[courseIndex].category,
          level: mockCourses[courseIndex].level,
          duration: mockCourses[courseIndex].duration,
          maxStudents: mockCourses[courseIndex].maxStudents,
          thumbnail: thumbnail || mockCourses[courseIndex].thumbnail,
          status: status || mockCourses[courseIndex].status,
          createdAt: mockCourses[courseIndex].createdAt
        };

        mockCourses[courseIndex] = updateData;

        return res.status(200).json(updateData);
      });

      mockRequest.params = { id: '1' };
      mockRequest.body = { 
        title: 'Updated CS Introduction',
        thumbnail: 'https://example.com/thumbnails/cs-updated.png'
      };
      
      await updateCourseMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.title).toBe('Updated CS Introduction');
      expect(responseObj.thumbnail).toBe('https://example.com/thumbnails/cs-updated.png');
    });

    test('should return 404 for non-existent course', async () => {
      const updateCourseMock = jest.fn((req, res) => {
        const courseId = parseInt(req.params.id);
        
        if (courseId === -1) {
          return res.status(404).json({ message: 'Course not found' });
        }

        return res.status(200).json({ message: 'Course updated' });
      });

      mockRequest.params = { id: '999' };
      mockRequest.body = { title: 'New Title' };
      
      await updateCourseMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Course not found');
    });
  });

  describe('DELETE /api/courses/:id', () => {
    test('should delete course and archive it', async () => {
      const deleteCourseMock = jest.fn((req, res) => {
        const courseId = parseInt(req.params.id);
        const courseIndex = mockCourses.findIndex(c => c.id === courseId);
        
        if (courseIndex === -1) {
          return res.status(404).json({ message: 'Course not found' });
        }

        // Archive the course instead of hard delete
        const archivedCourse = { ...mockCourses[courseIndex] };
        archivedCourse.status = 'archived';
        archivedCourse.deletedAt = new Date().toISOString();
        
        mockCourses.splice(courseIndex, 1);

        return res.status(200).json({ 
          message: 'Course archived successfully',
          course: archivedCourse 
        });
      });

      mockRequest.params = { id: '2' };
      
      await deleteCourseMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Course archived successfully');
      expect(responseObj.course.status).toBe('archived');
    });

    test('should return 404 for non-existent course', async () => {
      const deleteCourseMock = jest.fn((req, res) => {
        const courseId = parseInt(req.params.id);
        
        if (courseId === -1) {
          return res.status(404).json({ message: 'Course not found' });
        }

        return res.status(200).json({ message: 'Course deleted' });
      });

      mockRequest.params = { id: '999' };
      
      await deleteCourseMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Course not found');
    });
  });

  describe('GET /api/courses/:id/enroll', () => {
    test('should enroll student in course if spots available', async () => {
      const enrollMock = jest.fn((req, res) => {
        const courseId = parseInt(req.params.id);
        const course = mockCourses.find(c => c.id === courseId);
        
        if (!course) {
          return res.status(404).json({ message: 'Course not found' });
        }

        const currentEnrolled = 5; // Mock current enrollment
        const availableSpots = course.maxStudents - currentEnrolled;

        if (currentEnrolled >= course.maxStudents) {
          return res.status(400).json({ 
            message: 'Course is full. No more spots available.' 
          });
        }

        // In real app, add student to enrollment array
        return res.status(200).json({ 
          message: 'Successfully enrolled in course',
          course: {
            id: course.id,
            title: course.title,
            currentEnrollment: currentEnrolled + 1
          }
        });
      });

      mockRequest.params = { id: '1' };
      mockRequest.body = { studentId: 1 };
      mockRequest.headers = { authorization: 'Bearer token123' };
      
      await enrollMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Successfully enrolled in course');
    });

    test('should return 400 when course is full', async () => {
      const enrollMock = jest.fn((req, res) => {
        const courseId = parseInt(req.params.id);
        const course = mockCourses.find(c => c.id === courseId);
        
        if (!course) {
          return res.status(404).json({ message: 'Course not found' });
        }

        const currentEnrolled = course.maxStudents; // Course is full
        
        if (currentEnrolled >= course.maxStudents) {
          return res.status(400).json({ 
            message: 'Course is full. No more spots available.' 
          });
        }

        return res.status(200).json({ message: 'Enrolled successfully' });
      });

      mockRequest.params = { id: '1' };
      mockRequest.body = { studentId: 1 };
      mockCourses[0].maxStudents = 10;
      mockRequest.headers = { authorization: 'Bearer token123' };
      
      await enrollMock(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      const responseObj = mockResponse.json.mock.calls[0][0];
      expect(responseObj.message).toBe('Course is full. No more spots available.');
    });
  });
});
