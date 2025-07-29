// src/components/PrivacyPolicy.jsx
import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
//import privacyImage from '../assets/privacy-policy.svg'; // You'll need to add this image

const PrivacyPolicy = () => {
  return (
    <div 
      className="privacy-policy-page"
      style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
        padding: '2rem 0'
      }}
    >
      <Container className="py-4">
        <Row className="justify-content-center mb-4">
          <Col md={8} className="text-center">
            {/* <img 
              src={privacyImage} 
              alt="Privacy Policy" 
              style={{ 
                height: '120px', 
                marginBottom: '1.5rem',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }} 
            /> */}
            <h1 
              className="display-5 fw-bold mb-3"
              style={{
                color: '#2c3e50',
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
              }}
            >
              Privacy Policy
            </h1>
            <p className="text-muted">
              <small>
                <strong>Effective Date:</strong> June 5, 2025 •{' '}
                <strong>Last Updated:</strong> June 5, 2025
              </small>
            </p>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            <Card 
              className="shadow-sm border-0 overflow-hidden"
              style={{ borderRadius: '12px' }}
            >
              <div 
                className="card-header-bg"
                style={{
                  height: '8px',
                  background: 'linear-gradient(90deg, #3498db, #2ecc71)'
                }}
              ></div>
              <Card.Body className="p-4 p-md-5">
                <section className="mb-5">
                  <p className="lead">
                    Welcome to <span className="text-primary fw-bold">PGVaale</span>. 
                    We respect your privacy and are committed to protecting your personal information.
                  </p>
                  <div className="alert alert-light border mt-3">
                    By using our website <a href="https://www.pgvale.com">www.pgvale.com</a>, 
                    you agree to the terms outlined in this policy.
                  </div>
                </section>

                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(section => (
                  <section key={section} className="mb-4 pt-3">
                    <div className="d-flex align-items-center mb-3">
                      <div 
                        className="me-3 d-flex align-items-center justify-content-center"
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: '#e3f2fd',
                          color: '#1976d2',
                          fontWeight: 'bold',
                          flexShrink: 0
                        }}
                      >
                        {section}
                      </div>
                      <h4 
                        className="mb-0"
                        style={{ color: '#2c3e50' }}
                      >
                        {getSectionTitle(section)}
                      </h4>
                    </div>
                    <div className="ps-5">
                      {getSectionContent(section)}
                    </div>
                  </section>
                ))}

                <div className="text-center mt-5 pt-3">
                  <div className="border-top pt-4">
                    <p className="text-muted mb-1">
                      Thank you for choosing <span className="text-primary fw-bold">PGVaale</span>
                    </p>
                    <p className="small text-muted">
                      Have questions? Contact us at{' '}
                      <a href="mailto:privacy@pgvale.com">privacy@pgvale.com</a>
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

// Helper functions for section content
function getSectionTitle(sectionNumber) {
  const titles = [
    "Information We Collect",
    "How We Use Your Information",
    "Legal Basis for Processing (GDPR)",
    "Cookies and Tracking",
    "Sharing Your Information",
    "Data Retention",
    "Data Security",
    "Children's Privacy",
    "Your Privacy Rights",
    "Third-Party Links",
    "Changes to This Policy",
    "Contact Us"
  ];
  return titles[sectionNumber - 1];
}

function getSectionContent(sectionNumber) {
  switch(sectionNumber) {
    case 1:
      return (
        <>
          <p>We collect information that identifies, relates to, describes, or can be linked to you ("Personal Information").</p>
          
          <h5 className="mt-3 text-muted">a) Information You Provide Directly</h5>
          <ul className="list-styled">
            <li>Name, email address, phone number</li>
            <li>Address, city, state (for service availability)</li>
            <li>Profile photo (if applicable)</li>
            <li>Feedback, ratings, and messages</li>
            <li>Account credentials (username, password)</li>
            <li>Payment information (processed securely via third parties)</li>
          </ul>

          <h5 className="mt-3 text-muted">b) Information We Collect Automatically</h5>
          <ul className="list-styled">
            <li>IP address, browser type, device information</li>
            <li>Pages visited, time spent, click patterns</li>
            <li>Cookies and tracking technologies</li>
          </ul>

          <h5 className="mt-3 text-muted">c) Information from Third Parties</h5>
          <p>We may receive data from social media platforms, service providers, or public sources.</p>
        </>
      );
    case 2:
      return (
        <ul className="list-styled">
          <li>Provide and improve our services</li>
          <li>Create and manage your account</li>
          <li>Process bookings and applications</li>
          <li>Respond to inquiries and support requests</li>
          <li>Send updates and newsletters (with consent)</li>
          <li>Analyze site performance and trends</li>
          <li>Prevent fraud and ensure security</li>
        </ul>
      );
    case 3:
      return (
        <p>
          If you are in the EU, we process data based on consent, contract necessity, 
          legal obligations, or legitimate interests. You may withdraw consent at any time.
        </p>
      );
    case 4:
      return (
        <p>
          We use cookies to enhance your experience. You can disable them in your browser, 
          but some features may not work properly.
        </p>
      );
    case 5:
      return (
        <p>
          We do not sell your data. We may share it with trusted service providers, 
          partners (to fulfill your request), or legal authorities when required.
        </p>
      );
    case 6:
      return (
        <p>
          We keep your data only as long as necessary — typically until account deletion 
          or as required by law (e.g., 7 years for transaction records).
        </p>
      );
    case 7:
      return (
        <p>
          We use SSL encryption, secure servers, and access controls. However, 
          no online transmission is 100% secure.
        </p>
      );
    case 8:
      return (
        <p>
          Our Site is not intended for children under 16. We do not knowingly collect their data.
        </p>
      );
    case 9:
      return (
        <>
          <p>
            You may request to access, correct, delete, or export your data. 
            To do so, contact us at:
          </p>
          <p>
            <strong>Email:</strong>{' '}
            <a href="mailto:privacy@pgvale.com">privacy@pgvale.com</a>
          </p>
          <p>We will respond within 30 days.</p>
        </>
      );
    case 10:
      return (
        <p>
          Our Site may link to other websites. We are not responsible for their privacy practices.
        </p>
      );
    case 11:
      return (
        <p>
          We may update this policy. The new version will be posted here with a new date. 
          Continued use means you accept the changes.
        </p>
      );
    case 12:
      return (
        <>
          <p>
            <strong>PGVaale Privacy Team</strong>
            <br />
            📧 <a href="mailto:privacy@pgvale.com">privacy@pgvale.com</a>
            <br />
            📞 +91-9004628693
            <br />
            📍 PGVaale, Kharghar, Navi Mumbai, India
          </p>
        </>
      );
    default:
      return null;
  }
}

export default PrivacyPolicy;