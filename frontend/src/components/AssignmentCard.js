import React from 'react';

const AssignmentCard = ({ assignment, onClick }) => {
  return (
    <div className="assignment-card" onClick={() => onClick(assignment)}>
      <div className="assignment-header">
        <h3 className="assignment-title">{assignment.title}</h3>
        <span className={`status-badge ${assignment.status}`}>({assignment.status})</span>
      </div>
      <p className="assignment-description">{assignment.description}</p>
      <div className="assignment-meta">
        <span className="assignment-due">📅 Prazo: {assignment.dueDate}</span>
        <span className="assignment-points">🏆 Pontos: {assignment.points}</span>
      </div>
    </div>
  );
};

export default AssignmentCard;
