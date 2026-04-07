#!/usr/bin/env bash

set -euo pipefail

repo_dir="$(cd "$(dirname "$0")" && pwd)"

push_script="$repo_dir/public/notes/push.sh"

if [[ ! -f "$push_script" ]]; then
  echo "Warning: $push_script not found." >&2
  exit 1
fi

bash "$push_script"
