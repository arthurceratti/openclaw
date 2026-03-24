import { createContext, useContext, useState, useEffect } from 'react';

const StudentsContext = createContext();

export function StudentsProvider({ children }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/students', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setStudents(data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentsContext.Provider value={{ students, loading, fetchStudents }}>
      {children}
    </StudentsContext.Provider>
  );
}

export function useStudents() {
  const context = useContext(StudentsContext);
  if (!context) {
    throw new Error('useStudents must be used within a StudentsProvider');
  }
  return context;
}
