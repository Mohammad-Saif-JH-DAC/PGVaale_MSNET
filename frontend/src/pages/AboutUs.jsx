import React from 'react';

function AboutUs() {
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
              About <span className="text-primary">PGVaale</span>
            </h1>
            <p className="lead mb-4" style={{ color: '#374151' }}>
              Revolutionizing the way students and professionals find accommodation and essential services. 
              We're building a trusted community where convenience meets quality.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <div className="d-flex align-items-center">
                <i className="fas fa-check-circle text-success me-2"></i>
                <span className="fw-semibold">Trusted Platform</span>
              </div>
              <div className="d-flex align-items-center">
                <i className="fas fa-users text-primary me-2"></i>
                <span className="fw-semibold">Growing Community</span>
              </div>
              <div className="d-flex align-items-center">
                <i className="fas fa-shield-alt text-info me-2"></i>
                <span className="fw-semibold">Secure & Safe</span>
              </div>
            </div>
          </div>
          <div className="col-md-6 text-center">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=700&q=80"
              alt="About PGVaale"
              className="img-fluid rounded-4 shadow-lg border border-3 border-primary"
              style={{ maxHeight: 400, objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="container py-5">
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card h-100 shadow border-0 rounded-4" style={{ 
              background: 'rgba(255, 255, 255, 0.9)', 
              backdropFilter: 'blur(10px)' 
            }}>
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <i className="fas fa-bullseye text-primary" style={{ fontSize: '3rem' }}></i>
                </div>
                <h3 className="fw-bold text-center mb-4" style={{ color: '#2C3E50' }}>Our Mission</h3>
                <p className="text-muted text-center">
                  To simplify the search for quality accommodation and essential services by creating 
                  a transparent, reliable, and user-friendly platform that connects students, professionals, 
                  and service providers in a trusted ecosystem.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100 shadow border-0 rounded-4" style={{ 
              background: 'rgba(255, 255, 255, 0.9)', 
              backdropFilter: 'blur(10px)' 
            }}>
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <i className="fas fa-eye text-success" style={{ fontSize: '3rem' }}></i>
                </div>
                <h3 className="fw-bold text-center mb-4" style={{ color: '#2C3E50' }}>Our Vision</h3>
                <p className="text-muted text-center">
                  To become the leading platform in India for accommodation and lifestyle services, 
                  empowering millions of users to find their perfect living solutions while supporting 
                  local service providers to grow their businesses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="container py-5">
        <div className="row align-items-center">
          <div className="col-md-6 mb-4 mb-md-0">
            <img
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=600&q=80"
              alt="Our Story"
              className="img-fluid rounded-4 shadow-lg"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="col-md-6">
            <div className="ps-md-4">
              <h2 className="fw-bold mb-4" style={{ color: '#2C3E50' }}>Our Story</h2>
              <p className="mb-4" style={{ color: '#374151' }}>
                PGVaale was born from the real struggles faced by students and working professionals 
                in finding quality accommodation and reliable services. Our founders experienced firsthand 
                the challenges of searching for PG rooms, finding trustworthy maid services, and locating 
                good tiffin providers.
              </p>
              <p className="mb-4" style={{ color: '#374151' }}>
                What started as a solution to personal problems has evolved into a comprehensive platform 
                that serves thousands of users across India. We've built more than just a marketplace - 
                we've created a community where trust, quality, and convenience come together.
              </p>
              <div className="d-flex align-items-center">
                <div className="me-4">
                  <h4 className="fw-bold text-primary mb-0">2024</h4>
                  <small className="text-muted">Founded</small>
                </div>
                <div className="me-4">
                  <h4 className="fw-bold text-success mb-0">1000+</h4>
                  <small className="text-muted">Happy Users</small>
                </div>
                <div>
                  <h4 className="fw-bold text-info mb-0">500+</h4>
                  <small className="text-muted">Service Providers</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container py-5">
        <div className="row text-center mb-5">
          <div className="col">
            <h2 className="fw-bold mb-3" style={{ color: '#2C3E50' }}>Our Core Values</h2>
            <p className="text-muted mb-0">The principles that guide everything we do</p>
          </div>
        </div>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 shadow border-0 rounded-4 text-center" style={{ 
              background: 'rgba(255, 255, 255, 0.9)', 
              backdropFilter: 'blur(10px)' 
            }}>
              <div className="card-body p-4">
                <div className="mb-3">
                  <i className="fas fa-handshake text-primary" style={{ fontSize: '3rem' }}></i>
                </div>
                <h5 className="fw-bold mb-3" style={{ color: '#2C3E50' }}>Trust & Transparency</h5>
                <p className="text-muted">
                  We believe in building lasting relationships through honest communication, 
                  verified listings, and transparent pricing.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow border-0 rounded-4 text-center" style={{ 
              background: 'rgba(255, 255, 255, 0.9)', 
              backdropFilter: 'blur(10px)' 
            }}>
              <div className="card-body p-4">
                <div className="mb-3">
                  <i className="fas fa-star text-warning" style={{ fontSize: '3rem' }}></i>
                </div>
                <h5 className="fw-bold mb-3" style={{ color: '#2C3E50' }}>Quality First</h5>
                <p className="text-muted">
                  Every listing and service provider on our platform is carefully vetted to 
                  ensure the highest standards of quality and reliability.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow border-0 rounded-4 text-center" style={{ 
              background: 'rgba(255, 255, 255, 0.9)', 
              backdropFilter: 'blur(10px)' 
            }}>
              <div className="card-body p-4">
                <div className="mb-3">
                  <i className="fas fa-users text-success" style={{ fontSize: '3rem' }}></i>
                </div>
                <h5 className="fw-bold mb-3" style={{ color: '#2C3E50' }}>Community Focus</h5>
                <p className="text-muted">
                  We're not just a platform - we're a community that supports both users 
                  and service providers in achieving their goals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container py-5">
        <div className="row text-center mb-5">
          <div className="col-12">
            <h2 className="fw-bold mb-3" style={{ color: '#2C3E50' }}>Meet Our Team</h2>
            <p className="text-muted mb-0">The passionate people behind PGVaale</p>
          </div>
        </div>
        
        {/* Project Lead */}
        <div className="row justify-content-center mb-5">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg border-0 rounded-4 text-center" style={{ 
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 248, 255, 0.95) 100%)', 
              backdropFilter: 'blur(15px)',
              border: '2px solid rgba(59, 130, 246, 0.2)'
            }}>
              <div className="card-body p-5">
                <div className="mb-4">
                  <img
                    src="/image/Saif_Image.jpg"
                    alt="Project Lead"
                    className="rounded-circle border border-4 border-primary shadow"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                </div>
                <h3 className="fw-bold mb-2" style={{ color: '#2C3E50' }}>Mohammad Saif</h3>
                <p className="text-primary fw-bold mb-3 fs-5">Project Lead</p>
                <p className="text-muted">
                Saif is a full-stack developer and project lead of PGVaale, a platform connecting students with verified PG accommodations. He specializes in Spring Boot, React, and RESTful APIs, and has led the end-to-end development of the application — from database design to frontend implementation. Passionate about solving real-world problems through technology, Saif ensures robust architecture and seamless user experience.
                </p>
                <div className="d-flex justify-content-center gap-3 mt-3">
                  <a href="https://www.linkedin.com/in/mohammadsaif25" className="text-primary" target='_blank'><i className="fab fa-linkedin fs-4"></i></a>
                  {/* <a href="#" className="text-dark"><i className="fab fa-github fs-4"></i></a>
                  <a href="#" className="text-info"><i className="fab fa-twitter fs-4"></i></a> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Team Members */}
        <div className="row g-4 justify-content-center">
          <div className="col-md-6 col-lg-3">
            <div className="card shadow border-0 rounded-4 text-center h-100" style={{ 
              background: 'rgba(255, 255, 255, 0.9)', 
              backdropFilter: 'blur(10px)' 
            }}>
              <div className="card-body p-4">
                <div className="mb-3">
                  <img
                    src="/image/Sarika_Image.jpg"
                    alt="Team Member"
                    className="rounded-circle border border-3 border-success"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                </div>
                <h5 className="fw-bold mb-2" style={{ color: '#2C3E50' }}>Sarika Yadav</h5>
                <p className="text-success fw-semibold mb-2">Team Member</p>
                <p className="text-muted small">
                Sarika worked on the backend development of PGVaale, focusing on creating robust APIs and 
                integrating them with the frontend. While her primary role was server-side programming, she 
                also explored frontend concepts to ensure smooth data flow and UI responsiveness.
                 This project allowed her to enhance her problem-solving skills and gain hands-on 
                 experience with collaborative software development.
                </p>
              </div>
            </div>
          </div>
          
          <div className="col-md-6 col-lg-3">
            <div className="card shadow border-0 rounded-4 text-center h-100" style={{ 
              background: 'rgba(255, 255, 255, 0.9)', 
              backdropFilter: 'blur(10px)' 
            }}>
              <div className="card-body p-4">
                <div className="mb-3">
                  <img
                    src="/image/Pallavi.jpg"
                    alt="Team Member"
                    className="rounded-circle border border-3 border-info"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                </div>
                <h5 className="fw-bold mb-2" style={{ color: '#2C3E50' }}>Pallavi Singhote</h5>
                <p className="text-info fw-semibold mb-2">Team Member</p>
                <p className="text-muted small">
                Pallavi worked on the database design and optimization for PGVaale, ensuring efficient 
                data storage and retrieval. Although her main responsibility was database management, she also 
                participated in debugging frontend-backend integration issues. Through this work, 
                she strengthened her understanding of SQL, data modeling, and teamwork in a real-world project setting.
                </p>
              </div>
            </div>
          </div>
          
          <div className="col-md-6 col-lg-3">
            <div className="card shadow border-0 rounded-4 text-center h-100" style={{ 
              background: 'rgba(255, 255, 255, 0.9)', 
              backdropFilter: 'blur(10px)' 
            }}>
              <div className="card-body p-4">
                <div className="mb-3">
                  <img
                    src="/image/Mansi.jpg"
                    alt="Team Member"
                    className="rounded-circle border border-3 border-warning"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                </div>
                <h5 className="fw-bold mb-2" style={{ color: '#2C3E50' }}>Mansi Kamble</h5>
                <p className="text-warning fw-semibold mb-2">Team Member</p>
                <p className="text-muted small">
                Mansi played a key role in testing and quality assurance for PGVaale, focusing on identifying and fixing UI and functional bugs. While her core role was in QA, she also learned basic frontend coding to better understand the application’s workflow. 
                The project gave her valuable experience in maintaining software quality and collaborating effectively in a development team.
                </p>
              </div>
            </div>
          </div>
          
          <div className="col-md-6 col-lg-3">
            <div className="card shadow border-0 rounded-4 text-center h-100" style={{ 
              background: 'rgba(255, 255, 255, 0.9)', 
              backdropFilter: 'blur(10px)' 
            }}>
              <div className="card-body p-4">
                <div className="mb-3">
                  <img
                    src="/image/Prashant.jpg"
                    alt="Team Member"
                    className="rounded-circle border border-3 border-danger"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                </div>
                <h5 className="fw-bold mb-2" style={{ color: '#2C3E50' }}>Prashant Musale</h5>
                <p className="text-danger fw-semibold mb-2">Team Member</p>
                <p className="text-muted small">
                  
