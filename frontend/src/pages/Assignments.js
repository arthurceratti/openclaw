import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssignments } from '../context/AssignmentsContext';

function Assignments() {
  const navigate = useNavigate();
  const { assignments, loading } = useAssignments();

  useEffect(() => {
    if (loading) {
      console.log('Loading assignments...');
    }
  }, [loading]);

  const handleAssignmentClick = (assignment) => {
    navigate(`/assignments/${assignment.id}`, { state: { assignment } });
  };

  return (
    <div className="assignments-page">
      <h1>Minhas Atividades</h1>
      {loading ? (
        <p>Loading...</p>
      ) : assignments.length === 0 ? (
        <p>Nenhuma atividade encontrada.</p>
      ) : (
        <div className="assignment-grid">
          {assignments.map(assignment => (
            <div key={assignment.id} className="assignment-card" onClick={() => handleAssignmentClick(assignment)}>
              <h3>{assignment.title}</h3>
              <span className={`status-badge ${assignment.status}`}>{assignment.status}</span>
              <p>{assignment.description}</p>
              <div className="meta">
                <span>Prazo: {assignment.dueDate}</span>
                <span>Pontos: {assignment.points}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Assignments;
