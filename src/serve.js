require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const { noteListing } = require('./utils/noteUtils');

const app = express();
const port = process.env.PORT || 3000;
const corsOrigin = process.env.CORS_ORIGIN || '*';
const publicDir = path.join(__dirname, '../public');
const notesDir = path.join(publicDir, 'notes');

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', corsOrigin);
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  return next();
});

// Serve the built frontend and static note files from the same server.
app.use(express.static(publicDir));

app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
})

// List categories
app.get('/api/categories', (req, res) => {
  fs.readdir(notesDir, { withFileTypes: true }, (err, entries) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read notes directory' });
    }
    const directories = entries
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
      .map((entry) => entry.name);
    res.json(directories);
  });
})

// List notes
// The notes folder structure can be either:
// note/Note.md
// note/Note.txt, note/.markdown/Note.md, .md build from .txt
app.get('/api/notes/:category', (req, res) => {
  const category = req.params.category;
  const categoryDir = path.resolve(notesDir, category);
  const markdownDir = path.join(categoryDir, '.markdown');
  if (!categoryDir.startsWith(notesDir)) {
    return res.status(400).json({ error: 'Invalid category name' });
  }

  const isDotMarkdownExists = fs.existsSync(markdownDir) && fs.statSync(markdownDir).isDirectory();
  if (isDotMarkdownExists) {
    return res.json(noteListing(markdownDir));
  } else {
    return res.json(noteListing(categoryDir));
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
