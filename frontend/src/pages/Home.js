import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-page">
      <h1>Bem-vindo à Plataforma de Ensino</h1>
      <div className="welcome-content">
        <p>Explore cursos, atividades e alunos em um ambiente intuitivo.</p>
        <Link to="/courses" className="btn btn-primary">Ver Cursos</Link>
        <Link to="/assignments" className="btn btn-secondary">Ver Atividades</Link>
      </div>
    </div>
  );
}

export default Home;
