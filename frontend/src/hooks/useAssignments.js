import { useState, useEffect } from 'react';

const useAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/assignments');
      if (!response.ok) {
        throw new Error('Falha ao carregar atividades');
      }
      const data = await response.json();
      setAssignments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getAssignmentsByStatus = (status) => {
    return assignments.filter(assignment => assignment.status === status);
  };

  const getUpcomingAssignments = () => {
    const now = new Date();
    return assignments
      .filter(assignment => new Date(assignment.dueDate) >= now)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  };

  const refreshAssignments = fetchAssignments;

  return { assignments, isLoading, error, getAssignmentsByStatus, getUpcomingAssignments, refreshAssignments };
};

export default useAssignments;
