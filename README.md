<<<<<<< HEAD
# SnipLink---URL-Shortner-with-Analytics
=======
# Sniplink — URL Shortener & Analytics Platform

A production-ready full-stack URL Shortener and Analytics Platform built with **React**, **Node.js (Express)**, and **MongoDB**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-green.svg)

---

## ✨ Features

### Core
- 🔗 **URL Shortening** — Generate unique short codes or custom aliases
- 📊 **Rich Analytics** — Track clicks, devices, browsers, locations, referrers
- 🔐 **JWT Authentication** — Secure registration, login, and per-user data isolation
- 📱 **Responsive UI** — Works beautifully on desktop, tablet, and mobile

### Bonus
- 🎨 **Dark / Light Mode** — Toggle with persistence
- 📷 **QR Code Generation** — Downloadable QR codes for every link
- ⏰ **Link Expiration** — Set expiry dates on URLs
- ✏️ **Edit URLs** — Update destination, alias, or expiration anytime
- 📤 **CSV Bulk Upload** — Import URLs from CSV files
- 📥 **CSV Export** — Download analytics data
- 🌐 **Public Stats Page** — Shareable link statistics
- 🛡️ **Rate Limiting** — Abuse prevention on all endpoints

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Tailwind CSS 3, Recharts, React Router 6 |
| Backend | Node.js, Express 4, Mongoose |
| Database | MongoDB |
| Auth | JWT, bcryptjs |
| Analytics | ua-parser-js, geoip-lite |

---

## 📁 Project Structure

```
├── server/                     # Express API
│   └── src/
│       ├── config/             # DB & env config
│       ├── controllers/        # Route handlers
│       ├── middleware/          # Auth, validation, errors, rate-limit
│       ├── models/             # Mongoose schemas
│       ├── routes/             # Express routes
│       ├── services/           # Analytics service
│       └── utils/              # Helpers (code gen, validators, geoip)
│
└── client/                     # React frontend
    └── src/
        ├── api/                # Axios instance
        ├── components/         # Reusable UI & feature components
        ├── context/            # Auth & Theme contexts
        ├── pages/              # Page components
        └── utils/              # Date formatting, constants
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** (local or [Atlas](https://www.mongodb.com/cloud/atlas))
- **npm** or **yarn**

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd URL
```

### 2. Set Up the Backend

```bash
cd server
npm install

# Copy env file and edit as needed
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Start the server
npm run dev
```

The API will start on `http://localhost:5000`.

### 3. Set Up the Frontend

```bash
cd client
npm install

# Start the dev server
npm run dev
```

The app will open on `http://localhost:5173`.

---

## ⚙️ Environment Variables

Create a `.env` file in the `server/` directory:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Server port |
| `NODE_ENV` | `development` | Environment mode |
| `MONGODB_URI` | `mongodb://localhost:27017/url-shortener` | MongoDB connection string |
| `JWT_SECRET` | — | Secret key for JWT signing (change in production!) |
| `JWT_EXPIRES_IN` | `24h` | Token expiration time |
| `BASE_URL` | `http://localhost:5000` | Base URL for short links |
| `CLIENT_URL` | `http://localhost:5173` | Frontend URL (CORS) |

---

## 📡 API Endpoints

### Auth (`/api/auth`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | No | Create account |
| POST | `/login` | No | Get JWT token |
| GET | `/me` | Yes | Get current user |

### URLs (`/api/urls`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/` | Yes | Create short URL |
| GET | `/` | Yes | List user's URLs |
| PATCH | `/:id` | Yes | Update URL |
| DELETE | `/:id` | Yes | Delete URL |
| POST | `/bulk` | Yes | CSV bulk upload |

### Analytics (`/api/analytics`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/:urlId` | Yes | Get URL analytics |
| GET | `/:urlId/export` | Yes | Export as CSV |

### Other
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/public/:code` | No | Public stats |
| GET | `/:code` | No | Redirect to original URL |
| GET | `/api/health` | No | Health check |

---

## 📊 Database Schema

### Users
```javascript
{
  name: String,          // required
  email: String,         // unique, indexed
  password: String,      // bcrypt hashed
  createdAt: Date,
  updatedAt: Date
}
```

### URLs
```javascript
{
  originalUrl: String,   // validated URL
  shortCode: String,     // unique, indexed (7-char nanoid)
  customAlias: String,   // optional, unique
  user: ObjectId,        // → Users, indexed
  clicks: Number,        // denormalized counter
  isActive: Boolean,
  expiresAt: Date,       // optional
  lastVisitedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Visits
```javascript
{
  url: ObjectId,         // → URLs, indexed
  timestamp: Date,
  ip: String,
  userAgent: String,
  browser: String,       // parsed
  os: String,            // parsed
  device: String,        // desktop/mobile/tablet
  country: String,       // from GeoIP
  city: String,          // from GeoIP
  referrer: String
}
// Index: { url: 1, timestamp: -1 }
```

---

## 🚢 Deployment

### Backend (e.g., Render / Railway)

1. Set environment variables in your deployment platform
2. Set `NODE_ENV=production`
3. Set `MONGODB_URI` to your Atlas connection string
4. Set `BASE_URL` to your production API domain
5. Build command: `npm install`
6. Start command: `npm start`

### Frontend (e.g., Vercel / Netlify)

1. Set the build command: `npm run build`
2. Set the output directory: `dist`
3. Add environment variable: `VITE_BASE_URL=https://your-api-domain.com`
4. Configure rewrites: all routes → `index.html` (SPA)

---

## 📄 License

MIT © 2024
>>>>>>> 8ec4d54 (Initial commit)
