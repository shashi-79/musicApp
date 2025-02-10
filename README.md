# Project Title: Music App

A comprehensive music application built with Next.js and MongoDB.

## Description

This project is a Next.js application that integrates with MongoDB for data management. It includes user authentication, audio content management, and various features for a seamless user experience.

## Features
- User authentication with JWT and WebAuthn
- Audio content management
- User profiles management
- Search functionality for audio
- Comment system for audio
- Like/Dislike system for audio
- View tracking for user engagement
- Watch time tracking for audio content


## Technologies Used

- **Next.js**: A React framework for server-side rendering and static site generation.
- **MongoDB**: A NoSQL database for storing user and audio data.
- **JWT**: JSON Web Tokens for secure user authentication.
- **React**: A JavaScript library for building user interfaces.

## Installation Instructions
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd musicApp
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and add your environment variables:
   - `MONGODB_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: Secret key for JWT.
   - `NEXTAUTH_URL`: The URL of your application.


2. Navigate to the project directory:
   ```bash
   cd musicApp
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and add your environment variables.

## Usage

To start the development server, run:
```bash
npm run dev
```
Then open your browser and navigate to `http://localhost:3000`.

## API Endpoints
- **POST /api/auth/login**: Authenticate a user and return a challenge.
  - **Request Body**: `{ "username": "user", "password": "pass" }`
  - **Response**: `{ "token": "jwt-token" }`

- **GET /api/audio**: Retrieve audio content.
  - **Response**: `[ { "id": "audioId", "title": "Audio Title", "url": "audio-url" } ]`

- **POST /api/audio**: Add new audio content.
  - **Request Body**: `{ "title": "Audio Title", "url": "audio-url" }`
  - **Response**: `{ "message": "Audio added successfully" }`


## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
