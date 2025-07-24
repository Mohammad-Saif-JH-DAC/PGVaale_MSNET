import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

function PGRooms() {
  const [rooms, setRooms] = useState([]);
  const [filters, setFilters] = useState({ region: '', state: '', gender: '', available: '' });

  useEffect(() => {
    api.get('/pgrooms').then(res => setRooms(res.data));
  }, []);

  const handleChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async e => {
    e.preventDefault();
    let url = '/pgrooms';
    const params = [];
    if (filters.region) params.push(`region/${filters.region}`);
    if (filters.state) params.push(`state/${filters.state}`);
    if (filters.gender) params.push(`gender/${filters.gender}`);
    if (filters.available) params.push(`available/${filters.available}`);
    if (params.length) url = '/pgrooms/' + params.join('/');
    const res = await api.get(url);
    setRooms(res.data);
  };

  return (
    <div className="container mt-5">
      <h2>PG Room Listings</h2>
      <form className="row g-3 mb-4" onSubmit={handleSearch}>
        <div className="col-md-3">
          <input className="form-control" name="region" placeholder="Region" value={filters.region} onChange={handleChange} />
        </div>
        <div className="col-md-3">
          <input className="form-control" name="state" placeholder="State" value={filters.state} onChange={handleChange} />
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
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th>Region</th>
            <th>State</th>
            <th>Gender</th>
            <th>Rent</th>
            <th>Available</th>
            <th>Details</th>
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
              <td>{room.available ? 'Yes' : 'No'}</td>
              <td><Link to={`/pgrooms/${room.id}`}>View</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PGRooms; 