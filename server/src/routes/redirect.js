const express = require('express');
const { redirectUrl } = require('../controllers/urlController');
const { redirectLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// GET /:code — Redirect to original URL
router.get('/:code', redirectLimiter, redirectUrl);

module.exports = router;
