const fs = require('fs');

const KEEP_ALIVE = 60000;

function createRealtimeWatcher(notesDir) {
  const watchClients = new Set();

  // Watch the notes directory recursively and notify all SSE clients
  fs.watch(notesDir, { recursive: true }, (eventType, filename) => {
    if (!filename || filename.startsWith('.')) return;
    const message = "data: " + filename + "\n\n";
    for (const res of watchClients) {
      res.write(message);
    }
  });

  // SSE endpoint — clients subscribe here to receive change notifications
  function sseHandler(req, res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    watchClients.add(res);
    const keepAlive = setInterval(() => {
      res.write(': keep-alive\n\n');
    }, KEEP_ALIVE);

    req.on('close', () => {
      clearInterval(keepAlive);
      watchClients.delete(res);
    });
  }

  return { sseHandler };
}

module.exports = { createRealtimeWatcher };
