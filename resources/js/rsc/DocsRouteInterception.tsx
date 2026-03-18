import CodeBlock from './CodeBlock';
import Link from 'lara-bun/Link';

const s = {
  h1: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12 } as const,
  h2: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', marginTop: 48, marginBottom: 12 } as const,
  h3: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 18, fontWeight: 600, marginTop: 32, marginBottom: 8 } as const,
  p: { color: '#d4d4d8', fontSize: 15, lineHeight: 1.8, marginBottom: 16 } as const,
  mono: { fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace", fontSize: 13, background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 4, color: '#e4e4e7' } as const,
  hr: { border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '40px 0' } as const,
  accent: { color: '#f59e0b' } as const,
  box: { background: '#18181b', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: 24, marginBottom: 20 } as const,
};

export default function DocsRouteInterception() {
  return (
    <div>
      <h1 style={s.h1}>Route Interception</h1>
      <p style={s.p}>
        Route interception lets you load a route from a different part of your app within the current layout. When a user clicks a link, the intercepted component renders in a parallel slot (like a modal) while the current page stays visible behind it. On hard navigation (refresh or direct URL), the normal page renders instead.
      </p>
      <p style={s.p}>
        This follows the same convention as Next.js — using <span style={s.mono}>(.)folder</span>, <span style={s.mono}>(..)folder</span>, and <span style={s.mono}>(...)folder</span> prefixes.
      </p>

      <h2 style={s.h2}>Convention</h2>
      <div style={s.box}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 13, fontWeight: 600, color: '#fafafa', fontFamily: "ui-monospace, 'Fira Code', monospace" }}>Prefix</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 13, fontWeight: 600, color: '#fafafa' }}>Intercepts</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13, color: '#f59e0b', fontFamily: "ui-monospace, 'Fira Code', monospace" }}>(.)folder</td>
              <td style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 14, color: '#a1a1aa' }}>Same level — matches a sibling route</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13, color: '#f59e0b', fontFamily: "ui-monospace, 'Fira Code', monospace" }}>(..)folder</td>
              <td style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 14, color: '#a1a1aa' }}>One level up — matches a route in the parent segment</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 12px', fontSize: 13, color: '#f59e0b', fontFamily: "ui-monospace, 'Fira Code', monospace" }}>(...)folder</td>
              <td style={{ padding: '8px 12px', fontSize: 14, color: '#a1a1aa' }}>Root level — matches a route from the app root</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 style={s.h2}>Example: Photo Modal</h2>
      <p style={s.p}>
        The most common use case is showing content in a modal on SPA navigation, with the full page as a fallback on hard navigation.
      </p>

      <h3 style={s.h3}>File Structure</h3>
      <CodeBlock language="tsx" title="File structure">
        {`resources/js/rsc/app/
├── layout.tsx              ← renders {children} + {modal}
├── page.tsx                ← feed page
├── @modal/
│   ├── default.tsx         ← empty by default (no modal open)
│   └── (.)photo/[id]/
│       └── page.tsx        ← photo modal (interceptor)
└── photo/[id]/
    └── page.tsx            ← full photo page (hard nav)`}
      </CodeBlock>

      <h3 style={s.h3}>Root Layout</h3>
      <p style={s.p}>
        The layout receives the <span style={s.mono}>modal</span> parallel slot as a prop. No special wrapper component needed — just render it directly:
      </p>
      <CodeBlock language="tsx" title="app/layout.tsx">
        {`export default function Layout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div>
      <main>{children}</main>
      {modal}
    </div>
  );
}`}
      </CodeBlock>

      <h3 style={s.h3}>Default Slot</h3>
      <p style={s.p}>
        The <span style={s.mono}>@modal/default.tsx</span> renders when no interception is active:
      </p>
      <CodeBlock language="tsx" title="app/@modal/default.tsx">
        {`export default function ModalDefault() {
  return null;
}`}
      </CodeBlock>

      <h3 style={s.h3}>Interceptor Component</h3>
      <p style={s.p}>
        The interceptor at <span style={s.mono}>@modal/(.)photo/[id]/page.tsx</span> receives the target route's params and renders a modal overlay:
      </p>
      <CodeBlock language="tsx" title="app/@modal/(.)photo/[id]/page.tsx">
        {`"use client";

import Link from 'lara-bun/Link';

export default function PhotoModal({ id }: { id: string }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
    }}>
      <div style={{
        background: '#1c1c1e',
        borderRadius: 16,
        padding: 32,
        maxWidth: 500,
        width: '90%',
      }}>
        <h2>Photo {id}</h2>
        <p>This renders in a modal on SPA navigation.</p>
        <Link href="/">Close</Link>
      </div>
    </div>
  );
}`}
      </CodeBlock>

      <h3 style={s.h3}>Full Page (Hard Nav)</h3>
      <p style={s.p}>
        When a user navigates directly to <span style={s.mono}>/photo/123</span> (hard refresh, shared link), the normal page renders:
      </p>
      <CodeBlock language="tsx" title="app/photo/[id]/page.tsx">
        {`export default function PhotoPage({ id }: { id: string }) {
  return (
    <div>
      <h1>Photo {id}</h1>
      <p>Full photo page — shown on direct navigation or refresh.</p>
    </div>
  );
}`}
      </CodeBlock>

      <h2 style={s.h2}>How It Works</h2>
      <p style={s.p}>
        On <strong style={{ color: '#fafafa' }}>SPA navigation</strong> (clicking a Link):
      </p>
      <ol style={{ ...s.p, paddingLeft: 20 }}>
        <li>The client checks the intercept manifest (generated at build time)</li>
        <li>If the target URL matches an intercept pattern, headers are added to the request</li>
        <li>The server resolves the current page from the referer URL</li>
        <li>The full tree is rendered: layout with the current page as children and the interceptor in the slot</li>
        <li>React reconciliation keeps the current page intact and only updates the slot</li>
      </ol>
      <p style={s.p}>
        On <strong style={{ color: '#fafafa' }}>hard navigation</strong> (direct URL, refresh):
      </p>
      <ol style={{ ...s.p, paddingLeft: 20 }}>
        <li>Normal route matching — <span style={s.mono}>/photo/123</span> renders <span style={s.mono}>photo/[id]/page.tsx</span></li>
        <li>No interception — the full photo page renders</li>
      </ol>

      <h2 style={s.h2}>Nested Interception</h2>
      <p style={s.p}>
        Use <span style={s.mono}>(..)</span> to intercept routes one level up, or <span style={s.mono}>(...)</span> to intercept from the app root:
      </p>
      <CodeBlock language="tsx" title="Intercepting from a nested page">
        {`// From /feed, intercept /photo/[id] at the same level
app/@modal/(.)photo/[id]/page.tsx

// From /feed/trending, intercept /photo/[id] one level up
app/feed/@modal/(..)photo/[id]/page.tsx

// From /dashboard/settings, intercept /photo/[id] from root
app/dashboard/settings/@drawer/(...)photo/[id]/page.tsx`}
      </CodeBlock>

      <h2 style={s.h2}>Multiple Slots</h2>
      <p style={s.p}>
        You can intercept the same route into different slots:
      </p>
      <CodeBlock language="tsx" title="File structure">
        {`app/
├── @modal/(.)photo/[id]/page.tsx     ← renders in "modal" slot
├── @preview/(.)photo/[id]/page.tsx   ← renders in "preview" slot
└── photo/[id]/page.tsx               ← full page`}
      </CodeBlock>

      <h2 style={s.h2}>Live Demo</h2>
      <p style={s.p}>
        See route interception in action — click items to open them in a modal, then try refreshing to see the full page:
      </p>
      <p style={s.p}>
        <Link href="/docs/intercept-demo" style={{ ...s.accent, fontWeight: 500 }}>Open Intercept Demo →</Link>
      </p>

      <hr style={s.hr} />
      <p style={s.p}>
        Route interception builds on <Link href="/docs/rsc" style={s.accent}>parallel routes</Link>. Make sure you're familiar with the <span style={s.mono}>@folder</span> convention before using interception patterns.
      </p>
      <p style={s.p}>
        Next: <Link href="/docs/typed-routes" style={s.accent}>Typed Routes →</Link>
      </p>
    </div>
  );
}
