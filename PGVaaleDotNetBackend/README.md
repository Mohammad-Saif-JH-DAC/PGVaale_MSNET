# PGVaale .NET Backend

A comprehensive .NET 9.0 backend application for the PGVaale platform, providing services for PG (Paying Guest) management, maid services, tiffin services, and user management.

## 🏗️ Architecture Overview

### Technology Stack
- **Framework**: ASP.NET Core 9.0
- **Database**: MySQL with Entity Framework Core
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: BCrypt
- **ORM**: Entity Framework Core
- **Pattern**: Repository Pattern with Dependency Injection

### Project Structure
```
PGVaaleDotNetBackend/
├── Controllers/          # API Controllers
├── Data/                # Database Context & Migrations
├── DTOs/               # Data Transfer Objects
├── Entities/           # Database Entities
├── Repositories/       # Data Access Layer
├── Security/           # Authentication & Authorization
├── Services/           # Business Logic Layer
└── Program.cs          # Application Configuration
```

## 🔐 Security & Authentication

### JWT Authentication
- **Token Format**: JWT with HMAC-SHA256 signature
- **Token Expiry**: 1 hour
- **Claims**: User ID, Username, Email, Role, Unique ID
- **Secret Key**: Base64 encoded symmetric key

### Password Security
- **Hashing Algorithm**: BCrypt
- **Salt Rounds**: Default BCrypt configuration
- **Verification**: Secure password comparison

### Authorization Policies
```csharp
// Available Policies
- "AdminOnly"     // ADMIN role required
- "OwnerOnly"     // OWNER role required  
- "UserOrAdmin"   // USER or ADMIN role
- "MaidOnly"      // MAID role required
- "TiffinOnly"    // TIFFIN role required
- "OwnerUserOrAdmin" // OWNER, USER, or ADMIN role
```

### Custom Middleware
- **JwtRequestFilter**: Custom middleware for JWT token validation
- **AuthorizeRolesAttribute**: Custom authorization attribute
- **CustomUserDetailsService**: Multi-user type authentication

## 👥 User Types & Roles

### 1. Admin
- **Role**: ADMIN
- **Permissions**: Full system access, user management, approval workflows
- **Default Credentials**: admin/admin123

### 2. User (Tenant)
- **Role**: USER
- **Permissions**: Book PGs, hire maids, order tiffin, manage profile
- **Features**: Dashboard, booking management, feedback system

### 3. Owner
- **Role**: OWNER
- **Permissions**: Manage PG properties, view bookings, tenant management
- **Features**: Property listing, booking management, tenant communication

### 4. Maid
- **Role**: MAID
- **Permissions**: View assigned jobs, update status, manage profile
- **Features**: Job dashboard, status updates, earnings tracking

### 5. Tiffin Provider
- **Role**: TIFFIN
- **Permissions**: Manage menu, view orders, update status
- **Features**: Menu management, order tracking, feedback system

## 🗄️ Database Schema

### Core Tables
```sql
-- Users Table
users (id, username, password, email, name, aadhaar, age, gender, mobile_number)

-- Admins Table  
admins (id, username, password, email, name)

-- Maids Table
maids (id, username, password, email, name, phone_number, aadhaar, services, 
       monthly_salary, gender, timing, region, approved)

-- Tiffins Table
tiffins (id, username, password, email, name, phone_number, aadhaar, price, 
         food_category, region, maid_address, approved)

-- Owners Table
owners (id, username, password, email, name, age, aadhaar, mobile_number, region)

-- PGs Table
pgs (id, owner_id, user_id, image_paths, latitude, longitude, amenities, 
     nearby_resources, rent, general_preference, region, availability)
```

### Relationship Tables
```sql
-- User-Maid Relationships
user_maid (id, user_id, maid_id, status, assigned_date_time, accepted_date_time, 
           deletion_date_time, user_address, start_date, end_date, time_slot)

-- User-Tiffin Relationships  
user_tiffins (id, user_id, tiffin_id, assigned_date_time, deletion_date_time, status)

-- Bookings
bookings (booking_id, user_id, pg_id, start_date, end_date)
```

## 🚀 API Endpoints

### Authentication Endpoints

