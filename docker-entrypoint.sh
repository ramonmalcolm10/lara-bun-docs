#!/bin/sh
set -e

php artisan optimize

rm -f /tmp/larabun-docs-bridge.sock

php artisan bun:serve &
BUN_PID=$!

# Wait for Bun worker, then prerender static pages in background
(sleep 5 && php artisan rsc:prerender --clean) &

php artisan octane:frankenphp --host=0.0.0.0 --port=8000 &
OCTANE_PID=$!

trap "kill $BUN_PID $OCTANE_PID 2>/dev/null; exit 0" SIGTERM SIGINT

wait -n $BUN_PID $OCTANE_PID
kill $BUN_PID $OCTANE_PID 2>/dev/null
exit 1
