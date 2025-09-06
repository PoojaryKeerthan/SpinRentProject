
# SpinRent

A modern full-stack rental marketplace platform that connects product owners with renters, enabling seamless equipment and item rental experiences.

## 🌟 Project Overview

SpinRent is a comprehensive rental marketplace application that allows users to list items for rent and browse available rentals. The platform features secure authentication, role-based access control, and a complete rental workflow from listing to reservation management.

## ✨ Features

- **User Authentication & Authorization**
  - Secure authentication powered by Clerk
  - Role-based access control (Borrower and Provider roles)
  - User profile management

- **Product Management**
  - Create and manage product listings
  - Upload multiple product images
  - Detailed product descriptions and specifications
  - Availability calendar management

- **Reservation System**
  - Real-time booking system
  - Date range selection
  - Booking status tracking
  - Reservation history

- **Review & Rating System**
  - User reviews and ratings
  - Review management for providers
  - Rating-based product sorting

- **Communication**
  - Email notifications for bookings
  - Automated status updates
  
- **File Management**
  - Secure file upload functionality
  - Image optimization and storage
  - Multi-format support

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript
- **React Hook Form** - Form handling and validation

### Backend
- **Spring Boot 3** - Java application framework
- **Maven** - Dependency management and build tool
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Data persistence layer
- **Java 17** - Programming language

### Database
- **MySQL** - Relational database (Cloud-hosted)
- **Hibernate** - ORM framework

### Authentication
- **Clerk** - Modern authentication platform
- **JWT** - Token-based authentication

### DevOps & Deployment
- **Docker** - Containerization
- **Render** - Cloud deployment platform
- **GitHub Actions** - CI/CD pipeline

## 📁 Project Structure

```
SpinRent/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # Reusable UI components
│   │   ├── lib/             # Utility functions
│   │   ├── hooks/           # Custom React hooks
│   │   └── types/           # TypeScript type definitions
│   ├── public/              # Static assets
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/                 # Spring Boot application
│   ├── src/
│   │   └── main/
│   │       ├── java/        # Java source files
│   │       │   └── com/spinrent/
│   │       │       ├── controller/    # REST controllers
│   │       │       ├── service/       # Business logic
│   │       │       ├── repository/    # Data access layer
│   │       │       ├── entity/        # JPA entities
│   │       │       ├── dto/           # Data transfer objects
│   │       │       └── config/        # Configuration classes
│   │       └── resources/   # Configuration files
│   ├── Dockerfile
│   ├── pom.xml
│   └── docker-compose.yml
│
├── docs/                    # Documentation
├── .github/                 # GitHub Actions workflows
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Java** 17+
- **Maven** 3.6+
- **Docker** and Docker Compose
- **MySQL** database access
- **Clerk** account for authentication

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/spinrent.git
   cd spinrent
   ```

2. **Navigate to backend directory**
   ```bash
   cd backend
   ```

3. **Configure environment variables** (see Environment Variables section)

4. **Install dependencies and build**
   ```bash
   mvn clean install
   ```

5. **Run with Docker (Recommended)**
   ```bash
   docker-compose up -d
   ```

   **Or run locally**
   ```bash
   mvn spring-boot:run
   ```

The backend will be available at `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables** (see Environment Variables section)

4. **Run development server**
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

## 🔐 Environment Variables

### Backend (.env or application.properties)

```properties
# Database Configuration
SPRING_DATASOURCE_URL=jdbc:mysql://your-mysql-host:3306/spinrent_db
SPRING_DATASOURCE_USERNAME=your-db-username
SPRING_DATASOURCE_PASSWORD=your-db-password

# Clerk Configuration
CLERK_SECRET_KEY=your-clerk-secret-key
CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key

# Email Configuration
SPRING_MAIL_HOST=smtp.gmail.com
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=your-email@gmail.com
SPRING_MAIL_PASSWORD=your-app-password

# File Upload Configuration
FILE_UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10MB

# JWT Configuration
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRATION=86400000
```

### Frontend (.env.local)

```bash
# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# File Upload
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
```

## 🤝 Contributing

We welcome contributions to SpinRent! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

### Code Style

- **Frontend**: ESLint + Prettier configuration
- **Backend**: Google Java Style Guide
- Use meaningful variable and function names
- Add comments for complex logic

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:

- Create an issue on GitHub
- Contact the development team
- Check the documentation in the `/docs` folder

## 🚀 Deployment

The application is deployed on Render:

- **Frontend**: Automatically deployed from main branch
- **Backend**: Dockerized deployment with auto-scaling
- **Database**: MySQL hosted on cloud provider

---

**Built with ❤️ by the SpinRent Team**
