#!/usr/bin/env bash

set -euo pipefail

repo_dir="$(cd "$(dirname "$0")" && pwd)"

while IFS= read -r -d '' git_dir; do
  dir="$(dirname "$git_dir")"
  echo "Pushing $dir"
  git -C "$dir" add .
  git -C "$dir" commit -m "Update notes"
  git -C "$dir" push
done < <(find "$repo_dir/public/notes" -name ".git" -type d -print0)
