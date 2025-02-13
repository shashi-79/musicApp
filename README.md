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

4. Change `env` to `.env` file in the root directory and add your environment variables:
   - `MONGODB_URI`: Your MongoDB connection string.
   - `SMTP_EMAIL`: Your SMTP email for sending emails.
   - `SMTP_APP_PASSWORD`: Your SMTP application password.
   - `JWT_REFRESH_SECRET`: Secret key for refreshing JWT tokens.
   - `JWT_ACCESS_TOKEN_EXPIRATION`: Access token expiration time (e.g., 15m).
   - `JWT_ACCESS_TOKEN_SECRET`: Secret key for access tokens.
   - `JWT_REFRESH_EXPIRATION`: Refresh token expiration time (e.g., 7d).
   - `CAPTCHA_EXPIRATION_MINUTES`: CAPTCHA expiration time in minutes.
   - `CAPTCHA_LENGTH`: Length of the CAPTCHA code.
   - `APP_NAME`: Name of the application (e.g., "music").
   - `SUPABASE_URL`: Your Supabase URL.
   - `SUPABASE_KEY`: Your Supabase key.

## Usage

To start the development server, run:
```bash
npm run dev
```
Then open your browser and navigate to `http://localhost:3000`.

## STRUCTURE

```
musicApp/
├───src/
│    ├───app
│    │   ├───auth
│    │   │   ├───api
│    │   │   │    ├───captcha
│    │   │   │    ├───deleteAccount
│    │   │   │    ├───login
│    │   │   │    ├───logout
│    │   │   │    ├───register
│    │   │   │    ├───token
│    │   │   │    └───verifyOtp
│    │   │   ├───deleteAccount
│    │   │   ├───login
│    │   │   ├───logout
│    │   │   ├───register
│    │   │   └───webAuth
│    │   │       ├───api
│    │   │       │    ├───login
│    │   │       │    │   ├───start
│    │   │       │    │   └───verify
│    │   │       │    └───register
│    │   │       │        ├───start
│    │   │       │        └───verify
│    │   │       ├───login
│    │   │       └───register
│    │   ├───home
│    │   │   ├───audio
│    │   │   │   ├───api
│    │   │   │   │   ├───comments
│    │   │   │   │   │   └───[musicId]
│    │   │   │   │   ├───dislike
│    │   │   │   │   │   └───[musicId]
│    │   │   │   │   │       └───[userId]
│    │   │   │   │   ├───like
│    │   │   │   │   │   └───[musicId]
│    │   │   │   │   │       └───[userId]
│    │   │   │   │   ├───logo
│    │   │   │   │   │   └───[musicId]
│    │   │   │   │   ├───manifest
│    │   │   │   │   │   └───[musicId]
│    │   │   │   │   │       └───[data]
│    │   │   │   │   ├───metadata
│    │   │   │   │   │   └───[musicId]
│    │   │   │   │   ├───views
│    │   │   │   │   │   └───[musicId]
│    │   │   │   │   │       └───[userId]
│    │   │   │   │   └───watchtime
│    │   │   │   │       └───[musicId]
│    │   │   │   │           └───[userId]
│    │   │   │   └───[musicId]
│    │   │   ├───profile
│    │   │   │   ├───api
│    │   │   │   │   └───profile
│    │   │   │   │       └───[userId]
│    │   │   │   └───edit
│    │   │   ├───search
│    │   │   │   └───api
│    │   │   ├───suggestion
│    │   │   │   └───api
│    │   │   └───upload
│    │   │       └───api
│    │   ├───medium
│    │   │   └───api
│    │   └───setting
│    ├───components
│    ├───config
│    ├───functions
│    ├───hooks
│    ├──models
│    └───utils
├───public
└─── .env
```

# API Endpoints

## Authentication Endpoints: /auth/
1. **`GET /api/captcha`**: Generates a captcha for verification.
2. **`DELETE /api/deleteAccount`**: Deletes a user account.
3. **`POST /api/login`**: Authenticates a user and returns tokens.
4. **`POST /api/logout`**: Logs out a user by deleting their refresh token.
5. **`POST /api/register`**: Registers a new user and sends an OTP for verification.
6. **`POST /api/token`**: Refreshes the access token.

## Audio Management Endpoints: /home/audio | /home/upload
1. **`GET /api/comments/[musicId]`**: Fetches comments for a specific music track.
2. **`POST /api/comments/[musicId]`**: Adds a new comment to a specific music track.
3. **`GET /api/like/[musicId]`**: Fetches like and dislike metadata for a specific music track.
4. **`POST /api/dislike/[musicId]/[userId]`**: Toggles the dislike status for a specific user on a music track.
5. **`POST /api/upload`**: Uploads music and logo files, saves metadata, and returns the music ID.



## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
