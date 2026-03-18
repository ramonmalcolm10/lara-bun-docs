#!/bin/sh
set -e

php artisan optimize

rm -f /tmp/larabun-docs-bridge.sock /tmp/larabun-docs-bridge.sock.cb

php artisan bun:serve &
BUN_PID=$!

php artisan octane:frankenphp --host=0.0.0.0 --port=8000 &
OCTANE_PID=$!

trap "kill $BUN_PID $OCTANE_PID 2>/dev/null; exit 0" SIGTERM SIGINT

wait -n $BUN_PID $OCTANE_PID
kill $BUN_PID $OCTANE_PID 2>/dev/null
exit 1
