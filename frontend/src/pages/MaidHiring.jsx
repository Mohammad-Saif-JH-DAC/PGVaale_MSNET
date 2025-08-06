import React, { useState, useEffect } from 'react';
import api from '../api';
import HireMaidModal from '../components/HireMaidModal';

const MaidHiring = () => {
  const [maids, setMaids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMaid, setSelectedMaid] = useState(null);
  const [showHireModal, setShowHireModal] = useState(false);
  const [userId, setUserId] = useState(null);
  const [filterRegion, setFilterRegion] = useState('');

  useEffect(() => {
    fetchMaids();
    // Get user ID from JWT token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.userId) {
          setUserId(payload.userId);
        } else {
          console.warn('No userId found in token payload');
        }
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
  }, [filterRegion]);

  const fetchMaids = async () => {
    try {
      setLoading(true);
      let url = '/api/maid/available';
      if (filterRegion) {
        url += `?region=${encodeURIComponent(filterRegion)}`;
      }
      
      const response = await api.get(url);
      setMaids(response.data);
    } catch (error) {
      setError('Error fetching maids: ' + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleHireMaid = (maid) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to hire a maid');
      return;
    }
    
    if (!userId) {
      setError('Unable to get user information. Please try logging in again.');
      return;
    }
    
    setSelectedMaid(maid);
    setShowHireModal(true);
  };

  const handleCloseModal = () => {
    setShowHireModal(false);
    setSelectedMaid(null);
  };

  const regions = ['Mumbai', 'Delhi', 'Pune', 'Bangalore', 'Hyderabad'];

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading available maids...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">🏠 Hire a Maid</h2>
          
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <div className="row mb-4">
            <div className="col-md-6">
              <label className="form-label">Filter by Region</label>
              <select
                className="form-select"
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
              >
                <option value="">All Regions</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6 d-flex align-items-end">
              <button
                className="btn btn-outline-primary"
                onClick={fetchMaids}
              >
                🔄 Refresh
              </button>
            </div>
          </div>

          {maids.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-3">
                <span style={{fontSize: '3rem'}}>🏠</span>
              </div>
              <h5 className="text-muted">No Maids Available</h5>
              <p className="text-muted">
                {filterRegion 
                  ? `No maids are currently available in ${filterRegion}.`
                  : 'No maids are currently available.'
                }
              </p>
              <small className="text-muted">
                Check back later or try a different region.
              </small>
            </div>
          ) : (
            <div className="row">
              {maids.map((maid) => (
                <div key={maid.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h5 className="card-title mb-0">{maid.name}</h5>
                        <span className="badge bg-success">Available</span>
                      </div>
                      
                      <div className="mb-3">
                        <p className="card-text">
                          <strong>Services:</strong>
                        </p>
                        <div className="mb-2">
                          {maid.services?.split(',').map((service, index) => (
                            <span key={index} className="badge bg-light text-dark me-1 mb-1">
                              {service.trim()}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-6">
                          <small className="text-muted">Region</small>
                          <p className="mb-0"><strong>{maid.region}</strong></p>
                        </div>
                        <div className="col-6">
                          <small className="text-muted">Salary</small>
                          <p className="mb-0"><strong>₹{maid.monthlySalary}/month</strong></p>
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-6">
                          <small className="text-muted">Timing</small>
                          <p className="mb-0"><strong>{maid.timing}</strong></p>
                        </div>
                        <div className="col-6">
                          <small className="text-muted">Gender</small>
                          <p className="mb-0"><strong>{maid.gender}</strong></p>
                        </div>
                      </div>

                      <div className="d-grid">
                        <button
                          className="btn btn-primary"
                          onClick={() => handleHireMaid(maid)}
                        >
                          🏠 Hire This Maid
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedMaid && (
        <HireMaidModal
          show={showHireModal}
          onClose={handleCloseModal}
          maid={selectedMaid}
          userId={userId}
        />
      )}
    </div>
  );
  };
  
  export default MaidHiring; 