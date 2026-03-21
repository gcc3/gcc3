require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

// Ping
app.get('/', (req, res) => {
  res.send('gcc3')
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

  if (!categoryDir.startsWith(notesDir)) {
    return res.status(400).json({ error: 'Invalid category name' });
  }
  fs.readdir(categoryDir, { withFileTypes: true }, (err, entries) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.status(404).json({ error: 'Category not found' });
      }
      return res.status(500).json({ error: 'Failed to read category directory' });
    }
    const files = entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b));
    res.json(files);
  });
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
