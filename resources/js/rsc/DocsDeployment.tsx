import CodeBlock from './CodeBlock';
import Link from 'lara-bun/Link';

const s = {
  h1: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12 } as const,
  h2: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', marginTop: 48, marginBottom: 12 } as const,
  p: { color: '#d4d4d8', fontSize: 15, lineHeight: 1.8, marginBottom: 16 } as const,
  mono: { fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace", fontSize: 13, background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 4, color: '#e4e4e7' } as const,
  hr: { border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '40px 0' } as const,
  accent: { color: '#f59e0b' } as const,
  box: { background: '#18181b', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: 24, marginBottom: 20 } as const,
};

export default function DocsDeployment() {
  return (
    <div>
      <h1 style={s.h1}>Deployment</h1>
      <p style={s.p}>
        LaraBun needs both PHP and Bun running in production. This guide covers multi-worker setup, process management, Docker, and VPS deployment.
      </p>

      <h2 style={s.h2}>Production Build</h2>
      <p style={s.p}>
        Always build RSC bundles before deploying:
      </p>
      <CodeBlock language="bash">
        {`# Build optimized server + client bundles
bun run build:rsc

# Verify the build output
ls bootstrap/rsc/     # Server bundle + manifests
ls public/build/rsc/  # Browser bundles (hashed filenames)`}
      </CodeBlock>

      <h2 style={s.h2}>Production Environment</h2>
      <CodeBlock language="env" title=".env">
        {`BUN_RSC_ENABLED=true
BUN_BRIDGE_SOCKET=/tmp/my-app-bridge.sock
BUN_WORKERS=4`}
      </CodeBlock>
      <p style={s.p}>
        Scale <span style={s.mono}>BUN_WORKERS</span> to match your CPU cores. Each worker is a separate Bun process with its own socket.
      </p>

      <h2 style={s.h2}>Process Management</h2>
      <p style={s.p}>
        The Bun worker must run alongside your PHP application. Use a process manager to keep it alive.
      </p>

      <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 17, fontWeight: 600, marginTop: 32, marginBottom: 8 }}>
        Supervisor
      </h3>
      <CodeBlock language="ini" title="/etc/supervisor/conf.d/larabun.conf">
        {`[program:larabun]
command=php /var/www/app/artisan bun:serve
directory=/var/www/app
user=www-data
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/larabun.log`}
      </CodeBlock>

      <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 17, fontWeight: 600, marginTop: 32, marginBottom: 8 }}>
        systemd
      </h3>
      <CodeBlock language="ini" title="/etc/systemd/system/larabun.service">
        {`[Unit]
Description=LaraBun Bridge Worker
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/app
ExecStart=/usr/bin/php artisan bun:serve
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target`}
      </CodeBlock>

      <h2 style={s.h2}>Docker</h2>
      <p style={s.p}>
        Run Bun alongside PHP in a multi-stage Docker setup:
      </p>
      <CodeBlock language="dockerfile" title="Dockerfile">
        {`FROM php:8.3-fpm AS php

# ... your PHP setup ...

COPY . /var/www/app
WORKDIR /var/www/app

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash

# Build RSC bundles
RUN ~/.bun/bin/bun run build:rsc

# Start both PHP-FPM and Bun worker
CMD ["sh", "-c", "php artisan bun:serve & php-fpm"]`}
      </CodeBlock>

      <div style={{
        ...s.box,
        borderColor: 'rgba(245,158,11,0.2)',
        background: 'rgba(245,158,11,0.04)',
      }}>
        <p style={{ color: '#f59e0b', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
          Socket path in containers
        </p>
        <p style={{ color: '#a1a1aa', fontSize: 14, lineHeight: 1.7, marginBottom: 0 }}>
          When running PHP and Bun in separate containers, use a shared volume for the Unix socket or switch to a TCP socket path (not yet supported — Unix sockets require shared filesystem access).
        </p>
      </div>

      <h2 style={s.h2}>VPS Deployment</h2>
      <p style={s.p}>
        A typical deploy script:
      </p>
      <CodeBlock language="bash">
        {`#!/bin/bash
set -e

cd /var/www/app

# Pull latest code
git pull origin main

# PHP dependencies
composer install --no-dev --optimize-autoloader

# Build RSC bundles
bun run build:rsc

# Laravel cache
php artisan config:cache
php artisan route:cache

# Restart services
sudo supervisorctl restart larabun
sudo systemctl reload php-fpm`}
      </CodeBlock>

      <h2 style={s.h2}>Health Checks</h2>
      <p style={s.p}>
        The Bun worker accepts <span style={s.mono}>ping</span> messages over the socket. You can verify the worker is running:
      </p>
      <CodeBlock language="php">
        {`// In a health check endpoint or console command
$bridge = app(BunBridge::class);
$bridge->ping(); // Throws if worker is unreachable`}
      </CodeBlock>

      <h2 style={s.h2}>Checklist</h2>
      <div style={s.box}>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {[
            'Run bun run build:rsc before every deploy',
            'Set BUN_WORKERS to match available CPU cores',
            'Use Supervisor or systemd to keep the Bun worker alive',
            'Ensure socket path is writable by the web server user',
            'Cache Laravel config and routes in production',
            'Verify the worker with a health check endpoint',
          ].map((text) => (
            <li key={text} style={{ color: '#a1a1aa', fontSize: 14, lineHeight: 1.8, marginBottom: 4 }}>
              <span style={{ color: '#4ade80', marginRight: 8 }}>✓</span> {text}
            </li>
          ))}
        </ul>
      </div>

      <hr style={s.hr} />
      <p style={s.p}>
        ← Back to <Link href="/docs/static-generation" style={s.accent}>Static Generation</Link>
      </p>
    </div>
  );
}
