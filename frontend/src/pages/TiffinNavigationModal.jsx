import React from 'react';

const TiffinNavigationModal = ({ activeView, setActiveView, onLogout }) => {
  const navItems = [
    { key: 'dashboard', label: '🏠 Dashboard' },
    { key: 'menu', label: '🍽️ Menu' },
    { key: 'requests', label: '📋 Requests' },
    { key: 'profile', label: '👤 Profile' }
  ];

  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
      <div className="btn-group flex-wrap" role="group">
        {navItems.map((item) => (
          <button
            key={item.key}
            className={`btn btn-outline-primary m-1 ${activeView === item.key ? 'active' : ''}`}
            onClick={() => setActiveView(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <button className="btn btn-outline-danger btn-sm m-1" onClick={onLogout}>
        🚪 Logout
      </button>
    </div>
  );
};

export default TiffinNavigationModal;
