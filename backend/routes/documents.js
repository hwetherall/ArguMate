const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const parsePDF = require('../utils/parsePDF');

// Configure multer for file upload
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.csv'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and CSV files are allowed.'));
    }
  }
});

if (!global.uploadedDocuments) {
  global.uploadedDocuments = {};
}

router.post('/upload', upload.single('document'), async (req, res) => {
  console.log('Received upload request');
  console.log('File details:', req.file);
  
  try {
    if (!req.file) {
      console.log('No file in request');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let fileContent;
    const ext = path.extname(req.file.originalname).toLowerCase();
    console.log('Processing file with extension:', ext);
    
    if (ext === '.pdf') {
      fileContent = await parsePDF(req.file.path);
    } else if (ext === '.csv') {
      fileContent = await fs.readFile(req.file.path, 'utf-8');
    }

    // Store the document content in memory
    const documentId = req.file.filename;
    global.uploadedDocuments[documentId] = {
      name: req.file.originalname,
      content: fileContent
    };

    // Clean up the uploaded file
    await fs.unlink(req.file.path);

    res.json({
      id: documentId,
      name: req.file.originalname,
      content: fileContent
    });

  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
