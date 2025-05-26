# Authentication.API

A simple authentication API built with [NestJS](https://nestjs.com/) that supports user signup, signin, token refresh, and logout using JWT.

## 🔐 Overview

This authentication system includes multiple layers of security to ensure safe user management and token handling:

### ✅ JWT Access and Refresh Tokens
- **Access Tokens**: Short-lived JWTs signed using a secure secret. Used for authenticating API requests.
- **Refresh Tokens**: Long-lived tokens stored securely and used to obtain new access tokens without re-authentication.
- **Refresh Token Rotation**: Each refresh request issues a new token and invalidates the old one to prevent token reuse.
- **Secure Storage**: Hashed refresh tokens are stored in the database using `bcrypt` to prevent misuse in case of a database breach.

### ✅ Input Validation and Sanitization
- All incoming requests are validated using `class-validator` and `class-transformer`.
- Prevents common injection attacks and malformed data submissions.

### ✅ Rate Limiting
- rate limiting to sensitive routes (e.g., login) using `@nestjs/throttler` to mitigate brute-force attacks.
- rate limiting must also be applied at server level, but here it's used according to business needs.

### ✅ Logging & Monitoring
- Secure logging implemented via **Winston**.

### ✅ Password Security
- User passwords are hashed with `bcrypt` before being stored.

## 📘 API Documentation

This project uses [Swagger](https://swagger.io/) for API documentation.

Once the server is running, you can access the interactive API docs at: /api.


## Features

- User registration (signup)
- User login (signin)
- JWT access and refresh tokens
- Token refresh endpoint
- Logout endpoint with JWT guard
- DTO validation

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/)

## Installation

1. **Clone the repository:**

    ```sh
    git clone https://github.com/Nesmasafa98/Authentication.API.git
    cd Authentication.API
    ```

2. **Install dependencies:**

    ```sh
    npm install
    ```

3. **Configure environment variables:**

    Create a `.env` file in the root directory.
	You may find a template in .env.default, please set all the available variables in your `.env`.



## Running the Project

### Development

```sh
npm run start:dev
```

The API will be available at `http://localhost:3000/api/auth`.

### Production

```sh
npm run build
npm run start:prod
```

**Note:**  
Update the database configuration and JWT secrets according to your environment and security requirements.
