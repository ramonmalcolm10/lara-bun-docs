import CodeBlock from './CodeBlock';
import Link from 'lara-bun/Link';

const s = {
  h1: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12 } as const,
  h2: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', marginTop: 48, marginBottom: 12 } as const,
  h3: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 17, fontWeight: 600, marginTop: 32, marginBottom: 8 } as const,
  p: { color: '#d4d4d8', fontSize: 15, lineHeight: 1.8, marginBottom: 16 } as const,
  li: { color: '#d4d4d8', fontSize: 15, lineHeight: 1.8, marginBottom: 6, paddingLeft: 8 } as const,
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

      <h2 style={s.h2}>Auto-Static Detection</h2>
      <p style={s.p}>
        LaraBun detects dynamic pages <strong style={{ color: '#fafafa' }}>at prerender time</strong>, similar to Next.js. When <span style={s.mono}>rsc:prerender</span> runs, it actually renders each page and monitors for dynamic API calls. Pages that use any dynamic API are skipped automatically.
      </p>

      <h3 style={s.h3}>Detected Dynamic APIs</h3>
      <div style={s.box}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: '#fafafa', fontWeight: 600 }}>API</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: '#fafafa', fontWeight: 600 }}>Why Dynamic</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['php()', 'Server-side data (DB, cookies, headers, etc.)'],
              ['fetch()', 'External HTTP requests'],
              ['new Date() / Date.now()', 'Current time — non-deterministic'],
              ['Math.random()', 'Non-deterministic output'],
              ['crypto.randomUUID()', 'Non-deterministic output'],
              ['crypto.getRandomValues()', 'Non-deterministic output'],
            ].map(([api, reason]) => (
              <tr key={api} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '8px 12px', fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace", fontSize: 13, color: '#e4e4e7' }}>{api}</td>
                <td style={{ padding: '8px 12px', color: '#a1a1aa' }}>{reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={s.p}>
        <span style={s.mono}>new Date("2024-01-01")</span> with arguments is <strong style={{ color: '#4ade80' }}>not</strong> flagged — only <span style={s.mono}>new Date()</span> with no arguments (current time) triggers dynamic detection.
      </p>

      <h3 style={s.h3}>Route-Level Overrides</h3>
      <ul style={{ listStyle: 'none' }}>
        <li style={s.li}>• <span style={s.mono}>forceStatic()</span> — ignore dynamic API detection and always write static files. Data from <span style={s.mono}>php()</span>, <span style={s.mono}>fetch()</span>, etc. is baked into the static HTML at prerender time.</li>
        <li style={s.li}>• <span style={s.mono}>forceDynamic()</span> — prevent a page from ever being static, even if it uses no dynamic APIs.</li>
      </ul>
      <CodeBlock language="php" title="route.php">
        {`<?php
use RamonMalcolm\\LaraBun\\Rsc\\PageRoute;

// Force static — php() results baked in at prerender time
return PageRoute::make()->forceStatic();

// Force dynamic — always render per request
return PageRoute::make()->forceDynamic();`}
      </CodeBlock>

      <h2 style={s.h2}>Making Dynamic Pages Static</h2>
      <p style={s.p}>
        To make a page with <span style={s.mono}>[param]</span> segments prerenderable, provide <span style={s.mono}>staticPaths()</span> in the page's <span style={s.mono}>route.php</span>:
      </p>
      <CodeBlock language="php" title="app/docs/[slug]/route.php">
        {`<?php
use RamonMalcolm\\LaraBun\\Rsc\\PageRoute;

return PageRoute::make()
    ->staticPaths(fn () => Post::pluck('slug')->all());`}
      </CodeBlock>
      <p style={s.p}>
        For multi-parameter routes, return an array of associative arrays:
      </p>
      <CodeBlock language="php" title="app/blog/[year]/[slug]/route.php">
        {`<?php
use RamonMalcolm\\LaraBun\\Rsc\\PageRoute;

return PageRoute::make()
    ->staticPaths(fn () => [
        ['year' => '2025', 'slug' => 'hello-world'],
        ['year' => '2025', 'slug' => 'getting-started'],
    ]);`}
      </CodeBlock>

      <h2 style={s.h2}>Pre-render Pages</h2>
      <p style={s.p}>
        Run the <span style={s.mono}>rsc:prerender</span> command to generate static files:
      </p>
      <CodeBlock language="bash">
        {`php artisan rsc:prerender`}
      </CodeBlock>
      <p style={s.p}>
        This starts a Bun worker, renders each page, and writes static files to <span style={s.mono}>storage/framework/rsc-static/</span>. Pages that call dynamic APIs during render are automatically skipped.
      </p>
      <CodeBlock language="bash">
        {`# Clean existing files before regenerating
php artisan rsc:prerender --clean`}
      </CodeBlock>

      <div style={s.box}>
        <div style={{
          fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace",
          fontSize: 13,
          color: '#d4d4d8',
          lineHeight: 2,
        }}>
          <div><span style={{ color: '#a1a1aa' }}>storage/framework/rsc-static/</span></div>
          <div style={{ paddingLeft: 16 }}>index.html</div>
          <div style={{ paddingLeft: 16 }}>index.flight</div>
          <div style={{ paddingLeft: 16 }}>index.meta.json</div>
          <div style={{ paddingLeft: 16 }}><span style={{ color: '#a1a1aa' }}>docs/</span></div>
          <div style={{ paddingLeft: 32 }}>installation.html</div>
          <div style={{ paddingLeft: 32 }}>installation.flight</div>
          <div style={{ paddingLeft: 32 }}>installation.meta.json</div>
          <div style={{ paddingLeft: 32 }}>...</div>
        </div>
      </div>

      <h2 style={s.h2}>Customizing the HTML Shell</h2>
      <p style={s.p}>
        Pre-rendered HTML uses the same <span style={s.mono}>rsc-app.blade.php</span> view as dynamic pages. Publish it to customize fonts, meta tags, and styles:
      </p>
      <CodeBlock language="bash">
        {`php artisan vendor:publish --tag=lara-bun-views`}
      </CodeBlock>
      <p style={s.p}>
        This creates <span style={s.mono}>resources/views/vendor/lara-bun/rsc-app.blade.php</span>. Add your font links, meta tags, and styles in the <span style={s.mono}>{'<head>'}</span> — they'll be included in both streamed and pre-rendered pages:
      </p>
      <CodeBlock language="blade" title="resources/views/vendor/lara-bun/rsc-app.blade.php">
        {`<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $title ?? 'My App' }}</title>
    <meta name="description" content="{{ $description ?? '' }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=...">
    @php($hydrateEntry = collect(glob(public_path('build/rsc/entry.hydrate-*.js')))->first())
    @if ($hydrateEntry)
        <link rel="modulepreload" href="/build/rsc/{{ basename($hydrateEntry) }}">
    @endif
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
        Pass per-page metadata (title, description, Open Graph) using <span style={s.mono}>viewData()</span> in your <span style={s.mono}>route.php</span>. These values are available as Blade variables in the shell:
      </p>
      <CodeBlock language="php" title="app/docs/[slug]/route.php">
        {`<?php
use RamonMalcolm\\LaraBun\\Rsc\\PageRoute;

return PageRoute::make()
    ->staticPaths(fn () => Post::pluck('slug')->all())
    ->viewData(fn (string $slug) => [
        'title' => "Docs: $slug — My App",
        'description' => "Documentation for $slug",
    ]);`}
      </CodeBlock>
      <p style={s.p}>
        Any variable passed via <span style={s.mono}>viewData()</span> is available in the Blade view. Use Blade defaults (<span style={s.mono}>{'{{ $title ?? \'Fallback\' }}'}</span>) for optional metadata. This works identically for both streamed and pre-rendered pages.
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

      <h2 style={s.h2}>Docker Integration</h2>
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
              ['Detection', 'Runtime — no dynamic APIs used', 'Uses php(), fetch(), Date, Math.random, etc.'],
              ['Config', 'None required (auto) or forceStatic()', 'Auto or forceDynamic()'],
              ['Middleware', 'ServeStaticRsc auto-applied', 'Full web stack'],
              ['Session / CSRF', 'No', 'Yes'],
              ['Rendered', 'At prerender time', 'Per request'],
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
