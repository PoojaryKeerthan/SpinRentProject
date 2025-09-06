Spinrent - DJ Gadget Rental System
Spinrent is a modern web application for renting DJ gadgets, built with a Spring Boot backend, Next.js frontend, Clerk for authentication, MySQL as the database, and Docker for containerization. The platform allows users to browse, search, and rent DJ equipment, with a user-friendly interface and secure authentication.
Table of Contents

Features
Tech Stack
Prerequisites
Installation
Configuration
Running the Application
Docker Setup
Project Structure
Usage
Contributing
License

Features

User Authentication: Secure login and registration using Clerk.
Product Listings: Browse and search DJ gadgets with filters for category, price, and availability.
Product Management: Create, update, and delete product ads (for authorized users).
Responsive UI: Modern, responsive frontend built with Next.js and Tailwind CSS.
Database: MySQL for storing user and product data.
Containerization: Dockerized backend and frontend for easy deployment.
Search Functionality: Filter products by name, description, or category.

Tech Stack

Backend: Spring Boot (Java), Spring Data JPA, Spring Security
Frontend: Next.js (React, TypeScript), Tailwind CSS, React Icons
Authentication: Clerk
Database: MySQL
Containerization: Docker, Docker Compose
Other Tools: Maven (for Spring Boot), npm (for Next.js)

Prerequisites
Before setting up the project, ensure you have the following installed:

Java: 17 or higher
Node.js: 18 or higher
Docker: Latest version
Docker Compose: Latest version
MySQL: 8.0 or higher (if not using Docker)
Clerk Account: Sign up at Clerk.dev for authentication
Git: To clone the repository

Installation

Clone the Repository:
git clone https://github.com/your-username/spinrent.git
cd spinrent


Backend Setup (Spring Boot):

Navigate to the backend directory:cd backend


Install dependencies using Maven:mvn clean install




Frontend Setup (Next.js):

Navigate to the frontend directory:cd frontend


Install dependencies:npm install





Configuration

Backend Configuration:

Create a .env file in the backend directory based on .env.example:SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/spinrent_db?createDatabaseIfNotExist=true
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=your_password
SPRING_JPA_HIBERNATE_DDL_AUTO=update
CLERK_SECRET_KEY=your_clerk_secret_key


Replace your_password and your_clerk_secret_key with your MySQL password and Clerk secret key (from Clerk dashboard).


Frontend Configuration:

Create a .env.local file in the frontend directory:NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/products
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/products
NEXT_PUBLIC_API_URL=http://localhost:8080/api


Replace your_clerk_publishable_key with your Clerk publishable key.


MySQL Setup (if not using Docker):

Create a database named spinrent_db:CREATE DATABASE spinrent_db;


Ensure MySQL is running and accessible.



Running the Application

Backend:

From the backend directory, run:mvn spring-boot:run


The Spring Boot server will start on http://localhost:8080.


Frontend:

From the frontend directory, run:npm run dev


The Next.js app will start on http://localhost:3000.


Access the application at http://localhost:3000 in your browser.


Docker Setup

Ensure Docker and Docker Compose are installed.

Build and Run:

From the root directory, run:docker-compose up --build


This will start:
Spring Boot backend on http://localhost:8080
Next.js frontend on http://localhost:3000
MySQL database on localhost:3306 (accessible within Docker network)




Stop Containers:
docker-compose down


Docker Compose Configuration:Ensure you have a docker-compose.yml file in the root directory:
version: '3.8'
services:
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: your_password
      MYSQL_DATABASE: spinrent_db
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - spinrent-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://db:3306/spinrent_db?createDatabaseIfNotExist=true
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: your_password
      SPRING_JPA_HIBERNATE_DDL_AUTO: update
      CLERK_SECRET_KEY: your_clerk_secret_key
    ports:
      - "8080:8080"
    depends_on:
      - db
    networks:
      - spinrent-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    environment:
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: your_clerk_publishable_key
      NEXT_PUBLIC_CLERK_SIGN_IN_URL: /sign-in
      NEXT_PUBLIC_CLERK_SIGN_UP_URL: /sign-up
      NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: /products
      NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: /products
      NEXT_PUBLIC_API_URL: http://backend:8080/api
    ports:
      - "3000:3000"
    depends_on:
      - backend
    networks:
      - spinrent-network

volumes:
  db_data:

networks:
  spinrent-network:
    driver: bridge


Replace your_password and your_clerk_secret_key/your_clerk_publishable_key with your actual credentials.


Dockerfiles:

Backend (backend/Dockerfile):FROM maven:3.8.5-openjdk-17
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests
EXPOSE 8080
CMD ["java", "-jar", "target/spinrent-backend.jar"]


Frontend (frontend/Dockerfile):FROM node:18
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]





Project Structure
spinrent/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/spinrent/spinrentbackend/
│   │   │   │   ├── entity/ProductAd.java
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── repository/
│   │   │   ├── resources/application.properties
│   ├── pom.xml
│   ├── Dockerfile
├── frontend/
│   ├── app/
│   │   ├── products/page.tsx
│   ├── public/
│   ├── package.json
│   ├── Dockerfile
├── docker-compose.yml
├── README.md

Usage

Access the App:

Open http://localhost:3000 in your browser.
Sign in or sign up using Clerk authentication.
Browse products on the /products page, filter by category, price, or rating, and search by name or description.


API Endpoints (example):

GET /api/products: Fetch all product ads.
POST /api/products: Create a new product ad (authenticated).
GET /api/products/:id: Fetch a specific product by ID.
Replace http://localhost:8080 with your backend URL in production.


Authentication:

Clerk handles user authentication. Configure routes in frontend/app/layout.tsx:import { ClerkProvider } from '@clerk/nextjs';
export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}





Contributing

Fork the repository.
Create a new branch: git checkout -b feature/your-feature.
Make changes and commit: git commit -m "Add your feature".
Push to the branch: git push origin feature/your-feature.
Open a pull request.

Please follow the Code of Conduct and ensure tests pass before submitting.
License
This project is licensed under the MIT License. See the LICENSE file for details.
