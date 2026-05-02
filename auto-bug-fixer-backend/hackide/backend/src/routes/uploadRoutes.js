const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');
const { uploadAndAnalyze } = require('../controllers/uploadController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, config.upload.dir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: config.upload.maxSizeMB * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    // Allow any text-based file; language detection happens in controller
    cb(null, true);
  },
});

// POST /api/upload/file  — upload a source file and get full analysis
router.post('/file', upload.single('file'), uploadAndAnalyze);

module.exports = router;
