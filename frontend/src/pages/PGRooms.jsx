import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import MapComponent from './MapComponent';// Ensure path is correct

function PGRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ region: '', gender: '', available: '' });
  const [bookingStatus, setBookingStatus] = useState({});

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/pg/all');
      setRooms(response.data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      let url = '/api/pg/all';
      const params = [];
      if (filters.region) params.push(`region/${filters.region}`);
      if (filters.gender) params.push(`gender/${filters.gender}`);
      if (filters.available) params.push(`available/${filters.available}`);
      if (params.length) url = '/api/pg/' + params.join('/');
      const res = await api.get(url);
      setRooms(res.data || []);
    } catch (error) {
      console.error('Error searching rooms:', error);
    }
  };

  const handleBookRoom = async (roomId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to book a room');
        return;
      }

      setBookingStatus((prev) => ({ ...prev, [roomId]: 'booking' }));

      await api.post('/api/room-interests', {
        roomId,
        message: 'Booking request from PG Rooms page'
      });

      setBookingStatus((prev) => ({ ...prev, [roomId]: 'booked' }));

      setTimeout(() => {
        setBookingStatus((prev) => ({ ...prev, [roomId]: null }));
      }, 3000);
    } catch (error) {
      console.error('Booking failed:', error);
      setBookingStatus((prev) => ({ ...prev, [roomId]: 'error' }));
      setTimeout(() => {
        setBookingStatus((prev) => ({ ...prev, [roomId]: null }));
      }, 3000);
    }
  };

  const regionOptions = ['Mumbai', 'Delhi', 'Pune', 'Bangalore', 'Hyderabad'];

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status"></div>
        <p className="mt-3">Loading PG rooms...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>PG Room Listings</h2>
        <button className="btn btn-outline-primary" onClick={fetchRooms}>
          🔄 Refresh
        </button>
      </div>

      {!sessionStorage.getItem('token') && (
        <div className="alert alert-info mb-4">
          <strong>💡 Tip:</strong> Login to book PG rooms directly from this page!
        </div>
      )}

      {/* FILTER FORM */}
      <form className="row g-3 mb-4" onSubmit={handleSearch}>
        <div className="col-md-3">
          <select className="form-select" name="region" value={filters.region} onChange={handleChange}>
            <option value="">Region</option>
            {regionOptions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select" name="gender" value={filters.gender} onChange={handleChange}>
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Any">Any</option>
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select" name="available" value={filters.available} onChange={handleChange}>
            <option value="">Availability</option>
            <option value="true">Available</option>
            <option value="false">Occupied</option>
          </select>
        </div>
        <div className="col-md-3">
          <button className="btn btn-primary w-100" type="submit">Search</button>
        </div>
      </form>

      {/* ROOM CARDS */}
      {rooms.length > 0 ? (
        <div className="row">
          {rooms.map((room) => (
            <div key={room.id} className="col-md-6 mb-4">
              <div className="card shadow">
                {room.imagePaths?.length > 0 && (
                  <img
                    src={room.imagePaths[0]}
                    alt="Room"
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">PG #{room.id}</h5>
                  <p className="card-text">
                    <strong>Region:</strong> {room.region}<br />
                    <strong>Owner:</strong> {room.owner?.name}<br />
                    <strong>Rent:</strong> ₹{room.rent}<br />
                    <strong>Preference:</strong> {room.generalPreference}<br />
                    <strong>Availability:</strong> {room.availability || 'N/A'}<br />
                    <strong>Amenities:</strong> {room.amenities}<br />
                    <strong>Nearby:</strong> {room.nearbyResources}
                  </p>

                  <MapComponent
                    lat={room.latitude}
                    lng={room.longitude}
                    location={room.region}
                  />

                  <div className="d-flex justify-content-between mt-3">
                    <Link to={`/pgrooms/${room.id}`} className="btn btn-sm btn-primary">View</Link>
                    {sessionStorage.getItem('token') && (
                      <button
                        className={`btn btn-sm ${
                          bookingStatus[room.id] === 'booking' ? 'btn-warning' :
                          bookingStatus[room.id] === 'booked' ? 'btn-success' :
                          bookingStatus[room.id] === 'error' ? 'btn-danger' : 'btn-success'
                        }`}
                        onClick={() => handleBookRoom(room.id)}
                        disabled={bookingStatus[room.id] === 'booking'}
                      >
                        {bookingStatus[room.id] === 'booking' ? 'Booking...' :
                         bookingStatus[room.id] === 'booked' ? 'Booked!' :
                         bookingStatus[room.id] === 'error' ? 'Failed' : 'Book'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center">
          <div className="card-body">
            <h5 className="text-muted">No PG Rooms Found</h5>
            <p className="text-muted">Try adjusting your filters to find available rooms.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PGRooms;
