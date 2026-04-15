# Book My Ticket — Backend API

A production-style movie ticket booking backend built for the **Chai Code SQL Hackathon**. The system implements secure authentication, protected routes, and concurrent seat booking using PostgreSQL transactions.

---

## Live API

```
https://book-my-ticket-v2nq.onrender.com/
```

---

## Overview

Book My Ticket is a RESTful backend system that enables users to register, authenticate, browse available seats, and book them all while handling concurrent requests safely through database-level locking.

The project was built by extending an existing codebase, with a focus on:

- Implementing JWT-based authentication from scratch
- Designing protected API routes using custom middleware
- Handling concurrent seat bookings using PostgreSQL transactions and row-level locking

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | PostgreSQL (Neon) |
| Auth | JSON Web Tokens (JWT) |
| Password Hashing | bcrypt |
| Deployment | Render |

---

## Features

### Authentication
- User registration with bcrypt-hashed passwords
- Secure login returning a signed JWT token
- Middleware-based token verification on protected routes

### Seat Booking
- View all available seats
- Book a seat with duplicate booking prevention
- Atomic operations using `BEGIN / COMMIT` SQL transactions
- Race condition prevention via `SELECT ... FOR UPDATE` row-level locking

### API Protection
- All booking routes require a valid JWT in the `Authorization` header
- Token payload is used to associate bookings with the authenticated user

---

## Database Schema

### users

```sql
CREATE TABLE users (
  id       SERIAL PRIMARY KEY,
  email    VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);
```

### seats

```sql
CREATE TABLE seats (
  id       SERIAL PRIMARY KEY,
  name     VARCHAR(255) NOT NULL,
  isbooked INT DEFAULT 0
);
```

---

## API Reference

### Auth

#### Register

```http
POST /sign-up
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

#### Login

```http
POST /sign-in
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response:**

```json
{
  "token": "<JWT_TOKEN>"
}
```

---

### Seats

#### Get all seats

```http
GET /seats
```

#### Book a seat (protected)

```http
PUT /:id
Authorization: Bearer <token>
```

#### My bookings (protected)

```http
GET /my-bookings
Authorization: Bearer <token>
```

---

## Authentication Flow

```
Client → POST /sign-in → Server validates credentials
       ← JWT token returned

Client → PUT /:id (with token) → Middleware verifies token
                               → User ID extracted from payload
                               → Booking proceeds
```

---

## Booking Logic

Concurrent booking requests are handled safely using PostgreSQL transactions:

```sql
BEGIN;
  SELECT * FROM seats WHERE id = $1 FOR UPDATE;
  -- Check if already booked
  UPDATE seats SET isbooked = 1, userId = $2 WHERE id = $1;
COMMIT;
```

The `FOR UPDATE` lock ensures that if two users attempt to book the same seat simultaneously, only one transaction succeeds — the other waits and then sees the updated state before proceeding.

---

## Local Setup

```bash
# Clone the repository
git clone https://github.com/coderTejas565/book-my-ticket.git
cd book-my-ticket

# Install dependencies
npm install

# Create a .env file and add the variables listed in the Environment Variables section

# Start development server
npm run dev
```

---

## Environment Variables

```env
DATABASE_URL=your_neon_postgres_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=8080
```

---

## Project Structure

```
book-my-ticket/
├── index.mjs
├── middleware/
│   └── authmiddleware.js
├── .env
├── package.json
└── README.md
```

---

## Deployment

| Service | Provider |
|---|---|
| API Server | Render (free tier) |
| PostgreSQL | Neon (free tier) |

---

## Key Learnings

- Extending and contributing to an existing codebase
- Designing and implementing JWT authentication end-to-end
- Writing SQL transactions to handle concurrency safely
- Connecting a cloud-hosted PostgreSQL instance to a deployed Node.js API
- Structuring middleware for route-level access control

---

## Potential Improvements

- Booking cancellation endpoint
- Seat categories (standard, premium, VIP)
- Movie and showtime management
- Frontend UI
- Payment gateway integration

---

## Built For

**Chai Code — SQL Hackathon**

This project demonstrates a real-world backend system covering authentication, database safety, concurrency handling, and cloud deployment.