import CodeBlock from './CodeBlock';
import Link from 'lara-bun/Link';

const s = {
  h1: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12 } as const,
  h2: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', marginTop: 48, marginBottom: 12 } as const,
  h3: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 17, fontWeight: 600, marginTop: 32, marginBottom: 8 } as const,
  p: { color: '#a1a1aa', fontSize: 15, lineHeight: 1.8, marginBottom: 16 } as const,
  li: { color: '#a1a1aa', fontSize: 15, lineHeight: 1.8, marginBottom: 6, paddingLeft: 8 } as const,
  mono: { fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace", fontSize: 13, background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 4, color: '#e4e4e7' } as const,
  hr: { border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '40px 0' } as const,
  accent: { color: '#f59e0b' } as const,
  box: { background: '#18181b', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: 24, marginBottom: 20 } as const,
};

export default function DocsStaticGeneration() {
  return (
    <div>
      <h1 style={s.h1}>Static Generation (SSG)</h1>
      <p style={s.p}>
        LaraBun can pre-render RSC pages at build time as static HTML and Flight payloads. Static pages are served directly by middleware with zero PHP or Bun overhead per request — no session, no CSRF, no database queries.
      </p>

      <h2 style={s.h2}>How It Works</h2>
      <p style={s.p}>
        Static generation produces three files per page:
      </p>
      <ul style={{ listStyle: 'none' }}>
        <li style={s.li}>• <span style={s.mono}>.html</span> — Full HTML for initial page loads (rendered through your Blade shell)</li>
        <li style={s.li}>• <span style={s.mono}>.flight</span> — The RSC Flight payload for SPA navigations</li>
        <li style={s.li}>• <span style={s.mono}>.meta.json</span> — Client chunk URLs and version info</li>
      </ul>
      <p style={s.p}>
        When a request arrives, the <span style={s.mono}>ServeStaticRsc</span> middleware checks for a pre-rendered file. If found, it serves the file directly. If not, the request falls through to the normal RSC pipeline.
      </p>

      <h2 style={s.h2}>1. Define Static Routes</h2>
      <p style={s.p}>
        Static routes live in a separate route file — <span style={s.mono}>routes/rsc-static.php</span>. The package auto-loads this file and wraps it with the <span style={s.mono}>ServeStaticRsc</span> middleware. No manual middleware configuration is needed.
      </p>
      <CodeBlock language="php" title="routes/rsc-static.php">
        {`<?php

use App\\Http\\Controllers\\DocsController;
use Illuminate\\Support\\Facades\\Route;

// Simple static route
Route::get('/', [DocsController::class, 'landing']);

// Parameterized route — list all values to pre-render
Route::get('/docs/{slug}', [DocsController::class, 'show'])
    ->staticPaths([
        'installation',
        'configuration',
        'how-it-works',
    ]);`}
      </CodeBlock>
      <p style={s.p}>
        Routes in this file are <strong style={{ color: '#fafafa' }}>not</strong> in the <span style={s.mono}>web</span> middleware group. They skip session, CSRF, and cookie handling entirely. For routes that need those features (e.g. dynamic pages with auth), keep them in <span style={s.mono}>routes/web.php</span>.
      </p>

      <h2 style={s.h2}>2. The staticPaths Macro</h2>
      <p style={s.p}>
        For routes with parameters, <span style={s.mono}>staticPaths()</span> tells the pre-renderer which values to generate. Pass a flat array for single-parameter routes:
      </p>
      <CodeBlock language="php">
        {`Route::get('/blog/{slug}', [BlogController::class, 'show'])
    ->staticPaths(['hello-world', 'getting-started', 'tips-and-tricks']);`}
      </CodeBlock>
      <p style={s.p}>
        For multi-parameter routes, pass an array of associative arrays:
      </p>
      <CodeBlock language="php">
        {`Route::get('/blog/{year}/{slug}', [BlogController::class, 'show'])
    ->staticPaths([
        ['year' => '2025', 'slug' => 'hello-world'],
        ['year' => '2025', 'slug' => 'getting-started'],
    ]);`}
      </CodeBlock>

      <h2 style={s.h2}>3. Pre-render Pages</h2>
      <p style={s.p}>
        Run the <span style={s.mono}>rsc:prerender</span> command to generate static files:
      </p>
      <CodeBlock language="bash">
        {`php artisan rsc:prerender`}
      </CodeBlock>
      <p style={s.p}>
        This discovers all routes with the <span style={s.mono}>ServeStaticRsc</span> middleware, starts a temporary Bun worker (if one isn't already running), renders each page, and writes the output to <span style={s.mono}>storage/framework/rsc-static/</span>.
      </p>
      <CodeBlock language="bash">
        {`# Clean existing files before regenerating
php artisan rsc:prerender --clean`}
      </CodeBlock>

      <div style={s.box}>
        <div style={{
          fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace",
          fontSize: 13,
          color: '#a1a1aa',
          lineHeight: 2,
        }}>
          <div><span style={{ color: '#9a9aa2' }}>storage/framework/rsc-static/</span></div>
          <div style={{ paddingLeft: 16 }}>index.html</div>
          <div style={{ paddingLeft: 16 }}>index.flight</div>
          <div style={{ paddingLeft: 16 }}>index.meta.json</div>
          <div style={{ paddingLeft: 16 }}><span style={{ color: '#9a9aa2' }}>docs/</span></div>
          <div style={{ paddingLeft: 32 }}>installation.html</div>
          <div style={{ paddingLeft: 32 }}>installation.flight</div>
          <div style={{ paddingLeft: 32 }}>installation.meta.json</div>
          <div style={{ paddingLeft: 32 }}>...</div>
        </div>
      </div>

      <h2 style={s.h2}>4. Customizing the HTML Shell</h2>
      <p style={s.p}>
        Pre-rendered HTML is rendered through the same <span style={s.mono}>rsc-app.blade.php</span> view used for dynamic pages. Publish it to customize fonts, meta tags, and global styles:
      </p>
      <CodeBlock language="bash">
        {`php artisan vendor:publish --tag=lara-bun-views`}
      </CodeBlock>
      <p style={s.p}>
        This creates <span style={s.mono}>resources/views/vendor/lara-bun/rsc-app.blade.php</span>. Add your font links, meta tags, and styles in the <span style={s.mono}>{'<head>'}</span> — they'll be included in both streamed and pre-rendered pages:
      </p>
      <CodeBlock language="html" title="resources/views/vendor/lara-bun/rsc-app.blade.php">
        {`<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $title ?? 'My App' }}</title>
    <meta name="description" content="{{ $description ?? '' }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=...">
    <style>
        body { background: #09090b; color: #fafafa; }
    </style>
</head>
<body>
    <div id="rsc-root">{!! $body !!}</div>
    <script>window.__RSC_INITIAL__ = {!! $initialJson !!};</script>
    {!! $scripts !!}
</body>
</html>`}
      </CodeBlock>

      <h3 style={s.h3}>Page Metadata</h3>
      <p style={s.p}>
        Pass per-page metadata (title, description, Open Graph, etc.) using <span style={s.mono}>withViewData()</span> on your <span style={s.mono}>RscResponse</span>. These values are available as Blade variables in the shell:
      </p>
      <CodeBlock language="php">
        {`Route::get('/docs/{slug}', function (string $slug) {
    return rsc('Docs' . str($slug)->studly())
        ->layout('DocsLayout')
        ->withViewData('title', 'Installation — My App')
        ->withViewData('description', 'How to install and configure the app');
});`}
      </CodeBlock>
      <p style={s.p}>
        Any variable passed via <span style={s.mono}>withViewData()</span> is available in the Blade view. Use Blade defaults (<span style={s.mono}>{'{{ $title ?? \'Fallback\' }}'}</span>) for optional metadata. This works identically for both streamed and pre-rendered pages.
      </p>

      <div style={{
        ...s.box,
        borderColor: 'rgba(74,222,128,0.2)',
        background: 'rgba(74,222,128,0.04)',
      }}>
        <p style={{ color: '#4ade80', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
          Fonts and styles belong here, not in layout components
        </p>
        <p style={{ color: '#a1a1aa', fontSize: 14, lineHeight: 1.7, marginBottom: 0 }}>
          Placing font <span style={s.mono}>{'<link>'}</span> tags and global CSS in the Blade view ensures they load once and persist across SPA navigations. If you put them in React layout components, React will re-inject them on every navigation.
        </p>
      </div>

      <h2 style={s.h2}>5. Docker Integration</h2>
      <p style={s.p}>
        Pre-render during the Docker build so static files are baked into the image:
      </p>
      <CodeBlock language="dockerfile" title="Dockerfile">
        {`# Build RSC bundles
RUN bun run build:rsc

# Pre-render static pages (needs a dummy APP_KEY for config)
RUN APP_KEY=base64:dummy-key-for-build-only php artisan rsc:prerender

# optimize runs at container start (needs real APP_KEY)
# See docker-entrypoint.sh`}
      </CodeBlock>
      <p style={s.p}>
        Keep <span style={s.mono}>php artisan optimize</span> in your entrypoint script where runtime environment variables are available — not in the Dockerfile build step.
      </p>

      <h2 style={s.h2}>Configuration</h2>
      <p style={s.p}>
        Customize the static files output path in <span style={s.mono}>config/bun.php</span>:
      </p>
      <CodeBlock language="php" title="config/bun.php">
        {`'rsc' => [
    // ...
    'static_path' => env('BUN_RSC_STATIC_PATH', storage_path('framework/rsc-static')),
],`}
      </CodeBlock>

      <h2 style={s.h2}>Static vs Dynamic</h2>
      <div style={s.box}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: '#fafafa', fontWeight: 600 }}></th>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: '#fafafa', fontWeight: 600 }}>Static</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: '#fafafa', fontWeight: 600 }}>Dynamic</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Route file', 'routes/rsc-static.php', 'routes/web.php'],
              ['Middleware', 'ServeStaticRsc only', 'Full web stack'],
              ['Session / CSRF', 'No', 'Yes'],
              ['Rendered', 'At build time', 'Per request'],
              ['Suspense', 'Fully resolved', 'Streamed progressively'],
            ].map(([label, stat, dyn]) => (
              <tr key={label} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '8px 12px', color: '#a1a1aa', fontWeight: 500 }}>{label}</td>
                <td style={{ padding: '8px 12px', color: '#a1a1aa' }}>{stat}</td>
                <td style={{ padding: '8px 12px', color: '#a1a1aa' }}>{dyn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr style={s.hr} />
      <p style={s.p}>
        Next: <Link href="/docs/deployment" style={s.accent}>Deployment →</Link>
      </p>
    </div>
  );
}
