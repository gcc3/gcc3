const chokidar = require('chokidar');

function createRealtimeWatcher(notesDir) {
  const watchClients = new Set();

  const watcher = chokidar.watch(notesDir, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    ignoreInitial: true,
  });

  watcher.on('all', (event, fullPath) => {
    const relative = require('path').relative(notesDir, fullPath);
    const message = "data: " + relative + "\n\n";
    for (const res of watchClients) {
      res.write(message);
    }
  });

  // SSE endpoint — clients subscribe here to receive change notifications
  function sseHandler(req, res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    watchClients.add(res);
    req.on('close', () => {
      watchClients.delete(res);
    });
  }

  return { sseHandler };
}

module.exports = { createRealtimeWatcher };
