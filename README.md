# Project Management Tool (Backend)

A scalable backend application for managing projects, organizations, boards, and issues — built using Node.js, Express, MongoDB, and JWT authentication.

This project is designed to simulate real-world project management systems like Trello or Jira, helping teams organize work efficiently.

---

## Features

* User Authentication (JWT-based)
* Organization Management
* Boards and Task Management
* Issue Tracking System
* Multi-user support
* RESTful API architecture
* Secure middleware-based authorization

---

## Tech Stack

* Backend: Node.js, Express.js
* Database: MongoDB
* Authentication: JSON Web Token (JWT)
* Tools: Postman, Git, GitHub

---

## Project Structure

```
project-management-tool/
│── models/           # Database schemas
│── middleware/       # Auth middleware
│── routes/           # API routes
│── index.js          # Entry point
│── package.json
```

---

## Installation and Setup

### 1. Clone the repository

```
git clone https://github.com/Digital-Rishav/project-management-tool.git
cd project-management-tool
```

### 2. Install dependencies

```
npm install
```

### 3. Setup environment variables

Create a `.env` file:

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4. Run the server

```
npm start
```

---

## API Endpoints (Sample)

### Auth

* POST /signup → Register user
* POST /signin → Login user

### Organizations

* POST /org → Create organization
* GET /org → Get organizations

### Boards

* POST /board → Create board
* GET /board → Fetch boards

### Issues

* POST /issue → Create issue
* GET /issue → Get issues

---

## Authentication

All protected routes require a token:

```
Headers:
token: YOUR_JWT_TOKEN
```

---

## Testing

Use Postman to test APIs:

1. Signup and get token
2. Use token in headers
3. Test protected routes

---

## Future Improvements

* Frontend (React or Next.js)
* Role-based access control (RBAC)
* Real-time updates (WebSockets)
* Notifications system
* Deployment using Docker and cloud services

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## License

This project is open-source and available under the MIT License.

---

## Author

Rishav Kumar
GitHub: https://github.com/Digital-Rishav

---

## Support

If you find this project useful, consider giving it a star on GitHub.
