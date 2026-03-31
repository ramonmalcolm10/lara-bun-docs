import CodeBlock from './CodeBlock';
import Link from 'lara-bun/Link';

const s = {
  h1: { fontFamily: "system-ui, -apple-system, sans-serif", fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12 } as const,
  h2: { fontFamily: "system-ui, -apple-system, sans-serif", fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', marginTop: 48, marginBottom: 12 } as const,
  h3: { fontFamily: "system-ui, -apple-system, sans-serif", fontSize: 17, fontWeight: 600, marginTop: 32, marginBottom: 8 } as const,
  p: { color: '#d4d4d8', fontSize: 15, lineHeight: 1.8, marginBottom: 16 } as const,
  li: { color: '#d4d4d8', fontSize: 15, lineHeight: 1.8, marginBottom: 6, paddingLeft: 8 } as const,
  mono: { fontFamily: "ui-monospace, 'SFMono-Regular', monospace", fontSize: 13, background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 4, color: '#e4e4e7' } as const,
  hr: { border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '40px 0' } as const,
  accent: { color: '#f59e0b' } as const,
  box: { background: '#18181b', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: 24, marginBottom: 20 } as const,
  table: { width: '100%', borderCollapse: 'collapse' as const, marginBottom: 20 },
  th: { textAlign: 'left' as const, padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 13, fontWeight: 600, color: '#fafafa', fontFamily: "ui-monospace, 'SFMono-Regular', monospace" },
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
          fontFamily: "ui-monospace, 'SFMono-Regular', monospace",
          fontSize: 13,
          color: '#a1a1aa',
          lineHeight: 2.2,
        }}>
          <div><span style={{ color: '#9a9aa2' }}>resources/js/rsc/app/</span></div>
          <div style={{ paddingLeft: 16 }}>layout.tsx <span style={{ color: '#f59e0b' }}>→ root layout (wraps all pages)</span></div>
          <div style={{ paddingLeft: 16 }}>loading.tsx <span style={{ color: '#f59e0b' }}>→ Suspense fallback for all pages</span></div>
          <div style={{ paddingLeft: 16 }}>page.tsx <span style={{ color: '#f59e0b' }}>→ GET /</span></div>
          <div style={{ paddingLeft: 16 }}><span style={{ color: '#9a9aa2' }}>@sidebar/</span></div>
          <div style={{ paddingLeft: 32 }}>page.tsx <span style={{ color: '#a78bfa' }}>→ parallel slot "sidebar"</span></div>
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
        <li style={s.li}>• <span style={s.mono}>loading.tsx</span> — Suspense fallback. Auto-wraps pages in <span style={s.mono}>{`<Suspense>`}</span>. Hierarchical — nearest to the page wins.</li>
        <li style={s.li}>• <span style={s.mono}>default.tsx</span> — default content for a parallel slot when no matching page exists.</li>
        <li style={s.li}>• <span style={s.mono}>route.php</span> — optional PHP config for middleware, auth, static paths, and view data.</li>
        <li style={s.li}>• <span style={s.mono}>@folder/</span> — parallel route slot. Rendered as a named prop on the nearest layout. No URL segment.</li>
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

      <h2 style={s.h2}>Route Configuration (route.php)</h2>
      <p style={s.p}>
        Add a <span style={s.mono}>route.php</span> file alongside a <span style={s.mono}>page.tsx</span> (or in a parent directory) to configure middleware, authorization, static paths, and view data:
      </p>
      <CodeBlock language="php" title="app/docs/route.php — applies to all routes in /docs/*">
        {`<?php
use LaraBun\\Rsc\\PageRoute;

return PageRoute::make()
    ->middleware(['auth', 'verified']);`}
      </CodeBlock>
      <CodeBlock language="php" title="app/docs/[slug]/route.php — applies to this route only">
        {`<?php
use LaraBun\\Rsc\\PageRoute;

return PageRoute::make()
    ->staticPaths(fn () => Post::pluck('slug')->all())
    ->viewData(fn (string $slug) => ['title' => "Docs: $slug"]);`}
      </CodeBlock>
      <p style={s.p}>
        Available methods: <span style={s.mono}>middleware()</span>, <span style={s.mono}>can()</span>, <span style={s.mono}>staticPaths()</span>, <span style={s.mono}>viewData()</span>, <span style={s.mono}>props()</span>, <span style={s.mono}>name()</span>, <span style={s.mono}>where()</span>, <span style={s.mono}>domain()</span>, <span style={s.mono}>forceDynamic()</span>, <span style={s.mono}>forceStatic()</span>.
      </p>

      <h2 style={s.h2}>Passing Data to Pages</h2>
      <p style={s.p}>
        There are two ways to pass server-side data to your page components:
      </p>

      <h3 style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: 17, fontWeight: 600, marginTop: 32, marginBottom: 8 }}>1. Using php() in Server Components</h3>
      <p style={s.p}>
        Server components can call <span style={s.mono}>php()</span> directly to fetch data during rendering. This is the RSC-native approach — data fetching lives in the component:
      </p>
      <CodeBlock language="tsx" title="app/dashboard/page.tsx">
        {`export default async function DashboardPage() {
  const stats = await php<{ revenue: number; orders: number }>('Dashboard.stats');

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Revenue: \${stats.revenue}</p>
      <p>Orders: {stats.orders}</p>
    </div>
  );
}`}
      </CodeBlock>

      <h3 style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: 17, fontWeight: 600, marginTop: 32, marginBottom: 8 }}>2. Using props() in route.php</h3>
      <p style={s.p}>
        Use <span style={s.mono}>props()</span> to pass data from PHP to your page component via <span style={s.mono}>route.php</span>. This is useful when you need Laravel-specific data like session state, auth info, or redirects:
      </p>
      <CodeBlock language="php" title="app/login/route.php">
        {`<?php
use LaraBun\\Rsc\\PageRoute;

return PageRoute::make()
    ->middleware(['guest'])
    ->name('login')
    ->props(fn () => [
        'intended_url' => redirect()->intended(route('dashboard'))->getTargetUrl(),
        'last_login_method' => LastLogin::get(),
    ]);`}
      </CodeBlock>
      <CodeBlock language="tsx" title="app/login/page.tsx">
        {`export default function LoginPage({ intended_url, last_login_method }: {
  intended_url: string;
  last_login_method: string;
}) {
  return <LoginForm intendedUrl={intended_url} lastLoginMethod={last_login_method} />;
}`}
      </CodeBlock>
      <p style={s.p}>
        <span style={s.mono}>props()</span> accepts a static array or a closure. Static arrays are safe for prerendering. Closures make the page dynamic — a <span style={s.mono}>loading.tsx</span> is required for PPR.
      </p>

      <h3 style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: 17, fontWeight: 600, marginTop: 32, marginBottom: 8 }}>props() vs viewData()</h3>
      <div style={s.box}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 13, fontWeight: 600, color: '#fafafa', fontFamily: "ui-monospace, 'SFMono-Regular', monospace" }}>Method</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 13, fontWeight: 600, color: '#fafafa' }}>Goes to</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 13, fontWeight: 600, color: '#fafafa' }}>Use for</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13, color: '#f59e0b', fontFamily: "ui-monospace, 'SFMono-Regular', monospace" }}>props()</td>
              <td style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 14, color: '#a1a1aa' }}>React component</td>
              <td style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 14, color: '#a1a1aa' }}>Data the component needs to render</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 12px', fontSize: 13, color: '#f59e0b', fontFamily: "ui-monospace, 'SFMono-Regular', monospace" }}>viewData()</td>
              <td style={{ padding: '8px 12px', fontSize: 14, color: '#a1a1aa' }}>Blade view only</td>
              <td style={{ padding: '8px 12px', fontSize: 14, color: '#a1a1aa' }}>Page title, meta tags, og:image</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 style={s.h2}>Auto-Static Detection</h2>
      <p style={s.p}>
        LaraBun detects dynamic pages <strong style={{ color: '#fafafa' }}>at prerender time</strong>, similar to Next.js. When <span style={s.mono}>rsc:prerender</span> runs, it renders each page and monitors for dynamic API usage. If any are called, the page is skipped and left as dynamic.
      </p>
      <p style={s.p}>
        <strong style={{ color: '#fafafa' }}>Detected dynamic APIs:</strong>
      </p>
      <ul style={{ listStyle: 'none' }}>
        <li style={s.li}>• <span style={s.mono}>php()</span> — any PHP callable (DB queries, cookies, headers, etc.)</li>
        <li style={s.li}>• <span style={s.mono}>fetch()</span> — external HTTP requests</li>
        <li style={s.li}>• <span style={s.mono}>new Date()</span> / <span style={s.mono}>Date.now()</span> — current time</li>
        <li style={s.li}>• <span style={s.mono}>Math.random()</span> — non-deterministic output</li>
        <li style={s.li}>• <span style={s.mono}>crypto.randomUUID()</span> / <span style={s.mono}>crypto.getRandomValues()</span> — non-deterministic output</li>
      </ul>
      <p style={s.p}>
        Pages without dynamic segments that don't call any of these APIs are automatically static — <span style={s.mono}>ServeStaticRsc</span> middleware is applied and <span style={s.mono}>rsc:prerender</span> generates static files with no config needed.
      </p>
      <p style={s.p}>
        Use <span style={s.mono}>forceStatic()</span> in <span style={s.mono}>route.php</span> to override detection and make a page static regardless (dynamic API results baked in at prerender time). Use <span style={s.mono}>forceDynamic()</span> for pages that should never be static (e.g., async Suspense demos).
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
              <td style={{ ...s.td, fontFamily: "ui-monospace, 'SFMono-Regular', monospace", fontSize: 13, color: '#e4e4e7' }}>{prop}</td>
              <td style={{ ...s.td, fontFamily: "ui-monospace, 'SFMono-Regular', monospace", fontSize: 12, color: '#9a9aa2' }}>{type}</td>
              <td style={{ ...s.td, fontFamily: "ui-monospace, 'SFMono-Regular', monospace", fontSize: 13 }}>{def}</td>
              <td style={s.td}>{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={s.p}>
        By default, navigation scrolls to the top of the page. Use <span style={s.mono}>preserveScroll</span> to opt out.
      </p>

      <h3 style={s.h3}>Programmatic Navigation</h3>
      <p style={s.p}>
        Use <span style={s.mono}>visit()</span> and <span style={s.mono}>prefetch()</span> from <span style={s.mono}>lara-bun/router</span> for programmatic navigation in client components:
      </p>
      <CodeBlock language="tsx">
        {`"use client";
import { visit, prefetch } from "lara-bun/router";

// Navigate to a page
await visit('/about');

// Replace history entry (no back button)
await visit('/dashboard', { replace: true });

// Prefetch a route for instant navigation later
prefetch('/settings');`}
      </CodeBlock>
      <p style={s.p}>
        You can also use the default export:
      </p>
      <CodeBlock language="tsx">
        {`import router from "lara-bun/router";

router.visit('/about');
router.prefetch('/settings');`}
      </CodeBlock>

      <h3 style={s.h3}>Link Loading State</h3>
      <p style={s.p}>
        Each Link adds a <span style={s.mono}>data-pending</span> attribute while navigating. Style it with CSS — no JavaScript needed:
      </p>
      <CodeBlock language="css">
        {`/* Dim the link while navigating */
a[data-pending] {
  opacity: 0.5;
  pointer-events: none;
}`}
      </CodeBlock>
      <p style={s.p}>
        For advanced cases (showing a spinner outside the link, changing unrelated UI), use the <span style={s.mono}>useLinkStatus</span> hook. It reads from the nearest parent Link's context:
      </p>
      <CodeBlock language="tsx">
        {`"use client";

import Link from 'lara-bun/Link';
import { useLinkStatus } from 'lara-bun/useLinkStatus';

function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href}>
      <NavContent>{children}</NavContent>
    </Link>
  );
}

function NavContent({ children }: { children: React.ReactNode }) {
  const { pending } = useLinkStatus();
  return (
    <span style={{ opacity: pending ? 0.5 : 1 }}>
      {children}
      {pending && <span className="spinner" />}
    </span>
  );
}`}
      </CodeBlock>

      <h2 style={s.h2}>Parallel Routes</h2>
      <p style={s.p}>
        Directories prefixed with <span style={s.mono}>@</span> are parallel route slots. They render alongside the main page and are passed as named props to the nearest layout. They don't create URL segments.
      </p>
      <CodeBlock language="tsx" title="File structure">
        {`resources/js/rsc/app/
├── layout.tsx          ← receives { children, sidebar, modal }
├── page.tsx            ← rendered as "children"
├── @sidebar/
│   └── page.tsx        ← rendered as "sidebar" prop
└── @modal/
    └── default.tsx     ← rendered as "modal" prop (empty by default)`}
      </CodeBlock>
      <p style={s.p}>
        The layout receives parallel slots as props:
      </p>
      <CodeBlock language="tsx" title="app/layout.tsx">
        {`export default function Layout({
  children,
  sidebar,
  modal,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex' }}>
      <aside style={{ width: 250 }}>{sidebar}</aside>
      <main style={{ flex: 1 }}>{children}</main>
      {modal}
    </div>
  );
}`}
      </CodeBlock>
      <p style={s.p}>
        Use <span style={s.mono}>default.tsx</span> for slots that should render empty by default (like modals that only appear on certain routes).
      </p>

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
