require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
const corsOrigin = process.env.CORS_ORIGIN || '*';

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

// Serve static files
app.use('/notes', express.static(path.join(__dirname, '../public/notes')));

// Ping
app.get('/', (req, res) => {
  res.send('dead');
})

// List categories
app.get('/api/categories', (req, res) => {
  const notesDir = path.join(__dirname, '../public/notes');
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
app.get('/api/notes/:category_name', (req, res) => {
  const notesDir = path.join(__dirname, '../public/notes');
  const categoryName = req.params.category_name;
  const categoryDir = path.resolve(notesDir, categoryName);
  const markdownDir = path.join(categoryDir, '.markdown');

  if (!categoryDir.startsWith(notesDir)) {
    return res.status(400).json({ error: 'Invalid category name' });
  }

  fs.readdir(markdownDir, { withFileTypes: true }, (markdownErr, markdownEntries) => {
    if (!markdownErr) {
      const markdownFiles = markdownEntries
        .filter((entry) => entry.isFile() && path.extname(entry.name).toLowerCase() === '.md')
        .map((entry) => path.posix.join('.markdown', entry.name))
        .sort((a, b) => a.localeCompare(b));
      return res.json(markdownFiles);
    }

    if (markdownErr.code !== 'ENOENT') {
      return res.status(500).json({ error: 'Failed to read .markdown directory' });
    }

    fs.readdir(categoryDir, { withFileTypes: true }, (err, entries) => {
      if (err) {
        if (err.code === 'ENOENT') {
          return res.status(404).json({ error: 'Category not found' });
        }
        return res.status(500).json({ error: 'Failed to read category directory' });
      }
      const files = entries
        .filter((entry) => entry.isFile() && path.extname(entry.name).toLowerCase() === '.md')
        .map((entry) => entry.name)
        .sort((a, b) => a.localeCompare(b));
      res.json(files);
    });
  });
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
