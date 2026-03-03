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
  table: { width: '100%', borderCollapse: 'collapse' as const, marginBottom: 20 },
  th: { textAlign: 'left' as const, padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 13, fontWeight: 600, color: '#fafafa', fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace" },
  td: { padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 14, color: '#a1a1aa' },
};

export default function DocsRsc() {
  return (
    <div>
      <h1 style={s.h1}>React Server Components</h1>
      <p style={s.p}>
        LaraBun brings full React Server Components to Laravel with file-based routing. Write server components that render on Bun, stream HTML to the browser, and hydrate into a full SPA — with zero manual route configuration.
      </p>

      <h2 style={s.h2}>File-Based Routing</h2>
      <p style={s.p}>
        Place your components in <span style={s.mono}>resources/js/rsc/app/</span>. Pages and layouts are auto-discovered using Next.js App Router conventions:
      </p>
      <div style={s.box}>
        <div style={{
          fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace",
          fontSize: 13,
          color: '#a1a1aa',
          lineHeight: 2.2,
        }}>
          <div><span style={{ color: '#9a9aa2' }}>resources/js/rsc/app/</span></div>
          <div style={{ paddingLeft: 16 }}>layout.tsx <span style={{ color: '#f59e0b' }}>→ root layout (wraps all pages)</span></div>
          <div style={{ paddingLeft: 16 }}>page.tsx <span style={{ color: '#f59e0b' }}>→ GET /</span></div>
          <div style={{ paddingLeft: 16 }}><span style={{ color: '#9a9aa2' }}>about/</span></div>
          <div style={{ paddingLeft: 32 }}>page.tsx <span style={{ color: '#f59e0b' }}>→ GET /about</span></div>
          <div style={{ paddingLeft: 16 }}><span style={{ color: '#9a9aa2' }}>docs/</span></div>
          <div style={{ paddingLeft: 32 }}>layout.tsx <span style={{ color: '#f59e0b' }}>→ nested layout for /docs/*</span></div>
          <div style={{ paddingLeft: 32 }}>page.tsx <span style={{ color: '#f59e0b' }}>→ GET /docs</span></div>
          <div style={{ paddingLeft: 32 }}>sidebar.tsx <span style={{ color: '#71717a' }}>→ colocated component (NOT a route)</span></div>
          <div style={{ paddingLeft: 32 }}><span style={{ color: '#9a9aa2' }}>[slug]/</span></div>
          <div style={{ paddingLeft: 48 }}>page.tsx <span style={{ color: '#f59e0b' }}>→ GET /docs/{'{slug}'}</span></div>
          <div style={{ paddingLeft: 48 }}>route.php <span style={{ color: '#71717a' }}>→ middleware, staticPaths</span></div>
        </div>
      </div>

      <h3 style={s.h3}>Special files</h3>
      <ul style={{ listStyle: 'none' }}>
        <li style={s.li}>• <span style={s.mono}>page.tsx</span> — defines a route. Only files named <span style={s.mono}>page.*</span> create routes.</li>
        <li style={s.li}>• <span style={s.mono}>layout.tsx</span> — wraps all pages in the same directory and below. Receives <span style={s.mono}>children</span>.</li>
        <li style={s.li}>• <span style={s.mono}>route.php</span> — optional PHP config for middleware, auth, static paths, and view data.</li>
      </ul>
      <p style={s.p}>
        Everything else in the directory is a colocated component — importable by pages and layouts, but not a route.
      </p>

      <h3 style={s.h3}>Dynamic segments</h3>
      <p style={s.p}>
        Use square brackets for dynamic route parameters: <span style={s.mono}>[slug]</span> maps to <span style={s.mono}>{'{slug}'}</span> in Laravel. Catch-all segments use <span style={s.mono}>[...path]</span>.
      </p>

      <h3 style={s.h3}>Route groups</h3>
      <p style={s.p}>
        Parenthesized directories like <span style={s.mono}>(marketing)</span> create route groups — they organize files without adding a URL segment. <span style={s.mono}>app/(marketing)/pricing/page.tsx</span> maps to <span style={s.mono}>GET /pricing</span>.
      </p>

      <h3 style={s.h3}>Domain routing</h3>
      <p style={s.p}>
        Prefix a directory with <span style={s.mono}>@</span> for domain-specific routes: <span style={s.mono}>app/@admin.example.com/page.tsx</span> maps to <span style={s.mono}>GET /</span> on <span style={s.mono}>admin.example.com</span>.
      </p>

      <h2 style={s.h2}>Route Configuration (route.php)</h2>
      <p style={s.p}>
        Add a <span style={s.mono}>route.php</span> file alongside a <span style={s.mono}>page.tsx</span> (or in a parent directory) to configure middleware, authorization, static paths, and view data:
      </p>
      <CodeBlock language="php" title="app/docs/route.php — applies to all routes in /docs/*">
        {`<?php
use RamonMalcolm\\LaraBun\\Rsc\\PageRoute;

return PageRoute::make()
    ->middleware(['auth', 'verified']);`}
      </CodeBlock>
      <CodeBlock language="php" title="app/docs/[slug]/route.php — applies to this route only">
        {`<?php
use RamonMalcolm\\LaraBun\\Rsc\\PageRoute;

return PageRoute::make()
    ->staticPaths(fn () => Post::pluck('slug')->all())
    ->viewData(fn (string $slug) => ['title' => "Docs: $slug"]);`}
      </CodeBlock>
      <p style={s.p}>
        Available methods: <span style={s.mono}>middleware()</span>, <span style={s.mono}>can()</span>, <span style={s.mono}>staticPaths()</span>, <span style={s.mono}>viewData()</span>, <span style={s.mono}>name()</span>, <span style={s.mono}>where()</span>.
      </p>

      <h2 style={s.h2}>Auto-Static Detection</h2>
      <p style={s.p}>
        Pages <strong style={{ color: '#fafafa' }}>without</strong> dynamic segments (e.g., <span style={s.mono}>app/about/page.tsx</span>) are automatically static — the <span style={s.mono}>ServeStaticRsc</span> middleware is applied and <span style={s.mono}>rsc:prerender</span> picks them up with no extra config. Pages <strong style={{ color: '#fafafa' }}>with</strong> <span style={s.mono}>[param]</span> segments are dynamic by default; provide <span style={s.mono}>staticPaths()</span> in <span style={s.mono}>route.php</span> to make them prerenderable.
      </p>

      <h2 style={s.h2}>Server Components</h2>
      <p style={s.p}>
        Server components are the default. Any <span style={s.mono}>.tsx</span> file without a <span style={s.mono}>"use client"</span> directive is a server component. They can be async and fetch data directly:
      </p>
      <CodeBlock language="tsx" title="resources/js/rsc/app/page.tsx">
        {`export default async function Home() {
  const posts = await php('PostCallable.latest');

  return (
    <div>
      <h1>Latest Posts</h1>
      {posts.map(p => <p key={p.id}>{p.title}</p>)}
    </div>
  );
}`}
      </CodeBlock>

      <h2 style={s.h2}>Client Components</h2>
      <p style={s.p}>
        Add <span style={s.mono}>"use client";</span> as the first line to mark a component as a client component. These are hydrated in the browser and can use hooks, event handlers, and browser APIs.
      </p>
      <CodeBlock language="tsx" title="resources/js/rsc/Counter.tsx">
        {`"use client";

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}`}
      </CodeBlock>
      <p style={s.p}>
        Server components can import and render client components. The build script automatically creates client module proxies for the Flight protocol.
      </p>

      <h2 style={s.h2}>Navigation</h2>
      <p style={s.p}>
        Use the <span style={s.mono}>Link</span> component for SPA navigation between pages. It intercepts clicks, fetches the Flight payload, and updates the React tree without a full reload.
      </p>
      <CodeBlock language="tsx">
        {`import Link from 'lara-bun/Link';

<Link href="/docs/installation">Docs</Link>

// Prefetch on hover (default)
<Link href="/settings" prefetch="hover">Settings</Link>

// Prefetch on mount
<Link href="/dashboard" prefetch="mount">Dashboard</Link>

// Keep scroll position after navigation
<Link href="/docs/rsc" preserveScroll>Stay here</Link>`}
      </CodeBlock>

      <h3 style={s.h3}>Link Props</h3>
      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Prop</th>
            <th style={s.th}>Type</th>
            <th style={s.th}>Default</th>
            <th style={s.th}>Description</th>
          </tr>
        </thead>
        <tbody>
          {([
            ['href', 'string', '—', 'Target URL'],
            ['prefetch', '"hover" | "mount" | "click" | "none"', '"hover"', 'When to prefetch'],
            ['cacheFor', 'number', '30000', 'Prefetch cache TTL (ms)'],
            ['replace', 'boolean', 'false', 'Replace history entry'],
            ['preserveScroll', 'boolean', 'false', 'Keep scroll position'],
          ] as const).map(([prop, type, def, desc]) => (
            <tr key={prop}>
              <td style={{ ...s.td, fontFamily: "ui-monospace, 'Fira Code', monospace", fontSize: 13, color: '#e4e4e7' }}>{prop}</td>
              <td style={{ ...s.td, fontFamily: "ui-monospace, 'Fira Code', monospace", fontSize: 12, color: '#9a9aa2' }}>{type}</td>
              <td style={{ ...s.td, fontFamily: "ui-monospace, 'Fira Code', monospace", fontSize: 13 }}>{def}</td>
              <td style={s.td}>{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={s.p}>
        By default, navigation scrolls to the top of the page. Use <span style={s.mono}>preserveScroll</span> to opt out. You can also navigate programmatically:
      </p>
      <CodeBlock language="ts">
        {`// Programmatic navigation
window.__rsc_navigate('/about');
window.__rsc_navigate('/settings', { preserveScroll: true });

// Prefetch a route
window.__rsc_prefetch('/dashboard');`}
      </CodeBlock>

      <h2 style={s.h2}>Streaming</h2>
      <p style={s.p}>
        On initial page loads, LaraBun streams HTML progressively. React renders the shell (including Suspense fallbacks) immediately. As async content resolves, React injects completion scripts that swap in the real content.
      </p>
      <p style={s.p}>
        For SPA navigations, the raw Flight payload streams to the browser via <span style={s.mono}>createFromReadableStream()</span> for progressive React reconciliation.
      </p>

      <h2 style={s.h2}>Diagnostic Command</h2>
      <p style={s.p}>
        Use <span style={s.mono}>rsc:pages</span> to see all discovered routes:
      </p>
      <CodeBlock language="bash">
        {`php artisan rsc:pages`}
      </CodeBlock>
      <p style={s.p}>
        Shows a table of all routes with their URL, component, layouts, type (static/dynamic), middleware, and domain.
      </p>

      <hr style={s.hr} />
      <p style={s.p}>
        Next: <Link href="/docs/php-callables" style={s.accent}>PHP Callables →</Link>
      </p>
    </div>
  );
}
