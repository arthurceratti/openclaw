import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  return (
    <div className="settings-page">
      <h1>Configurações</h1>
      <div className="settings-content">
        <div className="setting-item">
          <label>Tema</label>
          <button onClick={toggleTheme}>
            {theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
          </button>
        </div>
        <div className="setting-item">
          <label>Usuário</label>
          <p>{user?.name}</p>
        </div>
        <div className="setting-item">
          <label>Email</label>
          <p>{user?.email}</p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
