import React from 'react';

function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
      paddingTop: 0,
    }}>
      {/* Hero Section */}
      <section className="container py-5">
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start mb-4 mb-md-0">
            <h1 className="display-4 fw-bold mb-3" style={{ color: '#2C3E50' }}>
              Welcome to <span className="text-primary">PGVaale</span>
            </h1>
            <p className="lead mb-4" style={{ color: '#374151' }}>
              Your one-stop platform for finding, booking, and managing PG rooms, tiffin, and maid services. Hassle-free, trusted, and tailored for you.
            </p>
            <a href="/register" className="btn btn-lg btn-primary shadow px-5 py-2 me-2 mb-2">
              Get Started
            </a>
            <a href="/pgrooms" className="btn btn-lg btn-outline-primary shadow px-5 py-2 mb-2">
              Browse PGs
            </a>
          </div>
          <div className="col-md-6 text-center">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=80"
              alt="PGVaale Hero"
              className="img-fluid rounded-4 shadow-lg border border-3 border-primary"
              style={{ maxHeight: 350, objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-5">
        <div className="row text-center mb-5">
          <div className="col">
            <h2 className="fw-bold mb-3" style={{ color: '#2C3E50' }}>What We Offer</h2>
            <p className="text-muted mb-0">All-in-one platform for students, working professionals, and service providers.</p>
          </div>
        </div>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 shadow border-0 rounded-4">
              <img
                src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80"
                alt="PG Rooms"
                className="card-img-top rounded-top-4"
                style={{ height: 200, objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title fw-bold">Find PG Rooms</h5>
                <p className="card-text text-muted">
                  Discover verified PG accommodations with detailed amenities, photos, and real reviews. Book instantly and move in with confidence.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow border-0 rounded-4">
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80"
                alt="Tiffin Service"
                className="card-img-top rounded-top-4"
                style={{ height: 200, objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title fw-bold">Tiffin Services</h5>
                <p className="card-text text-muted">
                  Home-cooked, hygienic, and affordable meals delivered to your doorstep. Choose from a variety of tiffin providers in your area.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow border-0 rounded-4">
              <img
                src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80"
                alt="Maid Service"
                className="card-img-top rounded-top-4"
                style={{ height: 200, objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title fw-bold">Maid Services</h5>
                <p className="card-text text-muted">
                  Book trusted and background-verified maids for cleaning, cooking, and more. Flexible timings and transparent pricing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regions Carousel Section */}
      <section className="container py-5">
        <div className="row text-center mb-4">
          <div className="col">
            <h2 className="fw-bold mb-3" style={{ color: '#2C3E50' }}>We are available in</h2>
            <p className="text-muted mb-0">Expanding across major cities</p>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div id="regionsCarousel" className="carousel slide" data-bs-ride="carousel">
              <div className="carousel-inner rounded-4 shadow">
                <div className="carousel-item active">
                  <img src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80" alt="Mumbai" className="d-block w-100 rounded-top-4" style={{height: 250, objectFit: 'cover'}} />
                  <div className="d-flex flex-column align-items-center p-4 bg-white">
                    <h3 className="fw-bold mb-2">Mumbai</h3>
                    <p className="text-muted">The city of dreams, now with PGVaale!</p>
                  </div>
                </div>
                <div className="carousel-item">
                  <img src="https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=800&q=80" alt="Hyderabad" className="d-block w-100 rounded-top-4" style={{height: 250, objectFit: 'cover'}} />
                  <div className="d-flex flex-column align-items-center p-4 bg-white">
                    <h3 className="fw-bold mb-2">Hyderabad</h3>
                    <p className="text-muted">Find your perfect stay in the City of Pearls.</p>
                  </div>
                </div>
                <div className="carousel-item">
                  <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80" alt="Pune" className="d-block w-100 rounded-top-4" style={{height: 250, objectFit: 'cover'}} />
                  <div className="d-flex flex-column align-items-center p-4 bg-white">
                    <h3 className="fw-bold mb-2">Pune</h3>
                    <p className="text-muted">Student city, working hub, and now PGVaale ready!</p>
                  </div>
                </div>
                <div className="carousel-item">
                  <img src="https://images.unsplash.com/photo-1465447142348-e9952c393450?auto=format&fit=crop&w=800&q=80" alt="Delhi" className="d-block w-100 rounded-top-4" style={{height: 250, objectFit: 'cover'}} />
                  <div className="d-flex flex-column align-items-center p-4 bg-white">
                    <h3 className="fw-bold mb-2">Delhi</h3>
                    <p className="text-muted">Capital comfort with PGVaale services.</p>
                  </div>
                </div>
                <div className="carousel-item">
                  <img src="https://images.unsplash.com/photo-1509228468518-c5eeecbff44a?auto=format&fit=crop&w=800&q=80" alt="Kolkata" className="d-block w-100 rounded-top-4" style={{height: 250, objectFit: 'cover'}} />
                  <div className="d-flex flex-column align-items-center p-4 bg-white">
                    <h3 className="fw-bold mb-2">Kolkata</h3>
                    <p className="text-muted">City of Joy, now easier to live in!</p>
                  </div>
                </div>
                <div className="carousel-item">
                  <img src="https://images.unsplash.com/photo-1465101178521-c1a9136a3fd9?auto=format&fit=crop&w=800&q=80" alt="More regions soon" className="d-block w-100 rounded-top-4" style={{height: 250, objectFit: 'cover'}} />
                  <div className="d-flex flex-column align-items-center p-4 bg-white">
                    <h3 className="fw-bold mb-2">More regions coming soon!</h3>
                    <p className="text-muted">Stay tuned as we expand to more cities across India.</p>
                  </div>
                </div>
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#regionsCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#regionsCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Website Review Carousel Section */}
      <section className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div id="reviewCarousel" className="carousel slide" data-bs-ride="carousel">
              <div className="carousel-inner rounded-4 shadow">
                <div className="carousel-item active">
                  <div className="card shadow border-0 rounded-4 p-4">
                    <div className="d-flex align-items-center mb-3">
                      <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="rounded-circle me-3" style={{ width: 60, height: 60, objectFit: 'cover' }} />
                      <div>
                        <h5 className="mb-0 fw-bold">Rahul Sharma</h5>
                        <div style={{ color: '#FFD700', fontSize: '1.2rem' }}>★★★★★</div>
                      </div>
                    </div>
                    <p className="mb-0 text-muted">
                      "PGVaale made my move to Pune so much easier! The booking process was smooth, and the reviews helped me pick the best PG. Highly recommended!"
                    </p>
                  </div>
                </div>
                <div className="carousel-item">
                  <div className="card shadow border-0 rounded-4 p-4">
                    <div className="d-flex align-items-center mb-3">
                      <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="rounded-circle me-3" style={{ width: 60, height: 60, objectFit: 'cover' }} />
                      <div>
                        <h5 className="mb-0 fw-bold">Priya Verma</h5>
                        <div style={{ color: '#FFD700', fontSize: '1.2rem' }}>★★★★☆</div>
                      </div>
                    </div>
                    <p className="mb-0 text-muted">
                      "Great platform for finding tiffin and maid services. The interface is user-friendly and support is quick!"
                    </p>
                  </div>
                </div>
                <div className="carousel-item">
                  <div className="card shadow border-0 rounded-4 p-4">
                    <div className="d-flex align-items-center mb-3">
                      <img src="https://randomuser.me/api/portraits/men/65.jpg" alt="User" className="rounded-circle me-3" style={{ width: 60, height: 60, objectFit: 'cover' }} />
                      <div>
                        <h5 className="mb-0 fw-bold">Amit Singh</h5>
                        <div style={{ color: '#FFD700', fontSize: '1.2rem' }}>★★★★★</div>
                      </div>
                    </div>
                    <p className="mb-0 text-muted">
                      "I found a PG in Hyderabad within a day. The reviews and photos were genuine. Will use again!"
                    </p>
                  </div>
                </div>
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#reviewCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#reviewCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="container py-5">
        <div className="row align-items-center bg-primary rounded-4 shadow-lg p-5">
          <div className="col-md-8 text-white">
            <h3 className="fw-bold mb-2">Ready to find your next home or service?</h3>
            <p className="mb-0">Join PGVaale today and experience a seamless, modern way to live and thrive.</p>
          </div>
          <div className="col-md-4 text-md-end text-center mt-4 mt-md-0">
            <a href="/register" className="btn btn-lg btn-light text-primary fw-bold px-5 py-2 shadow">
              Sign Up Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home; 