import React from 'react';

const CourseCard = ({ course, onClick }) => {
  return (
    <div className="course-card" onClick={() => onClick(course)}>
      <div className="course-image">{course.image || '📚'}</div>
      <div className="course-content">
        <h3 className="course-title">{course.title}</h3>
        <p className="course-description">{course.description}</p>
        <div className="course-meta">
          <span className="course-teacher">Professor: {course.teacher}</span>
          <span className="course-category">{course.category}</span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
