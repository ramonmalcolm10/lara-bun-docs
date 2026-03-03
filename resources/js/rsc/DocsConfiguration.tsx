import CodeBlock from './CodeBlock';
import Link from 'lara-bun/Link';

const s = {
  h1: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12 } as const,
  h2: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', marginTop: 48, marginBottom: 12 } as const,
  p: { color: '#a1a1aa', fontSize: 15, lineHeight: 1.8, marginBottom: 16 } as const,
  mono: { fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace", fontSize: 13, background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 4, color: '#e4e4e7' } as const,
  hr: { border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '40px 0' } as const,
  accent: { color: '#f59e0b' } as const,
  table: { width: '100%', borderCollapse: 'collapse' as const, marginBottom: 20 },
  th: { textAlign: 'left' as const, padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 13, fontWeight: 600, color: '#fafafa', fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace" },
  td: { padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 14, color: '#a1a1aa' },
};

export default function DocsConfiguration() {
  return (
    <div>
      <h1 style={s.h1}>Configuration</h1>
      <p style={s.p}>
        All LaraBun configuration lives in <span style={s.mono}>config/bun.php</span>. Run <span style={s.mono}>php artisan vendor:publish --tag=lara-bun-config</span> to publish it.
      </p>

      <h2 style={s.h2}>Full Configuration Reference</h2>
      <CodeBlock language="php" title="config/bun.php">
        {`return [
    // Path to the Unix socket for PHP ↔ Bun communication
    'socket_path' => env('BUN_BRIDGE_SOCKET', '/tmp/bun-bridge.sock'),

    // Directory for plain Bun functions (non-RSC)
    'functions_dir' => resource_path('bun'),

    // Number of Bun worker processes
    'workers' => (int) env('BUN_WORKERS', 1),

    // Inertia SSR settings
    'ssr' => [
        'enabled' => env('BUN_SSR_ENABLED', false),
    ],

    // React Server Components settings
    'rsc' => [
        'enabled' => env('BUN_RSC_ENABLED', false),
        'bundle'  => base_path('bootstrap/rsc/entry.rsc.js'),
        'source_dir'       => resource_path('js/rsc'),
        'client_build_dir' => public_path('build/rsc'),
        'root_view'        => 'lara-bun::rsc-app',

        // PHP Callables — functions React can invoke
        'callables'     => [],
        'callables_dir' => null,
        'callback_timeout' => 5,
    ],

    'entry_points' => [],
];`}
      </CodeBlock>

      <h2 style={s.h2}>Socket Path</h2>
      <p style={s.p}>
        The <span style={s.mono}>socket_path</span> defines where the Unix socket file is created. Both PHP and Bun must agree on this path. Use a unique path per project to avoid conflicts.
      </p>

      <h2 style={s.h2}>Workers</h2>
      <p style={s.p}>
        The <span style={s.mono}>workers</span> setting controls how many Bun processes to spawn. With multiple workers, sockets are suffixed: <span style={s.mono}>/tmp/bridge-0.sock</span>, <span style={s.mono}>/tmp/bridge-1.sock</span>, etc. PHP round-robins across them.
      </p>
      <CodeBlock language="env" title=".env">
        {`BUN_WORKERS=4`}
      </CodeBlock>

      <h2 style={s.h2}>SSR vs RSC</h2>
      <p style={s.p}>
        LaraBun supports two modes. Enable one or both:
      </p>
      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Mode</th>
            <th style={s.th}>Env Variable</th>
            <th style={s.th}>Use Case</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={s.td}><strong style={{ color: '#fafafa' }}>SSR</strong></td>
            <td style={{ ...s.td, fontFamily: "ui-monospace, 'Fira Code', monospace", fontSize: 13 }}>BUN_SSR_ENABLED</td>
            <td style={s.td}>Server-render Inertia pages via Bun instead of Node</td>
          </tr>
          <tr>
            <td style={s.td}><strong style={{ color: '#fafafa' }}>RSC</strong></td>
            <td style={{ ...s.td, fontFamily: "ui-monospace, 'Fira Code', monospace", fontSize: 13 }}>BUN_RSC_ENABLED</td>
            <td style={s.td}>Full React Server Components with streaming and Flight payloads</td>
          </tr>
        </tbody>
      </table>

      <h2 style={s.h2}>File-Based Routing</h2>
      <p style={s.p}>
        When RSC is enabled and an <span style={s.mono}>app/</span> directory exists inside <span style={s.mono}>source_dir</span>, the file-based router auto-activates. Pages are discovered from <span style={s.mono}>page.tsx</span> files and layouts from <span style={s.mono}>layout.tsx</span> files. See <Link href="/docs/rsc" style={s.accent}>RSC & File-Based Routing</Link> for the full convention.
      </p>

      <h2 style={s.h2}>Callables</h2>
      <p style={s.p}>
        Register PHP classes that React server components can invoke via the <span style={s.mono}>php()</span> function. See the <Link href="/docs/php-callables" style={s.accent}>PHP Callables</Link> guide for details.
      </p>
      <CodeBlock language="php">
        {`'callables' => [
    'GetUser' => App\\Rsc\\GetUser::class,
],

// Or auto-discover from a directory:
'callables_dir' => app_path('Rsc'),`}
      </CodeBlock>

      <h2 style={s.h2}>Callback Timeout</h2>
      <p style={s.p}>
        The <span style={s.mono}>callback_timeout</span> sets how many seconds Bun will wait for PHP to respond to a callable invocation. Defaults to 5 seconds.
      </p>

      <h2 style={s.h2}>Server Actions</h2>
      <p style={s.p}>
        Server actions are auto-discovered from <span style={s.mono}>app/RSC/Actions/</span> by convention. Place your action classes there and run <span style={s.mono}>php artisan rsc:action-manifest</span> to generate the manifest. See <Link href="/docs/server-actions" style={s.accent}>Server Actions</Link> for details.
      </p>

      <hr style={s.hr} />
      <p style={s.p}>
        Next: <Link href="/docs/how-it-works" style={s.accent}>How It Works →</Link>
      </p>
    </div>
  );
}
