import React from 'react';

const Header = ({ user, onLogout }) => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="brand">Plataforma de Ensino</h1>
        <div className="user-info">
          <span className="user-name">{user?.name || 'Visitante'}</span>
          <button className="logout-btn" onClick={onLogout}>
            Sair
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
