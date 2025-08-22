// server.js
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const FormData = require('form-data');
const cors = require('cors');
const path = require('path');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Allow local dev from the same machine
app.use(cors());
// Serve static frontend files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Proxy to remove.bg so your API key stays private
app.post('/api/removebg', upload.single('image_file'), async (req, res) => {
  try {
    if (!process.env.REMOVEBG_KEY) {
      return res.status(500).json({ error: 'Missing REMOVEBG_KEY in .env file' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No image_file uploaded' });
    }

    const form = new FormData();
    form.append('image_file', req.file.buffer, req.file.originalname);
    form.append('size', 'auto'); // let remove.bg choose the best size
    // You could also append 'bg_color' or 'bg_image_url' etc. per API docs

    const apiRes = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: { 'X-Api-Key': process.env.REMOVEBG_KEY },
      body: form
    });

    if (!apiRes.ok) {
      const txt = await apiRes.text();
      return res.status(apiRes.status).send(txt);
    }

    const buffer = await apiRes.buffer();
    res.type('image/png').send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', details: String(err) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
