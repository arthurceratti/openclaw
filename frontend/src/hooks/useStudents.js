import { useState, useEffect } from 'react';

const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/students');
      if (!response.ok) {
        throw new Error('Falha ao carregar alunos');
      }
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStudentById = (id) => {
    return students.find(student => student.id === id);
  };

  const refreshStudents = fetchStudents;

  return { students, isLoading, error, getStudentById, refreshStudents };
};

export default useStudents;
