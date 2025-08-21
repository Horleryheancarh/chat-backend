# Chat Backend

A chat application backend built with Node.js, Express, Socket.IO, TypeScript, and MySQL using Sequelize ORM.



## Features

- **JWT Authentication** - Secure user registration and login
- **Chat Rooms** - Create public/private rooms with invite codes
- **Messaging** - Instant messaging with Socket.IO
- **User Presence** - Online/offline status tracking
- **Rate Limiting** - Message rate limiting
- **Security** - Input validation, CORS, and Helmet security
- **Docker Support** - Containerized deployment

## Tech Stack

- **Runtime**: Node.js 22+
- **Framework**: Express.js
- **WebSocket**: Socket.IO
- **Database**: MySQL with Sequelize ORM
- **Language**: TypeScript
- **Authentication**: JWT with bcrypt
- **Security**: Helmet, CORS, rate limiting

## Prerequisites

- Node.js 22+ installed
- MySQL 8.0+ server running
- npm package manager

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd chat-backend
npm install
```

### 2. Run in Development mode
```bash
npm run dev
```

### 3. Run in Production mode
```bash
npm run build
npm start
```

### 4. Run with Docker Compose
```bash
docker-compose up -d
```

## Project Structure

.
├── docker-compose.env
├── docker-compose.yml
├── Dockerfile
├── package.json
├── package-lock.json
├── README.md
├── rest.http
├── src
│   ├── app.ts
│   ├── config.ts
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   └── socket
└── tsconfig.json


## !NOTE rest.http shows endpoints