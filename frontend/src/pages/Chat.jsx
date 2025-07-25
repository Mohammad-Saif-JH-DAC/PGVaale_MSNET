import React, { useState, useEffect } from 'react';

// Define the allowed regions as discussed
const allowedRegions = [
  'Mumbai', 'Delhi', 'Pune', 'Bangalore', 'Hyderabad'
];

function Chat() {
  const token = localStorage.getItem('token');
  let username = '';
  let userRole = '';

  // Decode token to get username and role
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      username = payload.sub || payload.username || '';
      // Adjust based on your JWT structure, e.g., payload.role or payload.authorities
      userRole = (payload.role || '').toLowerCase(); 
    } catch (e) {
      console.error("Failed to decode token", e);
    }
  }

  // State for messages - now includes region
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  // State for the region the user selects or is associated with
  const [selectedRegion, setSelectedRegion] = useState('');
  // State for the regions available to the current user (e.g., Owner's regions)
  const [userAllowedRegions, setUserAllowedRegions] = useState([]);

  // Simulate fetching allowed regions for the user (e.g., from backend or props)
  // For an Owner, this would be the regions of their listings.
  // For a User/Tenant, this might be their preferred regions or regions of listings they are interested in.
  // For now, we'll simulate it. In a real app, you'd fetch this.
  useEffect(() => {
    if (username) {
      // Example: Fetch user's allowed regions from backend
      // fetch(`/api/user/${username}/allowed-regions`)
      //   .then(res => res.json())
      //   .then(data => setUserAllowedRegions(data.regions));
      
      // Simulate: Owner has listings in Mumbai and Delhi
      // User/Tenant might have different logic
      if (userRole === 'owner') {
         // Placeholder logic - In reality, fetch based on owner's listings
         // For demo, assume owner is allowed to chat in Mumbai and Delhi
         setUserAllowedRegions(['Mumbai', 'Delhi']); 
      } else {
         // For other roles, perhaps allow all predefined regions for demo
         // Or fetch based on their preferences/listings they are interested in
         setUserAllowedRegions(allowedRegions); 
      }
    }
  }, [username, userRole]);

  const handleSend = e => {
    e.preventDefault();
    if (!input.trim() || !selectedRegion) return;
    
    // Add message with the currently selected region
    const newMessage = {
      user: username,
      text: input,
      time: new Date().toLocaleTimeString(),
      region: selectedRegion // Attach the region to the message
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInput('');
  };

  if (!username) {
    return <div className="container mt-5">Please log in to access chat.</div>;
  }

  return (
    <div className="container mt-5" style={{ maxWidth: 600 }}>
      <h2>Region Group Chat</h2>
      
      {/* Region selection dropdown, limited to user's allowed regions */}
      <div className="mb-3">
        <select 
          className="form-select" 
          value={selectedRegion} 
          onChange={e => setSelectedRegion(e.target.value)}
          disabled={userAllowedRegions.length === 0} // Disable until regions are loaded
        >
          <option value="">Select an Allowed Region</option>
          {userAllowedRegions
            .filter(region => allowedRegions.includes(region)) // Ensure it's a globally allowed region too
            .map(region => (
              <option key={region} value={region}>
                {region}
              </option>
            ))
          }
        </select>
        {userAllowedRegions.length === 0 && <small className="text-muted">Loading allowed regions...</small>}
      </div>

      {/* Chat interface, shown only if a valid region is selected */}
      {selectedRegion && allowedRegions.includes(selectedRegion) ? (
        <div className="card p-3">
          <div style={{ height: 200, overflowY: 'auto', background: '#f8f9fa', marginBottom: 10 }}>
            {/* Filter messages to show only those for the selected region */}
            {messages
              .filter(m => m.region === selectedRegion)
              .map((m, i) => (
                <div key={i}>
                  <b>{m.user}</b>: {m.text} 
                  <span className="text-muted" style={{ fontSize: '0.8em' }}> {m.time}</span>
                </div>
              ))
            }
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
         // Handle case where a previously selected region is no longer valid or allowed
         <div className="alert alert-warning">
            Chat is not available for the selected region or you do not have permission for it.
         </div>
      ) : (
         // Initial state or if no region is selected
         <div className="alert alert-info">
            Please select an allowed region to join the chat.
         </div>
      )}
    </div>
  );
}

export default Chat;