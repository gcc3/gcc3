const fs = require('fs');
const path = require('path');

const loadNoterc = (notercPath) => {
  const noterc = {
    retrieveOrder: 'asc',
  };
  if (!fs.existsSync(notercPath) || !fs.statSync(notercPath).isFile()) {
    return noterc;
  }

  try {
    const notercContent = fs.readFileSync(notercPath, 'utf-8');
    const lines = notercContent.split('\n');
    for (const line of lines) {
      const [key, value] = line.split('=').map(part => part.trim());
      if (key === 'retrieveOrder' && (value === 'asc' || value === 'desc')) {
        noterc.retrieveOrder = value;
      }
    }
  } catch (err) {
    console.error('Failed to read or parse .noterc:', err);
  }
  return noterc;
};

const noteListing = (dirPath) => {
  const noterc = loadNoterc(path.join(dirPath, '.noterc'));
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && path.extname(entry.name).toLowerCase() === '.md')
    .map((entry) => entry.name)
    .sort((a, b) => noterc.retrieveOrder === 'asc' ? a.localeCompare(b) : b.localeCompare(a));
};

module.exports = {
  loadNoterc,
  noteListing,
};
