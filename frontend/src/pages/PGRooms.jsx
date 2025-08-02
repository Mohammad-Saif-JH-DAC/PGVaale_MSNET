import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

function PGRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ region: '', state: '', gender: '', available: '' });
  const [bookingStatus, setBookingStatus] = useState({});

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      console.log('Fetching rooms from /api/pg/all...');
      const response = await api.get('/api/pg/all');
      console.log('Response status:', response.status);
      console.log('Fetched rooms:', response.data);
      console.log('Number of rooms:', response.data ? response.data.length : 0);
      setRooms(response.data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      console.error('Error response:', error.response);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async e => {
    e.preventDefault();
    try {
      let url = '/api/pg/all';
      const params = [];
      if (filters.region) params.push(`region/${filters.region}`);
      if (filters.state) params.push(`state/${filters.state}`);
      if (filters.gender) params.push(`gender/${filters.gender}`);
      if (filters.available) params.push(`available/${filters.available}`);
      if (params.length) url = '/api/pg/' + params.join('/');
      const res = await api.get(url);
      setRooms(res.data);
    } catch (error) {
      console.error('Error searching rooms:', error);
    }
  };

  const handleBookRoom = async (roomId) => {
    try {
      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to book a room');
        return;
      }

      // Set booking status to loading
      setBookingStatus(prev => ({ ...prev, [roomId]: 'booking' }));

      // Create room interest/booking
      await api.post('/api/room-interests', {
        roomId: roomId,
        message: 'Booking request from PG Rooms page'
      });

      // Set booking status to success
      setBookingStatus(prev => ({ ...prev, [roomId]: 'booked' }));
      
      // Show success message
      setTimeout(() => {
        setBookingStatus(prev => ({ ...prev, [roomId]: null }));
      }, 3000);

    } catch (error) {
      console.error('Error booking room:', error);
      setBookingStatus(prev => ({ ...prev, [roomId]: 'error' }));
      
      setTimeout(() => {
        setBookingStatus(prev => ({ ...prev, [roomId]: null }));
      }, 3000);
    }
  };

  const regionOptions = [
    'Mumbai', 'Delhi', 'Pune', 'Bangalore', 'Hyderabad'
  ];
  const genderOptions = [
    'Male', 'Female', 'Both'
  ];

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading PG rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>PG Room Listings</h2>
        <button 
          type="button" 
          className="btn btn-outline-primary"
          onClick={fetchRooms}
        >
          🔄 Refresh
        </button>
      </div>

      {!localStorage.getItem('token') && (
        <div className="alert alert-info mb-4">
          <strong>💡 Tip:</strong> Login to book PG rooms directly from this page!
        </div>
      )}
      <form className="row g-3 mb-4" onSubmit={handleSearch}>
        <div className="col">
          <select className="form-select" name="region" value={filters.region} onChange={handleChange}>
            <option value="">Region</option>
            {regionOptions.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <select className="form-select" name="gender" value={filters.gender} onChange={handleChange}>
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="col-md-2">
          <select className="form-select" name="available" value={filters.available} onChange={handleChange}>
            <option value="">Availability</option>
            <option value="true">Available</option>
            <option value="false">Occupied</option>
          </select>
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" type="submit">Search</button>
        </div>
      </form>
      {rooms.length > 0 ? (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Title</th>
              <th>Region</th>
              <th>Gender</th>
              <th>Rent</th>
              <th>Available</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
                            {rooms.filter(room => !filters.region || room.region === filters.region)
                  .map(room => (
                    <tr key={room.id}>
                      <td>{room.id ? `PG #${room.id}` : 'PG Room'}</td>
                      <td>{room.region || 'N/A'}</td>
                      <td>{room.generalPreference || 'Any'}</td>
                      <td>₹{room.rent || 'N/A'}</td>
                      <td>
                        <span className="badge bg-success">
                          Available
                        </span>
                      </td>
                      <td>
                        <Link to={`/pgrooms/${room.id}`} className="btn btn-sm btn-primary me-2">View</Link>
                        {localStorage.getItem('token') && (
                          <button 
                            className={`btn btn-sm ${
                              bookingStatus[room.id] === 'booking' ? 'btn-warning' :
                              bookingStatus[room.id] === 'booked' ? 'btn-success' :
                              bookingStatus[room.id] === 'error' ? 'btn-danger' :
                              'btn-success'
                            }`}
                            onClick={() => handleBookRoom(room.id)}
                            disabled={bookingStatus[room.id] === 'booking'}
                          >
                            {bookingStatus[room.id] === 'booking' ? 'Booking...' :
                             bookingStatus[room.id] === 'booked' ? 'Booked!' :
                             bookingStatus[room.id] === 'error' ? 'Failed' :
                             'Book'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
          </tbody>
        </table>
      ) : (
        <div className="card">
          <div className="card-body text-center">
            <div className="mb-3">
              <span style={{fontSize: '3rem'}}>🏠</span>
            </div>
            <h5 className="text-muted">No PG Rooms Found</h5>
            <p className="text-muted">No rooms match your search criteria. Try adjusting your filters.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PGRooms; 