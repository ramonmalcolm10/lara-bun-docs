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

export default function DocsInertiaSsr() {
  return (
    <div>
      <h1 style={s.h1}>Inertia SSR</h1>
      <p style={s.p}>
        LaraBun can replace Node.js as the SSR engine for Inertia.js. Same Inertia API, faster renders, lower memory.
      </p>

      <h2 style={s.h2}>Why Bun for Inertia SSR?</h2>
      <div style={s.box}>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {[
            { label: 'Faster cold starts', desc: 'Bun starts ~4x faster than Node.js' },
            { label: 'Lower memory', desc: 'Bun uses significantly less memory per worker' },
            { label: 'Same API', desc: 'Drop-in replacement — your Inertia pages don\'t change' },
            { label: 'Unix socket', desc: 'No HTTP overhead between PHP and the JS runtime' },
          ].map((item) => (
            <li key={item.label} style={{ marginBottom: 12, fontSize: 14, color: '#a1a1aa' }}>
              <strong style={{ color: '#fafafa' }}>{item.label}</strong> — {item.desc}
            </li>
          ))}
        </ul>
      </div>

      <h2 style={s.h2}>Setup</h2>

      <p style={s.p}>
        <strong style={{ color: '#fafafa' }}>1.</strong> Enable SSR in your <span style={s.mono}>.env</span>:
      </p>
      <CodeBlock language="env" title=".env">
        {`BUN_SSR_ENABLED=true
BUN_BRIDGE_SOCKET=/tmp/my-app-ssr.sock`}
      </CodeBlock>

      <p style={s.p}>
        <strong style={{ color: '#fafafa' }}>2.</strong> LaraBun registers a <span style={s.mono}>BunSsrGateway</span> that implements Inertia's <span style={s.mono}>Gateway</span> interface. It intercepts SSR requests and sends them to Bun over the socket instead of Node.
      </p>

      <p style={s.p}>
        <strong style={{ color: '#fafafa' }}>3.</strong> Create your SSR entry file:
      </p>
      <CodeBlock language="tsx" title="resources/js/ssr.tsx">
        {`import { createInertiaApp } from '@inertiajs/react'
import createServer from '@inertiajs/react/server'
import ReactDOMServer from 'react-dom/server'

export async function render(page) {
    return await createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        resolve: name => {
            const pages = import.meta.glob('./pages/**/*.tsx', { eager: true })
            return pages[\`./pages/\${name}.tsx\`]
        },
        setup: ({ App, props }) => <App {...props} />,
    });
}

if (process.env.BUN_SSR_ENABLED === 'false') {
    createServer(page => render(page))
}`}
      </CodeBlock>
      <p style={s.p}>
        The <span style={s.mono}>render</span> function is exported for LaraBun's Bun worker to call directly. The <span style={s.mono}>createServer</span> fallback at the bottom only runs when <span style={s.mono}>BUN_SSR_ENABLED</span> is false, so the same file works with both Node and Bun SSR.
      </p>

      <p style={s.p}>
        <strong style={{ color: '#fafafa' }}>4.</strong> Build and start:
      </p>
      <CodeBlock language="bash">
        {`# Build your Inertia SSR entry (same as before)
bun run build

# Start the Bun bridge worker
php artisan bun:serve`}
      </CodeBlock>

      <h2 style={s.h2}>How It Differs from Node SSR</h2>
      <p style={s.p}>
        With Node-based Inertia SSR, Laravel spawns a Node.js process that listens on a port. Every SSR request is an HTTP call from PHP to Node.
      </p>
      <p style={s.p}>
        With LaraBun, the Bun worker communicates over a Unix socket using a binary frame protocol. No TCP overhead, no port allocation, and the worker process is managed by Artisan.
      </p>

      <CodeBlock language="text">
        {`Node SSR:   PHP → HTTP localhost:13714 → Node.js → HTML
LaraBun:   PHP → Unix socket → Bun → HTML`}
      </CodeBlock>

      <h2 style={s.h2}>Configuration</h2>
      <p style={s.p}>
        SSR configuration lives under the <span style={s.mono}>ssr</span> key in <span style={s.mono}>config/bun.php</span>:
      </p>
      <CodeBlock language="php" title="config/bun.php">
        {`'ssr' => [
    'enabled' => env('BUN_SSR_ENABLED', false),
],`}
      </CodeBlock>
      <p style={s.p}>
        When enabled, LaraBun automatically binds <span style={s.mono}>BunSsrGateway</span> to Inertia's SSR gateway contract. No other changes to your Inertia setup are needed.
      </p>

      <hr style={s.hr} />
      <p style={s.p}>
        Next: <Link href="/docs/rsc" style={s.accent}>React Server Components →</Link>
      </p>
    </div>
  );
}
