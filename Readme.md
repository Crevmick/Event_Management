# 🎉 Event Management Backend System

A scalable and secure RESTful API for managing events, users, categories, and event registrations. Built with **Node.js**, **Express.js**, and **MongoDB**, with user authentication, OTP verification, and Google OAuth support.

---

## 🚀 Tech Stack

| Technology   | Purpose                                |
|--------------|----------------------------------------|
| Node.js      | JavaScript runtime                     |
| Express.js   | Web framework                          |
| MongoDB      | NoSQL database                         |
| Mongoose     | MongoDB object modeling                |
| JWT          | User authentication                    |
| bcryptjs     | Password hashing                       |
| Passport.js  | Google OAuth login                     |

---

## 🔐 Authentication Features

- User signup & login with email/password
- Email verification via OTP
- Password reset with OTP
- Google OAuth login
- JWT-based route protection

---

## 📁 API Endpoints Overview

### 🔑 Auth Routes

| Method | Endpoint                              | Description                      |
|--------|---------------------------------------|----------------------------------|
| POST   | `/api/auth/signup`                    | Register new user                |
| POST   | `/api/auth/signup/verifyOTP`          | Verify user via OTP              |
| POST   | `/api/auth/signup/resendOTPVerificationCode` | Resend OTP                  |
| POST   | `/api/auth/signup/forget_password`    | Request password reset OTP       |
| POST   | `/api/auth/login`                     | Login with email/password        |
| GET    | `/api/auth/google`                    | Google OAuth login               |
| GET    | `/api/auth/google/callback`           | OAuth callback                   |
| GET    | `/api/auth/logout`                    | Logout                           |

---

### 🧩 Category Routes

| Method | Endpoint                      | Description              |
|--------|-------------------------------|--------------------------|
| POST   | `/api/category/category`      | Create new category      |
| GET    | `/api/category/categories`    | Fetch all categories     |
| GET    | `/api/category/categories/:id`| Get single category      |
| PUT    | `/api/category/categories/:id`| Update category          |
| DELETE | `/api/category/categories/:id`| Delete category          |

---

### 📅 Event Routes

| Method | Endpoint              | Description         |
|--------|-----------------------|---------------------|
| POST   | `/api/event/`         | Create event        |
| GET    | `/api/event/`         | List all events     |
| GET    | `/api/event/:id`      | Get event by ID     |
| PUT    | `/api/event/:id`      | Update event        |
| DELETE | `/api/event/:id`      | Delete event        |

---

### 📝 Event Registration Routes

| Method | Endpoint                                        | Description                         |
|--------|-------------------------------------------------|-------------------------------------|
| POST   | `/api/registerEvent/register`                   | Register for an event               |
| GET    | `/api/registerEvent/:eventId/registrations`     | View all registrations for an event|

---

## 🔐 Middleware

- `authenticateUser`: Protects private routes using JWT.
- Passport.js for handling Google OAuth2 login.

---

## 📦 Folder Structure
src/ ├── config/ # DB connection, passport strategies ├── controller/ # Business logic for routes ├── middleware/ # JWT auth, request validation, error handlers ├── model/ # Mongoose schemas and models ├── route/ # All route handlers │ ├── auth/ # Auth routes (signup, login, Google) │ ├── category/ # Category CRUD routes │ ├── event/ # Event CRUD routes │ └── registerEvent/ # Event registration routes ├── util/ # Helper functions (e.g., OTP generator) ├── app.js # Main Express app └── server.js # Server startup


---

## 📦 Installation & Setup

```bash
git clone https://github.com/yourusername/event-management-backend.git
cd event-management-backend
npm install

