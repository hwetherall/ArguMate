const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const parsePDF = require('../utils/parsePDF');
const parseCSV = require('../utils/parseCSV');

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), async (req, res) => {
  const { file } = req;
  if (!file) return res.status(400).send('No file uploaded');

  try {
    let textContent = '';
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.pdf') {
      textContent = await parsePDF(file.path);
    } else if (ext === '.csv') {
      textContent = await parseCSV(file.path);
    } else {
      return res.status(400).send('Unsupported file type');
    }

    // For MVP: store in memory? For now, just return the text
    res.json({ textContent });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing file');
  }
});

module.exports = router;