Prashant contributed to the frontend development of PGVaale, focusing on designing and implementing key UI elements like the header and footer. While his main role was on the UI side, he also has a good understanding of backend technologies. Through this project, he gained practical experience in building user-friendly web interfaces as part of a collaborative college team effort.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="container py-5">
        <div className="card shadow border-0 rounded-4" style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <div className="card-body p-5 text-center">
            <h2 className="fw-bold mb-3">Join the PGVaale Community</h2>
            <p className="lead mb-4">
              Whether you're looking for accommodation, services, or want to become a service provider, 
              we're here to help you succeed.
            </p>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <a href="/register" className="btn btn-light btn-lg px-4 py-2">
                <i className="fas fa-user-plus me-2"></i>Get Started Today
              </a>
              <a href="/contact" className="btn btn-outline-light btn-lg px-4 py-2">
                <i className="fas fa-envelope me-2"></i>Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Stats */}
      <section className="container py-5">
        <div className="row text-center g-4">
          <div className="col-6 col-md-3">
            <div className="mb-2">
              <i className="fas fa-home text-primary" style={{ fontSize: '2rem' }}></i>
            </div>
            <h4 className="fw-bold text-primary mb-1">500+</h4>
            <small className="text-muted">PG Listings</small>
          </div>
          <div className="col-6 col-md-3">
            <div className="mb-2">
              <i className="fas fa-utensils text-success" style={{ fontSize: '2rem' }}></i>
            </div>
            <h4 className="fw-bold text-success mb-1">200+</h4>
            <small className="text-muted">Tiffin Services</small>
          </div>
          <div className="col-6 col-md-3">
            <div className="mb-2">
              <i className="fas fa-broom text-info" style={{ fontSize: '2rem' }}></i>
            </div>
            <h4 className="fw-bold text-info mb-1">150+</h4>
            <small className="text-muted">Maid Services</small>
          </div>
          <div className="col-6 col-md-3">
            <div className="mb-2">
              <i className="fas fa-smile text-warning" style={{ fontSize: '2rem' }}></i>
            </div>
            <h4 className="fw-bold text-warning mb-1">1000+</h4>
            <small className="text-muted">Happy Users</small>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
