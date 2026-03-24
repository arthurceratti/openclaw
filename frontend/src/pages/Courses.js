import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '../context/CoursesContext';

function Courses() {
  const navigate = useNavigate();
  const { courses, loading } = useCourses();

  useEffect(() => {
    if (loading) {
      console.log('Loading courses...');
    }
  }, [loading]);

  const handleCourseClick = (course) => {
    navigate(`/courses/${course.id}`, { state: { course } });
  };

  return (
    <div className="courses-page">
      <h1>Meus Cursos</h1>
      {loading ? (
        <p>Loading...</p>
      ) : courses.length === 0 ? (
        <p>Nenhum curso encontrado.</p>
      ) : (
        <div className="course-grid">
          {courses.map(course => (
            <div key={course.id} className="course-card" onClick={() => handleCourseClick(course)}>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <span className="category">{course.category}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Courses;
