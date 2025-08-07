import React, { useState, useEffect } from 'react';
import axios from 'axios';

const allowedRegions = ['Mumbai', 'Delhi', 'Pune', 'Bangalore', 'Hyderabad'];

function Chat() {
  const token = sessionStorage.getItem('token');
  let username = '';
  let userRole = '';

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      username = payload.sub || payload.username || payload.name || '';
      userRole = (payload.role || payload.roles || payload.authorities?.[0] || '').toLowerCase();
      
    } catch (e) {
      console.error("❌ Failed to decode token", e);
    }
  }

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [userAllowedRegions, setUserAllowedRegions] = useState([]);

  // Assign allowed regions once user is identified
  useEffect(() => {
    if (username) {
      if (userRole === 'owner') {
        setUserAllowedRegions(['Mumbai', 'Delhi']);
      } else {
        setUserAllowedRegions(allowedRegions);
      }
    }
  }, [username, userRole]);

  // Fetch messages only after region is selected
  useEffect(() => {
    if (selectedRegion) {
      fetchMessages(selectedRegion);
    }
  }, [selectedRegion]);

  const fetchMessages = async (region) => {
    try {
      const res = await axios.get(`http://localhost:8081/api/chat/messages`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { region: region }
      });
      setMessages(res.data || []);
      console.log("📥 Messages fetched:", res.data);
    } catch (err) {
      console.error("❌ Error fetching messages:", err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!username || !input.trim() || !selectedRegion) {
      alert("Please fill in all fields before sending.");
      return;
    }

    const newMessage = {
      username,
      message: input,
      region: selectedRegion
    };

    console.log("📨 Sending message:", newMessage);

    try {
      await axios.post('http://localhost:8081/api/chat/message', newMessage, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInput('');
      fetchMessages(selectedRegion);
    } catch (err) {
      console.error("❌ Error sending message:", err);
    }
  };

  if (!username) {
    return <div className="container mt-5">Please log in to access chat.</div>;
  }

  return (
    <div className="container mt-5" style={{ maxWidth: 600 }}>
      <h2>Region Group Chat</h2>

      <div className="mb-3">
        <select
          className="form-select"
          value={selectedRegion}
          onChange={e => setSelectedRegion(e.target.value)}
          disabled={userAllowedRegions.length === 0}
        >
          <option value="">Select an Allowed Region</option>
          {userAllowedRegions
            .filter(region => allowedRegions.includes(region))
            .map(region => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
        </select>
        {userAllowedRegions.length === 0 && (
          <small className="text-muted">Loading allowed regions...</small>
        )}
      </div>

      {selectedRegion && allowedRegions.includes(selectedRegion) ? (
        <div className="card p-3">
          <div style={{ height: 200, overflowY: 'auto', background: '#f8f9fa', marginBottom: 10 }}>
            {messages
              .filter(m => m.region === selectedRegion)
              .map((m, i) => (
                <div key={i}>
                  <b>{m.username}</b>: {m.message}
                  <span className="text-muted" style={{ fontSize: '0.8em' }}> {new Date(m.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
            {messages.filter(m => m.region === selectedRegion).length === 0 && (
              <div className="text-muted">No messages yet in {selectedRegion}. Start the conversation!</div>
            )}
          </div>
          <form className="d-flex" onSubmit={handleSend}>
            <input
              className="form-control me-2"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a message..."
            />
            <button className="btn btn-primary" type="submit">Send</button>
          </form>
        </div>
      ) : selectedRegion && !allowedRegions.includes(selectedRegion) ? (
        <div className="alert alert-warning">
          Chat is not available for the selected region or you do not have permission for it.
        </div>
      ) : (
        <div className="alert alert-info">
          Please select an allowed region to join the chat.
        </div>
      )}
    </div>
  );
}

export default Chat;
