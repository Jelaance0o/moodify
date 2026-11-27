
# 🎵 Moodify

> **Feel the mood. Play the music.**

Moodify is a full-stack, mood-based music player that uses facial expression and hand gesture detection to recommend songs based on your emotions.

It provides a personalized music experience with mood detection, music playback, song uploads, authentication, and listening history.

---

## ✨ Features

- **User Authentication:** Register and log in securely using HTTP-only cookies.
- **Facial Mood Detection:** Detect emotions using MediaPipe.
- **Mood Categories:** Happy, Sad, Anger, and Bliss.
- **Mood-Based Recommendations:** Discover songs according to your detected mood.
- **Music Upload:** Upload MP3 files and assign moods.
- **Automatic Metadata Extraction:** Extract song title, artist, year, and embedded cover artwork from MP3 ID3 tags.
- **Lyrics Support:** Add optional lyrics while uploading songs.
- **Music Search:** Search songs and filter them by mood.
- **Playback Controls:** Control playback, volume, and playback speed.
- **Shuffle and Queue:** Manage your listening experience.
- **Mood History:** View previous mood detections and listening sessions.
- **Sleep Timer:** Automatically stop music playback after a selected duration.
- **Audio Visualizer:** Visualize audio while listening.
- **Theme Support:** Switch between light and dark themes.

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- JavaScript
- React Router
- Axios
- SCSS
- MediaPipe Tasks Vision
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Redis
- JSON Web Tokens (JWT)
- bcrypt
- Multer
- ImageKit
- Node-ID3

---

## 📁 Project Structure

```text
moodify/
│
├── backend/
│   ├── server.js
│   └── src/
│       ├── app.js
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       └── services/
│
└── frontend/
    ├── src/
    │   ├── features/
    │   │   ├── auth/
    │   │   ├── Expression/
    │   │   ├── home/
    │   │   ├── shared/
    │   │   └── upload/
    │   │
    │   ├── App.jsx
    │   └── app.routes.jsx
    │
    └── vite.config.js
```

---

## ⚙️ Prerequisites

Before running Moodify, make sure you have installed:

- Node.js 18 or newer
- npm
- MongoDB
- Redis
- ImageKit account
- A modern browser with camera support

---

## 🚀 Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Jelaance0o/moodify.git

cd moodify
```

### 2. Install Backend Dependencies

```bash
cd backend

npm install
```

### 3. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend

npm install
```

---

## 🔐 Environment Configuration

### Backend Environment Variables

Create a `.env` file inside the `backend` directory.

```env
MONGO_URI=mongodb://127.0.0.1:27017/moodify

REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=

JWT_SECRET=your_jwt_secret

IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key

CORS_ORIGIN=http://localhost:5173
```

### Frontend Environment Variables

Create a `.env` file inside the `frontend` directory.

```env
VITE_API_BASE_URL=http://localhost:3000
```

**Important:** Replace the placeholder credentials with your actual configuration values. Never upload your `.env` files or private credentials to GitHub.

---

## ▶️ Running the Application

Moodify requires MongoDB and Redis to be running before starting the backend.

### Start the Backend

Open a terminal:

```bash
cd backend

npm run dev
```

Backend URL:

```text
http://localhost:3000
```

### Start the Frontend

Open another terminal:

```bash
cd frontend

npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

Open the frontend URL in your browser to use Moodify.

---

## 🔌 API Routes

### Authentication Routes

Base URL:

```text
/api/auth
```

| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register a new user |
| POST | `/login` | Authenticate a user |
| GET | `/get-me` | Get the authenticated user |
| GET | `/logout` | Log out the user |

### Song Routes

Base URL:

```text
/api/songs
```

| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Upload an MP3 song |
| GET | `/` | Fetch available songs |

---

## 🎭 Mood Detection

Moodify uses facial expression and hand gesture detection powered by **MediaPipe Tasks Vision**.

The application detects four mood categories:

| Mood | Detection |
|---|---|
| Happy | Smile |
| Sad | Frown or downward gaze |
| Anger | Lowered eyebrows |
| Bliss | Smile combined with two open palms |

Camera permission is required for mood detection.

MediaPipe models and the WASM runtime are downloaded from CDN services, so an internet connection is required for loading these assets.

---

## 🎧 Song Upload

Moodify allows users to upload music in MP3 format.

### Upload Requirements

- Supported format: MP3
- Maximum file size: 20 MB
- Mood selection: Required
- Lyrics: Optional

### Upload Process

1. Select an MP3 file.
2. Choose one of the four available moods.
3. Enter lyrics if available.
4. Submit the upload form.
5. The backend extracts available metadata and cover artwork using Node-ID3.
6. The MP3 file and poster artwork are uploaded to ImageKit.
7. Song information is saved in MongoDB.

### Extracted Song Information

- Title
- Artist
- Year
- Cover artwork

The selected mood and optional lyrics are submitted separately through the upload form.

---

## 📜 Available Scripts

### Frontend

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the production application |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build |

### Backend

| Command | Description |
|---|---|
| `npm run dev` | Start the backend development server |

---

## 📝 Additional Notes

- Moodify uses port `3000` for the backend and port `5173` for the frontend during local development.
- MongoDB must be configured before using database-dependent features.
- Redis is used to blacklist logged-out authentication tokens.
- ImageKit credentials are required for uploading songs and artwork.
- Authentication uses HTTP-only cookies.
- Mood detection requires camera permission and internet access to download MediaPipe assets.
- The upload feature supports MP3 files up to 20 MB.

---

## 🎯 Project Goal

The goal of Moodify is to make music discovery more personal by connecting emotions with music.

Instead of manually searching for songs, users can explore music that matches their current mood and enjoy a more personalized listening experience.

---

**Made with ❤️ for music lovers.**

### Moodify — Feel the mood. Play the music.
