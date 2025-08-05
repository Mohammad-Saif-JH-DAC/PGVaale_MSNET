# PGVaale - PG Room Finder Website

[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.3-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.7-purple.svg)](https://getbootstrap.com/)

PGVaale is a comprehensive web application designed to help users find and manage PG (Paying Guest) accommodations. The platform connects PG seekers with property owners, providing a seamless experience for room booking, management, and communication.

## 🌟 Features

### For PG Seekers
- **Advanced Search**: Find PG rooms based on location, price, amenities, and preferences
- **Interactive Maps**: View room locations using Google Maps and Leaflet integration
- **Detailed Listings**: Comprehensive room details with photos and amenities
- **Real-time Chat**: Communicate directly with property owners
- **User Dashboard**: Manage bookings, favorites, and profile information
- **Reviews & Ratings**: Read and write reviews for PG accommodations

### For Property Owners
- **Owner Dashboard**: Manage multiple property listings
- **Room Management**: Add, edit, and delete room listings
- **Booking Management**: Track inquiries and bookings
- **Analytics**: View performance metrics and statistics
- **Communication Tools**: Chat with potential tenants

### Additional Services
- **Tiffin Services**: Find and manage meal delivery services
- **Maid Services**: Connect with domestic help providers
- **Admin Panel**: Comprehensive administration tools

## 🏗️ Architecture

PGVaale follows a modern full-stack architecture:

```
┌─────────────────┐    HTTP/REST API    ┌──────────────────┐
│   React Frontend │ ◄─────────────────► │ Spring Boot      │
│   (Port 3000)    │                     │ Backend          │
│                 │                     │ (Port 8080)      │
│ • React Router  │                     │ • Spring Security│
│ • Bootstrap UI  │                     │ • JWT Auth       │
│ • Leaflet Maps  │                     │ • JPA/Hibernate  │
│ • Axios HTTP    │                     │ • RESTful APIs   │
└─────────────────┘                     └──────────────────┘
                                                   │
                                                   ▼
                                        ┌──────────────────┐
                                        │   Database       │
                                        │ • MySQL (Prod)   │
                                        │ • H2 (Dev)       │
                                        └──────────────────┘
```

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.5.3
- **Language**: Java 21
- **Build Tool**: Gradle
- **Security**: Spring Security with JWT authentication
- **Database**: MySQL (Production), H2 (Development)
- **ORM**: Spring Data JPA with Hibernate
- **Additional Libraries**:
  - Lombok (Code generation)
  - JJWT (JWT handling)

### Frontend
- **Framework**: React 19.1.0
- **UI Library**: Bootstrap 5.3.7 + React Bootstrap
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Maps**: Google Maps API + Leaflet
- **Icons**: FontAwesome + React Icons
- **Charts**: Recharts
- **Additional Libraries**:
  - React Select (Enhanced dropdowns)
  - React Leaflet (Map components)

## 📋 Prerequisites

Before running PGVaale, ensure you have the following installed:

- **Java 21** or higher
- **Node.js** (version 16 or higher)
- **npm** or **yarn**
- **MySQL** (for production) or use H2 (for development)
- **Git**

## 🚀 Quick Start

### Option 1: Using the Startup Script (Recommended)

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd PGVaale
   ```

2. **Run the startup script**:
   ```bash
   start-all.bat
   ```
   This will automatically start both the backend and frontend servers.

### Option 2: Manual Setup

#### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Run the Spring Boot application**:
   ```bash
   ./gradlew bootRun
   ```
   Or on Windows:
   ```bash
   gradlew.bat bootRun
   ```

   The backend will start on `http://localhost:8080`

#### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

   The frontend will start on `http://localhost:3000`

## 🔧 Configuration

### Backend Configuration

The backend configuration is managed through Spring Boot's `application.properties` or `application.yml` files. Key configurations include:

- **Database Connection**: Configure MySQL connection details
- **JWT Secret**: Set JWT signing key for authentication
- **Server Port**: Default is 8080
- **CORS Settings**: Configure allowed origins for frontend

### Frontend Configuration

- **API Base URL**: Configure backend API endpoint
- **Google Maps API Key**: Required for map functionality
- **Environment Variables**: Set up `.env` file for sensitive configurations

## 📁 Project Structure

```
PGVaale/
├── backend/                 # Spring Boot backend
│   ├── src/main/java/      # Java source code
│   ├── src/main/resources/ # Configuration files
│   ├── build.gradle        # Gradle build configuration
│   └── gradlew*           # Gradle wrapper
├── frontend/               # React frontend
│   ├── src/               # React source code
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── App.js        # Main app component
│   │   └── index.js      # Entry point
│   ├── public/           # Static assets
│   └── package.json      # npm configuration
├── start-all.bat         # Startup script
└── README.md            # This file
```

## 🔐 Authentication & Authorization

PGVaale implements role-based authentication with the following user types:

- **Admin**: Full system access and management
- **Owner**: Property management and tenant communication
- **User**: Room searching and booking capabilities
- **Tiffin Provider**: Meal service management
- **Maid Provider**: Domestic service management

## 🗺️ API Endpoints

The backend provides RESTful APIs for:

- **Authentication**: Login, register, JWT token management
- **User Management**: Profile management, role-based access
- **Property Management**: CRUD operations for PG listings
- **Booking Management**: Room booking and inquiry handling
- **Chat System**: Real-time messaging between users
- **Search & Filtering**: Advanced search capabilities
- **File Upload**: Image and document management

## 🧪 Testing

### Backend Testing
```bash
cd backend
./gradlew test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Build the JAR file:
   ```bash
   ./gradlew build
   ```
2. Deploy the generated JAR from `build/libs/`

### Frontend Deployment
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Deploy the `build/` directory to your web server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) section
2. Create a new issue with detailed information
3. Contact the development team

## 🔄 Version History

- **v0.0.1-SNAPSHOT**: Initial development version
  - Basic PG room finder functionality
  - User authentication and authorization
  - Property management system
  - Chat functionality
  - Admin dashboard

---

**Made with ❤️ by the PGVaale Team**

