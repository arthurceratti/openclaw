import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Navigation = ({ user, activeTab, onTabChange, onLogout }) => {
  return (
    <div className="navigation-container">
      <Header user={user} onLogout={onLogout} />
      <Sidebar activeTab={activeTab} onTabChange={onTabChange} />
      <main className="main-content">
        <div className="content-area">
          {/* Dynamic content will be rendered here */}
          <div className="welcome-message">
            <h2>Bem-vindo à Plataforma de Ensino</h2>
            <p>Selecione uma opção no menu lateral para continuar.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Navigation;
