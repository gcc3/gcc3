#!/usr/bin/env bash

set -euo pipefail

repo_dir="$(cd "$(dirname "$0")" && pwd)"

git -C "$repo_dir" pull

for dir in "$repo_dir/public"/*/; do
  if [ -d "$dir/.git" ]; then
    echo "Pulling $dir"
    git -C "$dir" pull
  fi
done
