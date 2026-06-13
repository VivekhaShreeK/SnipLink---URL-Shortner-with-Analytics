const express = require('express');
const auth = require('../middleware/auth');
const {
  getUrlAnalytics,
  exportAnalytics,
  getPublicStats,
} = require('../controllers/analyticsController');

const router = express.Router();

// Protected analytics routes
router.get('/:urlId', auth, getUrlAnalytics);
router.get('/:urlId/export', auth, exportAnalytics);

module.exports = router;
