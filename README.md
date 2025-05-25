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
- [MongoDB](https://www.mongodb.com/)

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
