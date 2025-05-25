# Authentication.API

A simple authentication API built with [NestJS](https://nestjs.com/) that supports user signup, signin, token refresh, and logout using JWT.

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
- [PostgreSQL](https://www.postgresql.org/) or your preferred database (if using a database)

## Installation

1. **Clone the repository:**

    ```sh
    git clone https://github.com/your-username/Authentication.API.git
    cd Authentication.API
    ```

2. **Install dependencies:**

    ```sh
    npm install
    ```

3. **Configure environment variables:**

    Create a `.env` file in the root directory and set the following variables as needed:

    ```
    PORT=3000
    JWT_SECRET=your_jwt_secret
    JWT_REFRESH_SECRET=your_jwt_refresh_secret
    DATABASE_URL=your_database_connection_string
    ```

4. **Run database migrations** (if applicable):
    ```sh
    npm run typeorm migration:run
    ```
    _(Skip if not using TypeORM or migrations)_

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

## API Endpoints

- `POST /api/auth/signup` — Register a new user
- `POST /api/auth/signin` — Login and receive tokens
- `POST /api/auth/refresh` — Refresh JWT tokens
- `POST /api/auth/logout` — Logout (requires authentication)

## Project Structure

```
src/
  auth/
    auth.controller.ts
    auth.service.ts
    dto/
      sign-in.dto.ts
      sign-up.dto.ts
      token.dto.ts
    guards/
      logout-jwt-auth.guard.ts
  users/
    dto/
      create-user.dto.ts
    entities/
      user.entity.ts
  main.ts
```

## License

MIT

---

**Note:**  
Update the database configuration and JWT secrets according to your environment and security requirements.
