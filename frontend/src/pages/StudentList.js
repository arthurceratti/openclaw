import React, { useEffect } from 'react';
import { useStudents } from '../context/StudentsContext';

function StudentList() {
  const { students, loading } = useStudents();

  useEffect(() => {
    if (loading) {
      console.log('Loading students...');
    }
  }, [loading]);

  return (
    <div className="student-list-page">
      <h1>Alunos</h1>
      {loading ? (
        <p>Loading...</p>
      ) : students.length === 0 ? (
        <p>Nenhum aluno encontrado.</p>
      ) : (
        <div className="student-grid">
          {students.map(student => (
            <div key={student.id} className="student-card">
              <h3>{student.name}</h3>
              <p>{student.email}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentList;
