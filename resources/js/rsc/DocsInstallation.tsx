import CodeBlock from './CodeBlock';
import Link from 'lara-bun/Link';

const s = {
  h1: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12 } as const,
  h2: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', marginTop: 48, marginBottom: 12 } as const,
  h3: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 17, fontWeight: 600, marginTop: 32, marginBottom: 8 } as const,
  p: { color: '#d4d4d8', fontSize: 15, lineHeight: 1.8, marginBottom: 16 } as const,
  li: { color: '#d4d4d8', fontSize: 15, lineHeight: 1.8, marginBottom: 6, paddingLeft: 8 } as const,
  accent: { color: '#f59e0b' } as const,
  mono: { fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace", fontSize: 13, background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 4, color: '#e4e4e7' } as const,
  hr: { border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '40px 0' } as const,
};

export default function DocsInstallation() {
  return (
    <div>
      <h1 style={s.h1}>Installation</h1>
      <p style={s.p}>
        Get LaraBun running in your Laravel application in a few steps.
      </p>

      <h2 style={s.h2}>Requirements</h2>
      <ul style={{ listStyle: 'none' }}>
        <li style={s.li}>• <strong style={{ color: '#fafafa' }}>PHP 8.2+</strong> with the <span style={s.mono}>sockets</span> extension</li>
        <li style={s.li}>• <strong style={{ color: '#fafafa' }}>Laravel 11+</strong></li>
        <li style={s.li}>• <strong style={{ color: '#fafafa' }}>Bun 1.0+</strong> — the JavaScript runtime that powers the bridge</li>
        <li style={s.li}>• <strong style={{ color: '#fafafa' }}>React 19</strong> (for RSC features)</li>
      </ul>

      <h2 style={s.h2}>1. Install the Composer Package</h2>
      <CodeBlock language="bash">
        {`composer require ramonmalcolm10/lara-bun`}
      </CodeBlock>
      <p style={s.p}>
        This installs the PHP bridge, service provider, Artisan commands, and the Bun worker script.
      </p>

      <h2 style={s.h2}>2. Publish the Configuration</h2>
      <CodeBlock language="bash">
        {`php artisan vendor:publish --tag=lara-bun-config`}
      </CodeBlock>
      <p style={s.p}>
        Creates <span style={s.mono}>config/bun.php</span> where you configure the socket path, worker count, SSR, and RSC options.
      </p>

      <h2 style={s.h2}>3. Install JavaScript Dependencies</h2>
      <p style={s.p}>
        If you're using RSC, add <span style={s.mono}>react-server-dom-webpack</span> to your project:
      </p>
      <CodeBlock language="bash">
        {`bun add react react-dom react-server-dom-webpack`}
      </CodeBlock>
      <p style={s.p}>
        Then add the build scripts to your <span style={s.mono}>package.json</span>:
      </p>
      <CodeBlock language="json" title="package.json">
        {`{
  "scripts": {
    "build:rsc": "bun vendor/ramonmalcolm10/lara-bun/resources/build-rsc.ts",
    "dev:rsc": "bun --watch vendor/ramonmalcolm10/lara-bun/resources/build-rsc.ts"
  }
}`}
      </CodeBlock>
      <p style={s.p}>
        Use <span style={s.mono}>bun run dev:rsc</span> during development — it watches for file changes and rebuilds automatically. Use <span style={s.mono}>bun run build:rsc</span> for production builds.
      </p>

      <h2 style={s.h2}>4. Environment Configuration</h2>
      <p style={s.p}>
        Add the following to your <span style={s.mono}>.env</span> file:
      </p>
      <CodeBlock language="env" title=".env">
        {`BUN_RSC_ENABLED=true
BUN_BRIDGE_SOCKET=/tmp/my-app-bridge.sock`}
      </CodeBlock>
      <p style={s.p}>
        For Inertia SSR mode (without RSC), use <span style={s.mono}>BUN_SSR_ENABLED=true</span> instead.
      </p>

      <h2 style={s.h2}>5. Create Your First Page</h2>
      <p style={s.p}>
        LaraBun uses file-based routing. Create an <span style={s.mono}>app/</span> directory inside <span style={s.mono}>resources/js/rsc/</span> with a root layout and a page:
      </p>
      <CodeBlock language="tsx" title="resources/js/rsc/app/layout.tsx">
        {`export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav>My App</nav>
      <main>{children}</main>
    </div>
  );
}`}
      </CodeBlock>
      <CodeBlock language="tsx" title="resources/js/rsc/app/page.tsx">
        {`export default function Home() {
  return <h1>Welcome to LaraBun</h1>;
}`}
      </CodeBlock>
      <p style={s.p}>
        That's it — <span style={s.mono}>app/page.tsx</span> maps to <span style={s.mono}>GET /</span> and is automatically wrapped by <span style={s.mono}>app/layout.tsx</span>. See <Link href="/docs/rsc" style={s.accent}>File-Based Routing</Link> for the full convention.
      </p>

      <h2 style={s.h2}>6. Build and Serve</h2>
      <CodeBlock language="bash">
        {`# Build server + client bundles
bun run build:rsc

# Start the Bun worker
php artisan bun:serve

# Or start with auto-restart on rebuild
php artisan bun:serve --watch`}
      </CodeBlock>
      <p style={s.p}>
        The build step auto-discovers your components, generates manifests, and creates optimized bundles. The <span style={s.mono}>bun:serve</span> command starts the Bun worker that listens on the Unix socket.
      </p>
      <p style={s.p}>
        The <span style={s.mono}>--watch</span> flag monitors your RSC build output and automatically restarts the worker when bundles change — no manual restart needed after each <span style={s.mono}>bun run build:rsc</span>.
      </p>

      <hr style={s.hr} />
      <p style={s.p}>
        Next: <Link href="/docs/configuration" style={s.accent}>Configure LaraBun →</Link>
      </p>
    </div>
  );
}
