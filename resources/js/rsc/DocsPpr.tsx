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

export default function DocsPpr() {
  return (
    <div>
      <h1 style={s.h1}>Partial Prerendering</h1>
      <p style={s.p}>
        LaraBun uses React's streaming Suspense to implement Partial Prerendering (PPR). Every page is prerendered at build time. Static content is cached, dynamic content is streamed fresh on each request.
      </p>
      <p style={s.p}>
        PPR is not an opt-in feature — it's how LaraBun works. There's no configuration needed.
      </p>

      <h2 style={s.h2}>How It Works</h2>
      <div style={s.box}>
        <div style={{
          fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace",
          fontSize: 13,
          color: '#a1a1aa',
          lineHeight: 2.2,
        }}>
          <div><span style={{ color: '#f59e0b' }}>Build time</span></div>
          <div style={{ paddingLeft: 16 }}>→ Page rendered with mock <span style={{ color: '#f97316' }}>php()</span> that never resolves</div>
          <div style={{ paddingLeft: 16 }}>→ Async components suspend → Suspense shows fallbacks</div>
          <div style={{ paddingLeft: 16 }}>→ Shell HTML (layout + fallbacks) cached</div>
          <div style={{ marginTop: 8 }}><span style={{ color: '#f59e0b' }}>Request time</span></div>
          <div style={{ paddingLeft: 16 }}>→ Cached shell served instantly — <span style={{ color: '#f97316' }}>fast TTFB</span></div>
          <div style={{ paddingLeft: 16 }}>→ Fresh render streams Suspense completions</div>
          <div style={{ paddingLeft: 16 }}>→ React swaps fallbacks with real content inline</div>
          <div style={{ paddingLeft: 16 }}>→ Flight payload sent for hydration</div>
        </div>
      </div>

      <h2 style={s.h2}>Wrapping Dynamic Content</h2>
      <p style={s.p}>
        Any component that uses <span style={s.mono}>php()</span> or other async data fetching must be wrapped in <span style={s.mono}>{`<Suspense>`}</span> with a fallback. This is a React requirement, not a LaraBun one.
      </p>
      <CodeBlock language="tsx" title="resources/js/rsc/app/posts/[id]/page.tsx">
        {`import { Suspense } from 'react';

function PostContent({ id }: { id: string }) {
  const post = await php('PostCallable.show', { id });
  return <article><h1>{post.title}</h1><p>{post.body}</p></article>;
}

function PostSkeleton() {
  return (
    <div style={{ animation: 'pulse 2s infinite' }}>
      <div style={{ height: 32, background: '#27272a', borderRadius: 8, marginBottom: 16 }} />
      <div style={{ height: 200, background: '#27272a', borderRadius: 8 }} />
    </div>
  );
}

export default function PostPage({ id }: { id: string }) {
  return (
    <div>
      <Suspense fallback={<PostSkeleton />}>
        <PostContent id={id} />
      </Suspense>
    </div>
  );
}`}
      </CodeBlock>
      <p style={s.p}>
        At build time, <span style={s.mono}>PostContent</span> suspends (mock <span style={s.mono}>php()</span> never resolves), and the user sees <span style={s.mono}>PostSkeleton</span>. At request time, <span style={s.mono}>PostContent</span> resolves with real data and React swaps the skeleton with the actual content.
      </p>

      <h2 style={s.h2}>Using loading.tsx</h2>
      <p style={s.p}>
        Instead of wrapping every component in <span style={s.mono}>{`<Suspense>`}</span>, create a <span style={s.mono}>loading.tsx</span> file in the same directory as your <span style={s.mono}>page.tsx</span>. LaraBun automatically wraps the page in <span style={s.mono}>{`<Suspense fallback={<Loading />}>`}</span>:
      </p>
      <CodeBlock language="tsx" title="resources/js/rsc/app/posts/[id]/loading.tsx">
        {`export default function Loading() {
  return (
    <div style={{ padding: 40 }}>
      <div style={{
        width: 200, height: 24,
        background: '#27272a', borderRadius: 8,
        animation: 'pulse 2s infinite',
      }} />
    </div>
  );
}`}
      </CodeBlock>
      <p style={s.p}>
        With <span style={s.mono}>loading.tsx</span>, your page component doesn't need any Suspense wrappers — just use <span style={s.mono}>await php()</span> normally:
      </p>
      <CodeBlock language="tsx" title="resources/js/rsc/app/posts/[id]/page.tsx">
        {`export default async function PostPage({ id }: { id: string }) {
  const post = await php('PostCallable.show', { id });
  return <h1>{post.title}</h1>;
}
// No <Suspense> needed — loading.tsx handles it automatically`}
      </CodeBlock>

      <h2 style={s.h2}>Hierarchical loading.tsx</h2>
      <p style={s.p}>
        Like <span style={s.mono}>layout.tsx</span>, <span style={s.mono}>loading.tsx</span> files are hierarchical. Each directory level can have its own loading component. The nearest one to the page is used:
      </p>
      <div style={s.box}>
        <pre style={{
          fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace",
          fontSize: 13,
          color: '#a1a1aa',
          lineHeight: 1.8,
          margin: 0,
        }}>
{`resources/js/rsc/app/
├── layout.tsx
├── loading.tsx          ← fallback for all pages
├── docs/
│   ├── layout.tsx
│   ├── loading.tsx      ← fallback for docs pages
│   └── [slug]/
│       └── page.tsx     ← uses docs/loading.tsx
├── dashboard/
│   ├── page.tsx         ← uses app/loading.tsx (no docs/loading.tsx)
│   └── settings/
│       ├── loading.tsx  ← fallback for settings pages
│       └── page.tsx     ← uses settings/loading.tsx`}
        </pre>
      </div>
      <p style={s.p}>
        Multiple loading files in the hierarchy stack as nested Suspense boundaries. The outermost loading wraps first, then inner ones wrap closer to the page.
      </p>

      <h2 style={s.h2}>What Gets Prerendered</h2>
      <div style={s.box}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 13, fontWeight: 600, color: '#fafafa' }}>Route</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 13, fontWeight: 600, color: '#fafafa' }}>Result</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['No async content', 'Fully static — served from cache, no server hit'],
              ['Async with Suspense', 'PPR — cached shell + streamed dynamic content'],
              ['Async with staticPaths', 'Each path prerendered individually'],
              ['Dynamic params (no staticPaths)', 'Shell with fallbacks cached, content streamed per request'],
            ].map(([route, result], i) => (
              <tr key={route}>
                <td style={{ padding: '8px 12px', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none', fontSize: 14, color: '#f59e0b' }}>{route}</td>
                <td style={{ padding: '8px 12px', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none', fontSize: 14, color: '#a1a1aa' }}>{result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={s.h2}>Build Output</h2>
      <p style={s.p}>
        Running <span style={s.mono}>php artisan rsc:build</span> shows each route's prerender strategy:
      </p>
      <div style={s.box}>
        <pre style={{
          fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace",
          fontSize: 13,
          color: '#a1a1aa',
          lineHeight: 1.8,
          margin: 0,
        }}>
{`Route (app)
─────────────────────────────────────────────
○  /                Static
○  /about           Static
◔  /dashboard       PPR
●  /docs/[slug]     SSG (14 paths)
◔  /posts/[id]      PPR (dynamic params)`}
        </pre>
      </div>

      <h2 style={s.h2}>Error: Missing Suspense</h2>
      <p style={s.p}>
        If a page uses <span style={s.mono}>php()</span> without a Suspense boundary, the build will fail with:
      </p>
      <div style={{ ...s.box, borderColor: 'rgba(239,68,68,0.2)' }}>
        <code style={{ color: '#ef4444', fontSize: 13 }}>
          PPR shell timed out for /dashboard. Async content must be wrapped in {'<Suspense>'} or provide a loading.tsx.
        </code>
      </div>
      <p style={s.p}>
        Fix it by wrapping async content in <span style={s.mono}>{`<Suspense>`}</span> or adding a <span style={s.mono}>loading.tsx</span> file.
      </p>

      <hr style={s.hr} />
      <p style={s.p}>
        Next: <Link href="/docs/react-compiler" style={s.accent}>React Compiler →</Link>
      </p>
    </div>
  );
}
