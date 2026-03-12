import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
      fetchCourses(token);
    }
    setLoading(false);
  }, []);

  const fetchUser = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
    } catch (err) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  };

  const fetchCourses = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(response.data);
    } catch (err) {
      console.error('Failed to fetch courses:', err.message);
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (!user) return <div style={styles.error}>Login expired. Please login again.</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>
          Welcome, {user.name} ({user.role})
        </h1>
        <button style={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div style={styles.content}>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Available Courses</h2>
          <div style={styles.coursesGrid}>
            {courses.map((course) => (
              <div key={course.id} style={styles.courseCard}>
                <h3 style={styles.courseTitle}>{course.name}</h3>
                <p style={styles.courseDescription}>{course.description}</p>
                <button style={styles.courseButton} onClick={() => handleCourseClick(course)}>
                  Enter AI Learning Environment
                </button>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Your Dashboard</h2>
          <div style={styles.dashboardCards}>
            <div style={styles.statCard}>
              <h4>Score</h4>
              <p style={styles.statValue}>{user.score || 'N/A'}</p>
            </div>
            <div style={styles.statCard}>
              <h4>Courses</h4>
              <p style={styles.statValue}>{courses.length}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleCourseClick = (course) => {
    // Redirect to AI learning environment
    console.log('Entering AI learning environment for course:', course.name);
    // This would redirect to an AI learning environment page
  };
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f5f5f5',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    background: '#667eea',
    color: 'white',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    margin: 0,
    fontSize: '24px'
  },
  logoutButton: {
    padding: '10px 20px',
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    borderRadius: '5px',
    color: 'white',
    cursor: 'pointer'
  },
  content: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  section: {
    marginBottom: '40px'
  },
  sectionTitle: {
    fontSize: '20px',
    marginBottom: '15px',
    color: '#333'
  },
  coursesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  },
  courseCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    cursor: 'pointer'
  },
  courseTitle: {
    margin: '0 0 10px 0',
    color: '#667eea'
  },
  courseDescription: {
    margin: '0 0 15px 0',
    color: '#666',
    fontSize: '14px'
  },
  courseButton: {
    width: '100%',
    padding: '10px',
    background: '#667eea',
    border: 'none',
    borderRadius: '5px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px'
  },
  dashboardCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px'
  },
  statCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#667eea'
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    color: '#666'
  },
  error: {
    textAlign: 'center',
    padding: '50px',
    color: '#c00'
  }
};

export default Dashboard;
