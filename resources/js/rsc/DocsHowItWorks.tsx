import CodeBlock from './CodeBlock';
import Link from 'lara-bun/Link';

const s = {
  h1: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12 } as const,
  h2: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', marginTop: 48, marginBottom: 12 } as const,
  p: { color: '#a1a1aa', fontSize: 15, lineHeight: 1.8, marginBottom: 16 } as const,
  mono: { fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace", fontSize: 13, background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 4, color: '#e4e4e7' } as const,
  hr: { border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '40px 0' } as const,
  accent: { color: '#f59e0b' } as const,
  box: { background: '#18181b', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: 24, marginBottom: 20 } as const,
};

export default function DocsHowItWorks() {
  return (
    <div>
      <h1 style={s.h1}>How It Works</h1>
      <p style={s.p}>
        LaraBun bridges two runtimes — PHP (Laravel) and Bun (React) — over a persistent Unix socket using a binary frame protocol.
      </p>

      <h2 style={s.h2}>Architecture Overview</h2>
      <div style={s.box}>
        <div style={{
          fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace",
          fontSize: 13,
          color: '#a1a1aa',
          lineHeight: 2,
        }}>
          <div>Browser request → <span style={{ color: '#a78bfa' }}>Laravel</span> (PHP-FPM / Octane)</div>
          <div style={{ paddingLeft: 24 }}>↓ <span style={{ color: '#9a9aa2', fontSize: 12 }}>rsc('Component', $props)</span></div>
          <div style={{ paddingLeft: 24 }}><span style={{ color: '#a78bfa' }}>BunBridge</span> → Unix Socket → <span style={{ color: '#22d3ee' }}>Bun Worker</span></div>
          <div style={{ paddingLeft: 48 }}>↓ <span style={{ color: '#9a9aa2', fontSize: 12 }}>renderToReadableStream()</span></div>
          <div style={{ paddingLeft: 48 }}><span style={{ color: '#22d3ee' }}>React RSC</span> → Flight payload + HTML</div>
          <div style={{ paddingLeft: 24 }}>← streamed back over socket</div>
          <div>← <span style={{ color: '#a78bfa' }}>Laravel</span> streams to browser</div>
        </div>
      </div>

      <h2 style={s.h2}>The Frame Protocol</h2>
      <p style={s.p}>
        All messages between PHP and Bun use a simple length-prefixed frame format:
      </p>
      <div style={s.box}>
        <div style={{
          fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace",
          fontSize: 13,
          color: '#e4e4e7',
        }}>
          <div><span style={{ color: '#f59e0b' }}>[ 4 bytes: BE uint32 length ]</span><span style={{ color: '#9a9aa2' }}> + </span><span style={{ color: '#22d3ee' }}>[ N bytes: UTF-8 JSON payload ]</span></div>
        </div>
      </div>
      <p style={s.p}>
        PHP writes the frame length as a 4-byte big-endian unsigned integer, followed by the JSON payload. Bun reads the length first, then reads exactly that many bytes. This avoids delimiter issues and supports binary-safe transport.
      </p>

      <h2 style={s.h2}>Request Flow: Initial Page Load</h2>
      <p style={s.p}>
        When a browser requests a page for the first time (no <span style={s.mono}>X-RSC</span> header):
      </p>
      <ol style={{ listStyle: 'none', paddingLeft: 0 }}>
        {[
          'Laravel receives the HTTP request and calls rsc(\'Component\', $props)',
          'BunBridge sends a rsc-html-stream message to Bun over the socket',
          'Bun renders the React tree to an HTML stream with Suspense support',
          'HTML streams back to PHP, which forwards it to the browser chunk by chunk',
          'The Flight payload is embedded for client-side hydration',
          'Client JS hydrates the page — it\'s now a full SPA',
        ].map((text, i) => (
          <li key={i} style={{ color: '#a1a1aa', fontSize: 15, lineHeight: 1.8, marginBottom: 8, paddingLeft: 8 }}>
            <span style={{ color: '#f59e0b', fontFamily: "ui-monospace, 'Fira Code', monospace", fontSize: 12, marginRight: 8 }}>{i + 1}.</span>
            {text}
          </li>
        ))}
      </ol>

      <h2 style={s.h2}>Request Flow: SPA Navigation</h2>
      <p style={s.p}>
        When the user clicks a <span style={s.mono}>{'<Link>'}</span> component (with <span style={s.mono}>X-RSC: true</span> header):
      </p>
      <ol style={{ listStyle: 'none', paddingLeft: 0 }}>
        {[
          'Browser sends a fetch request with X-RSC: true header',
          'Laravel sends a rsc-stream message to Bun',
          'Bun returns a raw Flight payload (text/x-component)',
          'Browser deserializes it with createFromReadableStream()',
          'React reconciles and updates the DOM — no full page reload',
        ].map((text, i) => (
          <li key={i} style={{ color: '#a1a1aa', fontSize: 15, lineHeight: 1.8, marginBottom: 8, paddingLeft: 8 }}>
            <span style={{ color: '#22d3ee', fontFamily: "ui-monospace, 'Fira Code', monospace", fontSize: 12, marginRight: 8 }}>{i + 1}.</span>
            {text}
          </li>
        ))}
      </ol>

      <h2 style={s.h2}>Version Management</h2>
      <p style={s.p}>
        The <span style={s.mono}>RscMiddleware</span> tracks a version hash based on the build output. When the client's cached version differs from the server's, LaraBun responds with a <span style={s.mono}>409</span> status and an <span style={s.mono}>X-RSC-Location</span> header, triggering a full page reload to sync.
      </p>

      <h2 style={s.h2}>Callback Socket</h2>
      <p style={s.p}>
        When a React component calls <span style={s.mono}>php()</span>, Bun creates a temporary Unix socket for that render cycle. PHP listens on it, executes the callable, and returns the result. The socket is cleaned up when the render completes.
      </p>
      <CodeBlock language="text">
        {`Bun (rendering JSX)
  → php("GetUser", { id: 1 })
  → callback socket: /tmp/rsc-cb-abc123.sock
  → PHP receives, runs GetUser::__invoke({ id: 1 })
  → PHP returns User model as JSON
  → Bun receives, continues rendering`}
      </CodeBlock>

      <hr style={s.hr} />
      <p style={s.p}>
        Next: <Link href="/docs/inertia-ssr" style={s.accent}>Inertia SSR →</Link>
      </p>
    </div>
  );
}
