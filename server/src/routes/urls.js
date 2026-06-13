const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const {
  createUrl,
  getUrls,
  updateUrl,
  deleteUrl,
  bulkUpload,
} = require('../controllers/urlController');

const router = express.Router();

// Configure multer for CSV uploads (in-memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  },
});

// All routes require authentication
router.use(auth);

// POST /api/urls — Create short URL
router.post('/', createUrl);

// GET /api/urls — List user's URLs
router.get('/', getUrls);

// POST /api/urls/bulk — CSV bulk upload
router.post('/bulk', upload.single('file'), bulkUpload);

// PATCH /api/urls/:id — Edit URL
router.patch('/:id', updateUrl);

// DELETE /api/urls/:id — Delete URL
router.delete('/:id', deleteUrl);

module.exports = router;