#### Admin Authentication
```http
POST /api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

#### User Authentication
```http
POST /api/user/register
POST /api/user/login
```

#### Maid Authentication
```http
POST /api/maid/register
POST /api/maid/login
```

#### Tiffin Authentication
```http
POST /api/tiffin/register
POST /api/tiffin/login
```

### Admin Management Endpoints

#### Admin Dashboard
```http
GET /api/admin/dashboard
Authorization: Bearer <jwt_token>
```

#### Maid Management
```http
GET /api/admin/maids                    # List all maids
GET /api/admin/maids/{id}              # Get maid details
PUT /api/admin/maids/{id}/approve      # Approve maid
DELETE /api/admin/maids/{id}           # Delete maid
```

#### Tiffin Management
```http
GET /api/admin/tiffins                  # List all tiffins
GET /api/admin/tiffins/{id}            # Get tiffin details
PUT /api/admin/tiffins/{id}/approve    # Approve tiffin
DELETE /api/admin/tiffins/{id}         # Delete tiffin
```

### User Management Endpoints

#### User Dashboard
```http
GET /api/user/dashboard
Authorization: Bearer <jwt_token>
```

#### Maid Hiring
```http
POST /api/user/maid/request             # Request maid service
GET /api/user/maid/requests             # View maid requests
PUT /api/user/maid/requests/{id}        # Update request status
```

#### Tiffin Services
```http
POST /api/user/tiffin/request           # Request tiffin service
GET /api/user/tiffin/requests           # View tiffin requests
PUT /api/user/tiffin/requests/{id}      # Update request status
```

### Maid Management Endpoints

#### Maid Dashboard
```http
GET /api/maid/dashboard
Authorization: Bearer <jwt_token>
```

#### Job Management
```http
GET /api/maid/jobs                      # View assigned jobs
PUT /api/maid/jobs/{id}/status          # Update job status
GET /api/maid/earnings                  # View earnings
```

### Tiffin Management Endpoints

#### Menu Management
```http
POST /api/tiffin/menu                   # Create menu item
GET /api/tiffin/menu                    # View menu
PUT /api/tiffin/menu/{id}               # Update menu item
DELETE /api/tiffin/menu/{id}            # Delete menu item
```

#### Order Management
```http
GET /api/tiffin/orders                  # View orders
PUT /api/tiffin/orders/{id}/status      # Update order status
```

## 🔄 User Flows

### 1. User Registration & Onboarding
```
1. User visits registration page
2. Fills registration form (username, email, password, personal details)
3. System validates input and checks for duplicates
4. Password is hashed using BCrypt
5. User account is created in database
6. Welcome email is sent
7. User is redirected to login page
```

### 2. User Authentication
```
1. User enters credentials
2. System validates username/password combination
3. JWT token is generated with user claims
4. Token is returned to client
5. Client stores token for subsequent requests
```

### 3. Maid Service Workflow
```
1. User requests maid service
   - Selects maid type (cleaning, cooking, etc.)
   - Provides address and timing
   - Submits request

2. Admin reviews request
   - Views pending requests
   - Approves/rejects based on availability
   - Assigns maid to user

3. Maid receives assignment
   - Views assigned jobs
   - Updates job status
   - Completes service

4. User provides feedback
   - Rates service quality
   - Provides comments
   - System updates maid rating
```

### 4. Tiffin Service Workflow
```
1. Tiffin provider creates menu
   - Sets daily/weekly menu
   - Defines prices and categories
   - Activates menu items

2. User orders tiffin
   - Browses available menus
   - Places order with preferences
   - System processes order

3. Tiffin provider fulfills order
   - Views pending orders
   - Updates order status
   - Delivers service

4. User provides feedback
   - Rates food quality
   - Provides comments
   - System updates tiffin rating
```

### 5. PG Booking Workflow
```
1. Owner lists PG property
   - Provides property details
   - Sets rent and amenities
   - Uploads images

2. User searches for PGs
   - Filters by location, budget, preferences
   - Views property details
   - Places booking request

3. Owner reviews booking
   - Views booking requests
   - Approves/rejects based on availability
   - Confirms booking

4. Booking management
   - User tracks booking status
   - Owner manages tenant relationships
   - System handles payments (future feature)
