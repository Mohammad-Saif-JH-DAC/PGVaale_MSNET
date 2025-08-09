import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import Toast from '../utils/Toast';




function RoomDetails() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [message, setMessage] = useState('');
  const [interestMsg, setInterestMsg] = useState('');
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('token');
  let username = '';
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Extract username from the correct claim types based on the actual JWT structure
      username = payload.unique_name || 
                 payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 
                 payload.name || 
                 payload.sub || 
                 payload.username || 
                 payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
                 '';
    } catch {}
  }

  useEffect(() => {
    api.get(`/api/pgrooms/${id}`).then(res => setRoom(res.data));
  }, [id]);

  const handleInterest = async (e) => {
    e.preventDefault();
    setSuccess('');
    try {
      await api.post('/api/room-interests', {
        roomId: room.id,
        username,
        message: interestMsg
      });
      setSuccess('Interest/request sent!');
      Toast.success('Interest/request sent!');
      setInterestMsg('');
    } catch {
      setSuccess('Interest/request sent!');
      Toast.error('Failed to send request');
    }
  };

  if (!room) return <div className="container mt-5">Loading...</div>;

  return (
    <div className="container mt-5">
      <h2>{room.title}</h2>
      <p><b>Address:</b> {room.address}</p>
      <p><b>Region:</b> {room.region}</p>
      <p><b>State:</b> {room.state}</p>
      <p><b>Gender:</b> {room.gender}</p>
      <p><b>Rent:</b> {room.rent}</p>
      <p><b>Available:</b> {room.available ? 'Yes' : 'No'}</p>
      {/* Add amenities, images, map, etc. here */}
      {username && (
        <form className="mt-4" onSubmit={handleInterest} style={{maxWidth: 400}}>
          <h5>Express Interest / Enquiry</h5>
          <textarea className="form-control mb-2" value={interestMsg} onChange={e => setInterestMsg(e.target.value)} placeholder="Message (optional)" />
          <button className="btn btn-primary w-100" type="submit">Send Request</button>
          {success && <div className="alert alert-info mt-2">{success}</div>}
        </form>
      )}
    </div>
  );
}

export default RoomDetails; 