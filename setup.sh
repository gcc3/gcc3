#!/bin/bash

./pull.sh

npm install

if [ ! -f .env ]; then
  cp .env.example .env
fi

npm run build
