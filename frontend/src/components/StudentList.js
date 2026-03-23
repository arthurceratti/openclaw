import React from 'react';
import StudentCard from './StudentCard';

const StudentList = ({ students }) => {
  return (
    <div className="student-list">
      <h2 className="list-title">Alunos Matriculados</h2>
      <div className="students-grid">
        {students.map(student => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>
    </div>
  );
};

export default StudentList;
