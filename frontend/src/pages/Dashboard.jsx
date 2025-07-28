import React from 'react';

function Dashboard() {
  const token = localStorage.getItem('token');
  let role = '';
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      role = payload.role || payload.authorities?.[0]?.authority || '';
    } catch {}
  }

  return (
    <div className="container mt-5">
      <h2>User Dashboard</h2>
      <p><b>Role:</b> {role}</p>
      <p><b>JWT:</b> <code style={{wordBreak:'break-all'}}>{token}</code></p>
    </div>
  );
}

export default Dashboard; 