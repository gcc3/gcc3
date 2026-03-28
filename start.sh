#!/bin/bash

# Load PORT from .env, default to 3180
PORT=$(grep -E '^PORT=' .env 2>/dev/null | cut -d '=' -f2)
PORT=${PORT:-3180}

if pm2 start ecosystem.config.js; then
  echo "Server started at http://localhost:$PORT"
fi
