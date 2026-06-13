const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB } = require('./config/db');
const { PORT, CLIENT_URL } = require('./config/env');
const { apiLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const urlRoutes = require('./routes/urls');
const analyticsRoutes = require('./routes/analytics');
const redirectRoutes = require('./routes/redirect');
const { getPublicStats } = require('./controllers/analyticsController');

const app = express();

// ─── Security & Parsing Middleware ──────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Trust proxy for rate limiting behind reverse proxies
app.set('trust proxy', 1);

// ─── Rate Limiting ──────────────────────────────────────────────────
app.use('/api/', apiLimiter);

// ─── Health Check ───────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date() });
});

// ─── API Routes ─────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);
app.use('/api/analytics', analyticsRoutes);
app.get('/api/public/:code', getPublicStats);

// ─── Redirect Route (must be LAST — catches /:code) ────────────────
app.use('/', redirectRoutes);

// ─── Error Handler ──────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ───────────────────────────────────────────────────
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════╗
║   🚀 URL Shortener API running on port ${PORT}      ║
║   📝 Environment: ${process.env.NODE_ENV || 'development'}               ║
╚══════════════════════════════════════════════════╝
    `);
  });
};

startServer();

module.exports = app;
