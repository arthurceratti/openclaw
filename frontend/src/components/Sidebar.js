import React from 'react';

const Sidebar = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'Início', icon: '🏠' },
    { id: 'courses', label: 'Cursos', icon: '📚' },
    { id: 'assignments', label: 'Atividades', icon: '📝' },
    { id: 'students', label: 'Alunos', icon: '👨‍🎓' },
    { id: 'settings', label: 'Configurações', icon: '⚙️' },
  ];

  return (
    <aside className="sidebar">
      <nav className="nav-menu">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="nav-icon">{tab.icon}</span>
            <span className="nav-label">{tab.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
