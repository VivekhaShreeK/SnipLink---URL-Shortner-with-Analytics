# SnipLink — URL Shortener & Analytics Platform

A production-ready full-stack URL Shortener and Analytics Platform built with **React**, **Node.js (Express)**, and **PostgreSQL**.

---

# 🚀 Project Overview

SnipLink is a modern URL shortening and analytics platform that enables users to create short links, generate QR codes, manage URLs efficiently, and gain detailed insights into link performance through an interactive dashboard.

The platform focuses on usability, analytics, security, and scalability while providing a clean and responsive user experience.

---

# ✨ Features

## Core Features

* 🔗 URL Shortening
* ✏️ Custom Alias Support
* 🔐 JWT Authentication
* 🔑 Google Authentication
* 📱 Responsive Design
* 📊 Analytics Dashboard
* 🔍 Search and Manage URLs

## Advanced Features

* 📷 QR Code Generation & Download
* 🌙 Dark / Light Mode
* ⏰ URL Expiration
* ✏️ Edit Existing URLs
* 📤 CSV Bulk URL Import
* 📥 Analytics CSV Export
* 🌐 Public Statistics Page
* 🛡️ API Rate Limiting
* 📍 Location Analytics
* 💻 Device, Browser, and OS Tracking

---

# 🏗️ Tech Stack

| Layer              | Technology                                 |
| ------------------ | ------------------------------------------ |
| Frontend           | React 18, Vite, Tailwind CSS, React Router |
| Backend            | Node.js, Express.js                        |
| Database           | PostgreSQL                                 |
| Authentication     | JWT, Google OAuth                          |
| Analytics & Charts | Recharts                                   |
| QR Code            | qrcode                                     |
| Deployment         | Netlify, Render                            |

---

# 📋 AI Planning Document

## Problem Statement

Long URLs are difficult to share and provide little visibility into user engagement. Existing URL shortening solutions often lack personalized analytics and advanced link management capabilities.

## Proposed Solution

Build a full-stack URL shortening platform that:

* Generates short URLs instantly
* Supports custom aliases
* Tracks user engagement
* Provides detailed analytics
* Supports QR code generation
* Enables secure user management

## Target Users

* Students
* Developers
* Digital Marketers
* Content Creators
* Small Businesses

---

# 🎯 Feature Documentation

## Authentication

* User Registration
* User Login
* JWT Authentication
* Google Authentication
* Protected Routes

## URL Management

* Create Short URLs
* Custom Aliases
* Edit URLs
* Delete URLs
* URL Expiration Support

## Analytics

* Total Click Tracking
* Browser Analytics
* Device Analytics
* Operating System Analytics
* Location Analytics
* Referrer Analytics

## Additional Features

* QR Code Generation & Download
* CSV Import
* CSV Export
* Public Statistics Sharing
* Dark / Light Theme Toggle

---

# 🏛️ Architecture Diagram

```text
+----------------------+
|    React Frontend    |
| (Netlify Deployment) |
+----------+-----------+
           |
           ▼
+----------------------+
|   Express Backend    |
| (Render Deployment)  |
+----------+-----------+
           |
           ▼
+----------------------+
| Local PostgreSQL DB  |
+----------------------+
```

---

# 📁 Project Structure

```text
SnipLink---URL-Shortner-with-Analytics
│
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── utils/
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   └── utils/
│
└── README.md
```

---

# ⚙️ Setup Instructions

## Prerequisites

* Node.js 18+
* PostgreSQL
* npm

---

## 1. Clone Repository

```bash
git clone https://github.com/VivekhaShreeK/SnipLink---URL-Shortner-with-Analytics.git

cd SnipLink---URL-Shortner-with-Analytics
```

---

## 2. Backend Setup

```bash
cd server

npm install
```

Create a `.env` file inside the server folder:

