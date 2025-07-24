import React, { useEffect, useState } from 'react';
import api from '../api';

function OwnerDashboard() {
  const token = localStorage.getItem('token');
  let username = '';
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      username = payload.sub || payload.username || '';
    } catch {}
  }

  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({ title: '', address: '', region: '', state: '', gender: '', rent: '', available: true });
  const [editingId, setEditingId] = useState(null);
  const [interestCounts, setInterestCounts] = useState({});
  const [showInterests, setShowInterests] = useState(null);
  const [interests, setInterests] = useState([]);

  useEffect(() => {
    if (username) {
      api.get(`/pgrooms/owner/${username}`).then(res => {
        setRooms(res.data);
        // Fetch interest counts for each room
        res.data.forEach(room => {
          api.get(`/room-interests/room/${room.id}`).then(r => {
            setInterestCounts(prev => ({ ...prev, [room.id]: r.data.length }));
          });
        });
      });
    }
  }, [username]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = { ...form, rent: parseFloat(form.rent), available: form.available === 'true' || form.available === true, createdBy: username };
    if (editingId) {
      await api.put(`/pgrooms/${editingId}`, data);
      setEditingId(null);
    } else {
      await api.post('/pgrooms', data);
    }
    api.get(`/pgrooms/owner/${username}`).then(res => setRooms(res.data));
    setForm({ title: '', address: '', region: '', state: '', gender: '', rent: '', available: true });
  };

  const handleEdit = room => {
    setForm(room);
    setEditingId(room.id);
  };

  const handleDelete = async id => {
    await api.delete(`/pgrooms/${id}`);
    setRooms(rooms.filter(r => r.id !== id));
  };

  const handleToggle = async room => {
    await api.put(`/pgrooms/${room.id}`, { ...room, available: !room.available });
    api.get(`/pgrooms/owner/${username}`).then(res => setRooms(res.data));
  };

  const handleShowInterests = async (roomId) => {
    const res = await api.get(`/room-interests/room/${roomId}`);
    setInterests(res.data);
    setShowInterests(roomId);
  };
  const handleCloseInterests = () => setShowInterests(null);

  return (
    <div className="container mt-5">
      <h2>Owner Dashboard</h2>
      <form className="row g-3 mb-4" onSubmit={handleSubmit} style={{maxWidth: 600}}>
        <div className="col-md-6">
          <input className="form-control" name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <input className="form-control" name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
        </div>
        <div className="col-md-4">
          <input className="form-control" name="region" placeholder="Region" value={form.region} onChange={handleChange} required />
        </div>
        <div className="col-md-4">
          <input className="form-control" name="state" placeholder="State" value={form.state} onChange={handleChange} required />
        </div>
        <div className="col-md-2">
          <select className="form-select" name="gender" value={form.gender} onChange={handleChange} required>
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="col-md-2">
          <input className="form-control" name="rent" placeholder="Rent" type="number" value={form.rent} onChange={handleChange} required />
        </div>
        <div className="col-md-3">
          <select className="form-select" name="available" value={form.available} onChange={handleChange} required>
            <option value={true}>Available</option>
            <option value={false}>Occupied</option>
          </select>
        </div>
        <div className="col-md-3">
          <button className="btn btn-primary w-100" type="submit">{editingId ? 'Update' : 'Add'} Room</button>
        </div>
      </form>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th>Region</th>
            <th>State</th>
            <th>Gender</th>
            <th>Rent</th>
            <th>Available</th>
            <th>Interested</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map(room => (
            <tr key={room.id}>
              <td>{room.title}</td>
              <td>{room.region}</td>
              <td>{room.state}</td>
              <td>{room.gender}</td>
              <td>{room.rent}</td>
              <td>
                <button className={`btn btn-sm ${room.available ? 'btn-success' : 'btn-secondary'}`} onClick={() => handleToggle(room)}>
                  {room.available ? 'Available' : 'Occupied'}
                </button>
              </td>
              <td>
                <button className="btn btn-link p-0" onClick={() => handleShowInterests(room.id)}>
                  {interestCounts[room.id] || 0} View
                </button>
              </td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(room)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(room.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showInterests && (
        <div className="card p-3 mb-3">
          <h5>Interested Tenants for Room #{showInterests}</h5>
          <button className="btn btn-sm btn-secondary mb-2" onClick={handleCloseInterests}>Close</button>
          <ul>
            {interests.map(i => (
              <li key={i.id}><b>{i.username}</b>: {i.message} <span className="text-muted">({new Date(i.timestamp).toLocaleString()})</span></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default OwnerDashboard; 