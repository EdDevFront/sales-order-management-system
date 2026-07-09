#!/bin/bash

# Check if the commit message contains [PATCH], [BREAKING], or [FEATURE]
if echo "$VERCEL_GIT_COMMIT_MESSAGE" | grep -E -q "\[PATCH\]|\[BREAKING\]|\[FEATURE\]"; then
  echo "✅ - Versioning marker found in commit message ($VERCEL_GIT_COMMIT_MESSAGE). Proceeding with build."
  exit 1
else
  echo "🛑 - No versioning marker ([PATCH], [BREAKING], or [FEATURE]) found. Skipping build."
  exit 0
fi
