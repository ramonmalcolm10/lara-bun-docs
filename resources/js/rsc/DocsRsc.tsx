import CodeBlock from './CodeBlock';
import Link from 'lara-bun/Link';

const s = {
  h1: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12 } as const,
  h2: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', marginTop: 48, marginBottom: 12 } as const,
  h3: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 17, fontWeight: 600, marginTop: 32, marginBottom: 8 } as const,
  p: { color: '#a1a1aa', fontSize: 15, lineHeight: 1.8, marginBottom: 16 } as const,
  mono: { fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace", fontSize: 13, background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 4, color: '#e4e4e7' } as const,
  hr: { border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '40px 0' } as const,
  accent: { color: '#f59e0b' } as const,
  box: { background: '#18181b', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: 24, marginBottom: 20 } as const,
};

export default function DocsRsc() {
  return (
    <div>
      <h1 style={s.h1}>React Server Components</h1>
      <p style={s.p}>
        LaraBun brings full React Server Components to Laravel. Write server components that render on Bun, stream HTML to the browser, and hydrate into a full SPA.
      </p>

      <h2 style={s.h2}>Server Components</h2>
      <p style={s.p}>
        Server components are the default. Any <span style={s.mono}>.tsx</span> file in <span style={s.mono}>resources/js/rsc/</span> without a <span style={s.mono}>"use client"</span> directive is a server component.
      </p>
      <CodeBlock language="tsx" title="resources/js/rsc/UserProfile.tsx">
        {`export default function UserProfile({ name, email }: {
  name: string;
  email: string;
}) {
  return (
    <div>
      <h1>{name}</h1>
      <p>{email}</p>
    </div>
  );
}`}
      </CodeBlock>
      <p style={s.p}>
        Return it from a Laravel route using the <span style={s.mono}>rsc()</span> helper:
      </p>
      <CodeBlock language="php">
        {`Route::get('/profile', fn () => rsc('UserProfile', [
    'name' => auth()->user()->name,
    'email' => auth()->user()->email,
]));`}
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

      <h2 style={s.h2}>Layouts</h2>
      <p style={s.p}>
        Wrap pages in layout components using the <span style={s.mono}>.layout()</span> method. Layouts are server components that receive <span style={s.mono}>children</span>.
      </p>
      <CodeBlock language="tsx" title="resources/js/rsc/AppLayout.tsx">
        {`export default function AppLayout({ children }: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <nav>...</nav>
      <main>{children}</main>
    </div>
  );
}`}
      </CodeBlock>
      <CodeBlock language="php">
        {`// Layouts wrap outermost-first:
// <RootLayout><AppLayout><Dashboard /></AppLayout></RootLayout>
Route::get('/dashboard', fn () => rsc('Dashboard', ['user' => $user])
    ->layout('AppLayout')
    ->layout('RootLayout')
);`}
      </CodeBlock>

      <h2 style={s.h2}>Navigation</h2>
      <p style={s.p}>
        Use the <span style={s.mono}>Link</span> component for SPA navigation between pages. It intercepts clicks, fetches the Flight payload, and updates the React tree without a full reload.
      </p>
      <CodeBlock language="tsx">
        {`import Link from 'lara-bun/Link';

// Basic navigation
<Link href="/dashboard">Dashboard</Link>

// With prefetching
<Link href="/settings" prefetch="hover">Settings</Link>

// Programmatic navigation
import { visit, prefetch } from 'lara-bun/router';

await visit('/dashboard');
prefetch('/settings', 5000); // cache for 5s`}
      </CodeBlock>

      <h2 style={s.h2}>Streaming</h2>
      <p style={s.p}>
        On initial page loads, LaraBun streams HTML progressively. React renders the shell (including Suspense fallbacks) immediately. As async content resolves, React injects completion scripts that swap in the real content.
      </p>
      <p style={s.p}>
        For SPA navigations, the raw Flight payload streams to the browser via <span style={s.mono}>createFromReadableStream()</span> for progressive React reconciliation.
      </p>

      <h2 style={s.h2}>Component Discovery</h2>
      <p style={s.p}>
        The <span style={s.mono}>build:rsc</span> script auto-discovers all components in <span style={s.mono}>resources/js/rsc/</span>. Component names are derived from filenames:
      </p>
      <div style={s.box}>
        <div style={{
          fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace",
          fontSize: 13,
          color: '#a1a1aa',
          lineHeight: 2,
        }}>
          <div><span style={{ color: '#9a9aa2' }}>resources/js/rsc/</span></div>
          <div style={{ paddingLeft: 16 }}>Dashboard.tsx → <span style={{ color: '#f59e0b' }}>rsc('Dashboard')</span></div>
          <div style={{ paddingLeft: 16 }}>UserProfile.tsx → <span style={{ color: '#f59e0b' }}>rsc('UserProfile')</span></div>
          <div style={{ paddingLeft: 16 }}>Counter.tsx <span style={{ color: '#9a9aa2' }}>("use client")</span> → hydrated in browser</div>
          <div style={{ paddingLeft: 16 }}>AppLayout.tsx → <span style={{ color: '#f59e0b' }}>{`->layout('AppLayout')`}</span></div>
        </div>
      </div>

      <hr style={s.hr} />
      <p style={s.p}>
        Next: <Link href="/docs/php-callables" style={s.accent}>PHP Callables →</Link>
      </p>
    </div>
  );
}
