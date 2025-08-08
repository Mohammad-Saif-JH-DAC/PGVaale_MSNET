import React, { useState, useEffect } from 'react';
import api from '../api';
import Toast from '../utils/Toast';

function TiffinHiring() {
  const [tiffinProviders, setTiffinProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    region: '',
    category: ''
  });
  const [bookingStatus, setBookingStatus] = useState({});

  // Fetch tiffin providers
  const fetchTiffinProviders = async (filterParams = filters) => {
    try {
      setLoading(true);
      let url = '/api/tiffin/all';
      const queryParams = [];

      if (filterParams.region) queryParams.push(`region=${encodeURIComponent(filterParams.region)}`);
      if (filterParams.category) queryParams.push(`category=${encodeURIComponent(filterParams.category)}`);

      if (queryParams.length > 0) {
        url += '?' + queryParams.join('&');
      }

      const res = await api.get(url);
      setTiffinProviders(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching tiffin providers:', error);
      setTiffinProviders([]);
      Toast.error('Failed to load tiffin providers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load tiffin providers on mount
  useEffect(() => {
    fetchTiffinProviders();
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    fetchTiffinProviders(updatedFilters);
  };

  // Handle booking
  const handleBookTiffin = async (providerId) => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      Toast.error('Please log in to book tiffin services.');
      return;
    }

    try {
      await api.post(`/api/tiffin/book/${providerId}`);
      setBookingStatus(prev => ({ ...prev, [providerId]: 'booked' }));
      Toast.success('Tiffin service booked successfully!');
    } catch (error) {
      console.error('Error booking tiffin:', error);
      Toast.error('Failed to book tiffin service. Please try again.');
    }
  };

  // Default error message when no providers are available
  const NoProvidersMessage = () => (
    <div className="text-center py-5">
      <div className="card shadow border-0 rounded-4 p-5">
        <div className="mb-4">
          <i className="fas fa-utensils text-muted" style={{ fontSize: '4rem' }}></i>
        </div>
        <h3 className="text-muted mb-3">No Tiffin Providers Available</h3>
                 <p className="text-muted mb-4">
           {filters.region || filters.category 
             ? 'No tiffin providers match your current filters. Try adjusting your search criteria.'
             : 'Currently no tiffin providers are available in your area. Please check back later or contact us for assistance.'
           }
         </p>
         {filters.region || filters.category && (
           <button 
             className="btn btn-primary"
             onClick={() => {
               setFilters({ region: '', category: '' });
               fetchTiffinProviders({ region: '', category: '' });
             }}
           >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
      paddingTop: '2rem',
      paddingBottom: '2rem'
    }}>
      <div className="container">
        {/* Header Section */}
        <div className="row mb-5">
          <div className="col-12 text-center">
                         <h1 className="display-6 fw-bold mb-3" style={{ color: '#2C3E50' }}>
               <i className="fas fa-utensils me-3" style={{ color: '#4F46E5' }}></i>
               Hire Tiffin Services
             </h1>
            <p className="lead text-muted">
              Find and book reliable tiffin services for delicious home-cooked meals
            </p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow border-0 rounded-4 p-4">
              <h5 className="mb-3 fw-bold">Filter Tiffin Providers</h5>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label fw-bold">Region</label>
                  <select
                    className="form-select"
                    name="region"
                    value={filters.region}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Regions</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Pune">Pune</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Kolkata">Kolkata</option>
                  </select>
                </div>
                                 <div className="col-md-4">
                   <label className="form-label fw-bold">Food Category</label>
                   <select
                     className="form-select"
                     name="category"
                     value={filters.category}
                     onChange={handleFilterChange}
                   >
                     <option value="">All Categories</option>
                     <option value="Veg">Vegetarian</option>
                     <option value="Non-Veg">Non-Vegetarian</option>
                   </select>
                 </div>
                
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading tiffin providers...</p>
          </div>
        )}

        {/* No Providers Message */}
        {!loading && tiffinProviders.length === 0 && <NoProvidersMessage />}

        {/* Tiffin Providers Grid */}
        {!loading && tiffinProviders.length > 0 && (
          <div className="row g-4">
            {tiffinProviders.map((provider) => (
              <div key={provider.id} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow border-0 rounded-4">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <div className="flex-shrink-0">
                        <img
                          src={provider.profileImage || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=150&q=80"}
                          alt={provider.name}
                          className="rounded-circle"
                          style={{ width: 60, height: 60, objectFit: 'cover' }}
                        />
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <h5 className="card-title mb-1 fw-bold">{provider.name}</h5>
                        <p className="text-muted mb-0 small">
                          <i className="fas fa-map-marker-alt me-1"></i>
                          {provider.region}
                        </p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <span className="badge bg-primary me-2">{provider.cuisine}</span>
                      <span className="badge bg-success me-2">{provider.mealType}</span>
                      {provider.isVegetarian && (
                        <span className="badge bg-success">Vegetarian</span>
                      )}
                    </div>

                    <p className="card-text text-muted small mb-3">
                      {provider.description || 'Delicious home-cooked meals delivered to your doorstep.'}
                    </p>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <span className="fw-bold text-primary">₹{provider.pricePerMeal || 50}</span>
                        <span className="text-muted small">/meal</span>
                      </div>
                      <div className="text-warning">
                        <i className="fas fa-star"></i>
                        <span className="ms-1">{provider.rating || 4.5}</span>
                      </div>
                    </div>

                    <button
                      className={`btn w-100 ${
                        bookingStatus[provider.id] === 'booked' 
                          ? 'btn-success' 
                          : 'btn-primary'
                      }`}
                      onClick={() => handleBookTiffin(provider.id)}
                      disabled={bookingStatus[provider.id] === 'booked'}
                    >
                      {bookingStatus[provider.id] === 'booked' 
                        ? 'Booked ✓' 
                        : 'Book Tiffin Service'
                      }
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Additional Information */}
        {!loading && tiffinProviders.length > 0 && (
          <div className="row mt-5">
            <div className="col-12">
              <div className="card shadow border-0 rounded-4 p-4">
                <h5 className="fw-bold mb-3">Why Choose Our Tiffin Services?</h5>
                <div className="row g-3">
                  <div className="col-md-3">
                    <div className="text-center">
                      <i className="fas fa-shield-alt text-primary mb-2" style={{ fontSize: '2rem' }}></i>
                      <h6 className="fw-bold">Hygienic</h6>
                      <p className="text-muted small">All providers follow strict hygiene standards</p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-center">
                      <i className="fas fa-clock text-primary mb-2" style={{ fontSize: '2rem' }}></i>
                      <h6 className="fw-bold">Timely Delivery</h6>
                      <p className="text-muted small">Fresh meals delivered on schedule</p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-center">
                      <i className="fas fa-heart text-primary mb-2" style={{ fontSize: '2rem' }}></i>
                      <h6 className="fw-bold">Home-Cooked</h6>
                      <p className="text-muted small">Authentic home-style cooking</p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-center">
                      <i className="fas fa-wallet text-primary mb-2" style={{ fontSize: '2rem' }}></i>
                      <h6 className="fw-bold">Affordable</h6>
                      <p className="text-muted small">Budget-friendly meal options</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TiffinHiring;
