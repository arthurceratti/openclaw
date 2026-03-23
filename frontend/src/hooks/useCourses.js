import { useState, useEffect } from 'react';

const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/courses');
      if (!response.ok) {
        throw new Error('Falha ao carregar cursos');
      }
      const data = await response.json();
      setCourses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getCoursesByCategory = (category) => {
    if (filter === 'all') return courses;
    return courses.filter(course => course.category === category);
  };

  const refreshCourses = fetchCourses;

  return { courses, isLoading, error, filter, setFilter, getCoursesByCategory, refreshCourses };
};

export default useCourses;
