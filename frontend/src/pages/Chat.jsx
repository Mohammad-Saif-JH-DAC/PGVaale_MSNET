import React, { useState } from 'react';

const regions = ['North', 'South', 'East', 'West', 'Central'];

function Chat() {
  const token = localStorage.getItem('token');
  let username = '';
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      username = payload.sub || payload.username || '';
    } catch {}
  }
  const [region, setRegion] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = e => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { user: username, text: input, time: new Date().toLocaleTimeString() }]);
    setInput('');
  };

  if (!username) return <div className="container mt-5">Please log in to access chat.</div>;

  return (
    <div className="container mt-5" style={{maxWidth: 600}}>
      <h2>Region Group Chat</h2>
      <div className="mb-3">
        <select className="form-select" value={region} onChange={e => setRegion(e.target.value)}>
          <option value="">Select Region</option>
          {regions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      {region && (
        <div className="card p-3">
          <div style={{height: 200, overflowY: 'auto', background: '#f8f9fa', marginBottom: 10}}>
            {messages.filter(m => m.region === region || !m.region).map((m, i) => (
              <div key={i}><b>{m.user}</b>: {m.text} <span className="text-muted" style={{fontSize: '0.8em'}}>{m.time}</span></div>
            ))}
          </div>
          <form className="d-flex" onSubmit={handleSend}>
            <input className="form-control me-2" value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message..." />
            <button className="btn btn-primary" type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat; 