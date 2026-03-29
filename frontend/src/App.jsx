import { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Simulate fetching data from API
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/cursos');
        const data = await response.json();
        setCourses(data.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/alunos');
        const data = await response.json();
        setStudents(data.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchCourses();
    fetchStudents();
  }, []);

  return (
    <div className="app">
      <header>
        <h1>Plataforma de Ensino por IA</h1>
        <p>Aprenda React e Desenvolvimento Web</p>
      </header>

      <main>
        <section className="courses-section">
          <h2>Cursos Disponíveis</h2>
          <div className="courses-grid">
            {courses.map(course => (
              <div key={course.id} className="course-card">
                <h3>{course.name}</h3>
                <p>{course.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="students-section">
          <h2>Alunos</h2>
          <div className="students-grid">
            {students.map(student => (
              <div key={student.id} className="student-card">
                <h3>{student.name}</h3>
                <p>{student.email}</p>
                <span>{student.course}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <p>© 2026 Plataforma de Ensino por IA</p>
      </footer>
    </div>
  );
}

export default App;