```

## 🛡️ Security Features

### 1. JWT Token Security
- **Secure Key**: Base64 encoded symmetric key
- **Token Expiry**: 1-hour expiration with zero clock skew
- **Claims Validation**: Comprehensive claim verification
- **Token Refresh**: Automatic token refresh mechanism

### 2. Password Security
- **BCrypt Hashing**: Industry-standard password hashing
- **Salt Generation**: Automatic salt generation per password
- **Verification**: Secure password comparison
- **Migration Support**: Handles legacy password formats

### 3. Authorization
- **Role-Based Access**: Granular role-based permissions
- **Policy-Based Authorization**: Flexible authorization policies
- **Custom Attributes**: Custom authorization attributes
- **Middleware Protection**: Request-level security

### 4. Data Protection
- **Input Validation**: Comprehensive input sanitization
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Output encoding
- **CSRF Protection**: Token-based CSRF protection

## 📊 Session Management

### 1. Token-Based Sessions
- **Stateless Design**: No server-side session storage
- **JWT Tokens**: Self-contained session information
- **Automatic Expiry**: Built-in session timeout
- **Secure Storage**: Client-side token storage

### 2. User Context
- **Claims-Based Identity**: User information in JWT claims
- **Role Information**: Role-based access control
- **User ID Tracking**: Unique user identification
- **Audit Trail**: Request logging and tracking

### 3. Multi-User Support
- **User Type Detection**: Automatic user type identification
- **Role Assignment**: Dynamic role assignment
- **Permission Checking**: Granular permission validation
- **Context Switching**: Seamless user context switching

## 🚀 Deployment

### Prerequisites
- .NET 9.0 SDK
- MySQL 8.0+
- Windows/Linux/macOS

### Configuration
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=pgvaale;Uid=root;Pwd=password;"
  },
  "Jwt": {
    "SecretKey": "your-super-secret-key-with-at-least-32-characters",
    "Issuer": "PGVaale",
    "Audience": "PGVaaleUsers"
  }
}
```

### Database Setup
```sql
-- Run the setup script
mysql -u root -p < Data/setup_database.sql
```

### Application Startup
```bash
# Build the application
dotnet build

# Run the application
dotnet run

# Or publish for production
dotnet publish -c Release
```

## 🔧 Development

### Adding New Entities
1. Create entity class in `Entities/` folder
2. Add DbSet in `ApplicationDbContext`
3. Configure entity mapping in `OnModelCreating`
4. Create repository interface and implementation
5. Register services in `Program.cs`

### Adding New API Endpoints
1. Create controller in `Controllers/` folder
2. Define action methods with proper attributes
3. Add authorization policies if needed
4. Implement business logic in services
5. Test endpoints with proper authentication

### Database Migrations
```bash
# Create migration
dotnet ef migrations add MigrationName

# Apply migrations
dotnet ef database update
```

## 📈 Monitoring & Logging

### Logging Configuration
- **Structured Logging**: JSON-formatted logs
- **Log Levels**: Debug, Information, Warning, Error
- **Request Tracking**: Correlation IDs for request tracing
- **Performance Monitoring**: Request timing and metrics

### Health Checks
- **Database Connectivity**: MySQL connection health
- **Application Status**: Overall application health
- **Dependency Health**: External service health
- **Custom Metrics**: Business-specific health indicators

## 🔮 Future Enhancements

### Planned Features
- **Payment Integration**: Stripe/PayPal integration
- **Real-time Notifications**: SignalR WebSocket support
- **File Upload**: Image/document upload service
- **Email Templates**: Rich HTML email templates
- **Analytics Dashboard**: Business intelligence features
- **Mobile API**: Optimized mobile endpoints

### Scalability Improvements
- **Caching**: Redis caching layer
- **Load Balancing**: Multiple instance support
- **Database Sharding**: Horizontal database scaling
- **Microservices**: Service decomposition
- **Containerization**: Docker support

## 📞 Support

For technical support or questions:
- **Email**: support@pgvaale.com
- **Documentation**: [API Documentation](docs/api.md)
- **Issues**: [GitHub Issues](https://github.com/pgvaale/backend/issues)

---


