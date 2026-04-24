#!/bin/bash

echo "[1/6] Pulling latest code..."
./pull.sh

echo "[2/6] Installing dependencies..."
npm install

echo "[3/6] Setting up .env..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "  .env created from .env.example"
else
  echo "  .env already exists, skipping."
fi

echo "[4/6] Creating public/notes folder..."
mkdir -p public/notes

echo "[5/6] Building..."
npm run build

echo "[6/6] Create notes folder in public/notes..."
mkdir -p public/notes

echo "Setup complete."