```env
PORT=5000

DATABASE_URL=postgresql://username:password@localhost:5432/sniplink

JWT_SECRET=your_jwt_secret

JWT_EXPIRES_IN=24h

BASE_URL=http://localhost:5000

CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

---

## 3. Frontend Setup

```bash
cd client

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint           |
| ------ | ------------------ |
| POST   | /api/auth/register |
| POST   | /api/auth/login    |
| POST   | /api/auth/google   |
| GET    | /api/auth/me       |

---

## URL Management

| Method | Endpoint       |
| ------ | -------------- |
| POST   | /api/urls      |
| GET    | /api/urls      |
| PATCH  | /api/urls/:id  |
| DELETE | /api/urls/:id  |
| POST   | /api/urls/bulk |

---

## Analytics

| Method | Endpoint                     |
| ------ | ---------------------------- |
| GET    | /api/analytics/:urlId        |
| GET    | /api/analytics/:urlId/export |

---

## Public Routes

| Method | Endpoint          |
| ------ | ----------------- |
| GET    | /api/public/:code |
| GET    | /:code            |
| GET    | /api/health       |

---

# 🗄️ Database Schema

## Users

```javascript
{
  id: UUID,
  name: String,
  email: String,
  password: String,
  createdAt: Date,
  updatedAt: Date
}
```

## URLs

```javascript
{
  id: UUID,
  originalUrl: String,
  shortCode: String,
  customAlias: String,
  userId: UUID,
  clicks: Number,
  expiresAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Visits

```javascript
{
  id: UUID,
  urlId: UUID,
  ip: String,
  browser: String,
  os: String,
  device: String,
  country: String,
  city: String,
  referrer: String,
  timestamp: Date
}
```

---

# 🚢 Deployment

## Frontend Deployment (Netlify)

Frontend URL:

```text
https://sniplink-url.netlify.app/
```

Build Settings:

```bash
Build Command: npm run build

Publish Directory: dist
```

---

## Backend Deployment (Render)

Backend URL:

```text
https://sniplink-url.onrender.com
```

Build Command:

```bash
npm install
```

Start Command:

```bash
npm start
```

---

# 🌍 Live Application

## Frontend

https://sniplink-url.netlify.app/

## Backend

https://sniplink-url.onrender.com

## GitHub Repository

https://github.com/VivekhaShreeK/SnipLink---URL-Shortner-with-Analytics

---

# 📝 Assumptions Made

1. Users must authenticate before managing URLs.
2. Custom aliases must be unique.
3. Expired URLs cannot be accessed.
4. Analytics are recorded for every successful redirect.
5. Location information is IP-based and may not always be exact.
6. PostgreSQL is used as the primary relational database.
7. Google Authentication requires valid OAuth credentials.

---

# 🤖 AI Development Workflow

This application was developed using AI-assisted development practices.

### Planning Phase

* Defined project requirements
* Designed architecture
* Identified core and advanced features

### Development Phase

* Generated project structure
* Built frontend components
* Developed backend APIs
* Integrated PostgreSQL
* Implemented authentication
* Added analytics tracking
* Developed dashboard visualizations

### Testing Phase

* Verified authentication flow
* Tested URL shortening
* Validated analytics tracking
* Tested responsiveness
* Tested deployment

### Documentation Phase

* Added setup instructions
* Documented architecture
* Listed assumptions
* Included deployment details
* Prepared demonstration material

All AI-generated code was reviewed, modified, tested, and understood before integration.

---

# ✅ Evaluation Checklist

* ✅ Clean and modular JavaScript code
* ✅ Responsive and modern UI
* ✅ AI Planning Documentation
* ✅ Architecture Diagram
* ✅ Setup Instructions
* ✅ Assumptions Documentation
* ✅ Google Authentication
* ✅ QR Code Download
* ✅ CSV Import & Export
* ✅ Analytics Dashboard
* ✅ PostgreSQL Database
* ✅ Netlify Deployment
* ✅ Render Deployment

---

# 👨‍💻 Developer

**Vivekha Shree Karthikeyan**

---

# 📄 License

MIT License

---

### This project is a part of a hackathon run by https://katomaran.com
