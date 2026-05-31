# Smart Rental Management System

A full-stack rental property management application developed using Spring Boot, React, and MySQL. The system helps property owners and tenants manage rental properties, lease agreements, payments, and maintenance requests efficiently.

## 🚀 Features

### Admin
- Manage properties and rental listings
- Approve or reject tenant applications
- Monitor rental agreements
- View payment records
- Manage users and system data

### Tenant
- Browse available rental properties
- Submit rental applications
- View lease details
- Track rent payments
- Raise maintenance requests

### Property Management
- Add, update, and delete property listings
- Track occupancy status
- Manage rental contracts
- Store tenant information securely

## 🛠️ Tech Stack

### Frontend
- React.js
- HTML5
- CSS3
- JavaScript
- Axios

### Backend
- Java
- Spring Boot
- Spring Data JPA
- Spring Security
- REST APIs

### Database
- MySQL

### Tools & Technologies
- Maven
- Git & GitHub
- VS Code
- Postman

## 📂 Project Structure

```
Smart-Rental-Management-System
│
├── backend
│   ├── src
│   ├── target
│   └── pom.xml
│
├── frontend
│
├── database
│
└── README.md
```

## ⚙️ Installation & Setup

### Prerequisites

- Java 17+
- Node.js
- MySQL
- Maven
- Git

### Backend Setup

```bash
cd backend

mvn clean install

mvn spring-boot:run
```

Backend runs on:

```
http://localhost:8080
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

### Database Setup

1. Create a MySQL database.
2. Import the SQL file from the `database` folder.
3. Update database credentials in:

```properties
application.properties
```

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/rental_management
spring.datasource.username=root
spring.datasource.password=your_password
```

## 🔗 API Integration

The frontend communicates with the backend using REST APIs for:

- User Authentication
- Property Management
- Rental Applications
- Payment Tracking
- Maintenance Requests

## 📈 Key Achievements

- Developed a full-stack rental management platform.
- Implemented secure authentication and authorization.
- Designed responsive and user-friendly interfaces.
- Integrated MySQL database with Spring Boot.
- Built scalable RESTful APIs for seamless communication.

## Future Enhancements

- Online Payment Gateway Integration
- Email & SMS Notifications
- Property Image Uploads
- Analytics Dashboard
- Mobile Application Support

## 👩‍💻 Author

**Priyadarshini Nagashetty Metre**

GitHub: [https://github.com/YOUR_GITHUB_USERNAME](https://github.com/Priyadarshini-metre)

LinkedIn: https:[//www.linkedin.com/in/YOUR_LINKEDIN_USERNAME/](https://www.linkedin.com/in/priyadarshini-metre-1b354b2a7?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BjT2XeF22SLWV20IhckHkSA%3D%3D)

## 📜 License

This project is developed for educational and portfolio purposes.
