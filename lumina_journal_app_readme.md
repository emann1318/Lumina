# Lumina — Full Stack Daily Journal Application

Lumina is a full-stack MERN journal application where users can securely create personal journal entries, upload images, organize entries by date, and switch between light and dark themes.

---

# Features

## Authentication
- User Signup
- User Login
- JWT Authentication
- Password Encryption using bcrypt
- Protected Routes
- Logout Functionality

## Journal Management
- Create Journal Entries
- View All Entries
- Edit Existing Entries
- Delete Entries
- Date-wise Organization
- Latest Entries First

## Additional Features
- Light Mode / Dark Mode
- Image Uploads
- Responsive UI
- Persistent Theme Settings using Local Storage

---

# Tech Stack

## Frontend
- React.js
- Axios
- React Router DOM
- CSS

## Backend
- Node.js
- Express.js
- JWT Authentication
- Multer (Image Uploads)

## Database
- MongoDB
- Mongoose

---

# Project Structure

```bash
lumina/
│
├── server/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── uploads/
│
├── src/
│   ├── components/
│   ├── context/
│   ├── pages/
│   └── services/
│
├── .env
├── package.json
├── server.js
└── vite.config.js
```

---

# Installation and Setup

## Step 1 — Clone Repository

```bash
git clone https://github.com/yourusername/lumina.git
```

---

## Step 2 — Navigate to Project

```bash
cd lumina
```

---

## Step 3 — Install Dependencies

```bash
npm install
```

---

# MongoDB Setup

## Local MongoDB

Install MongoDB Community Server and MongoDB Compass.

Connection URI:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/journalDB
```

---

# Environment Variables

Create a `.env` file in the root directory.

```env
MONGODB_URI=mongodb://127.0.0.1:27017/journalDB
JWT_SECRET=your_secret_key
APP_URL=http://localhost:3000
```

---

# Running the Application

## Start Development Server

```bash
npm run dev
```

Application runs on:

```bash
http://localhost:3000
```

---

# API Endpoints

## Authentication Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/signup | Register User |
| POST | /api/auth/login | Login User |

---

## Journal Routes

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/journals | Fetch Journals |
| POST | /api/journals | Create Journal |
| PUT | /api/journals/:id | Update Journal |
| DELETE | /api/journals/:id | Delete Journal |

---

# Authentication Flow

1. User signs up
2. Password is hashed using bcrypt
3. User logs in
4. JWT token is generated
5. Protected routes verify JWT token

---

# Image Uploads

Lumina supports image uploads for journal entries.

Uploaded files are stored inside:

```bash
/uploads
```

Multer middleware handles image storage and file naming.

---

# Dark Mode / Light Mode

Lumina includes a theme toggle feature.

Features:
- Light Mode
- Dark Mode
- Theme Persistence using localStorage

---

# Deployment

## Frontend + Backend

Deploy on:
- Vercel
- Render

## Database

Use:
- MongoDB Atlas

---

# Deploying on Vercel

## Build Command

```bash
npm run build
```

## Output Directory

```bash
dist
```

---

# Deploying Backend on Render

Environment Variables:

```env
MONGODB_URI=your_atlas_connection_string
JWT_SECRET=your_secret_key
```

---

# Future Improvements

- Search Journals
- Journal Categories
- Rich Text Editor
- Cloudinary Image Uploads
- Email Verification
- Password Reset
- Notifications
- PWA Support

---

# Screens Included

- Login Page
- Signup Page
- Dashboard
- Journal Editor
- Journal List
- Theme Toggle

---

# Author

Developed by Eman Faris.

---

# License

This project is licensed for educational and portfolio use.

