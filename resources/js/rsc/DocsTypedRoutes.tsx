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

export default function DocsTypedRoutes() {
  return (
    <div>
      <h1 style={s.h1}>Typed Routes</h1>
      <p style={s.p}>
        LaraBun auto-generates a typed <span style={s.mono}>route()</span> helper from your file-based router. Get autocomplete for route paths and type-checked params — no manual route definitions needed.
      </p>

      <h2 style={s.h2}>Setup</h2>
      <p style={s.p}>
        The <span style={s.mono}>routes.generated.ts</span> file is created automatically during <span style={s.mono}>rsc:build</span> and regenerated on every rebuild (including <span style={s.mono}>bun:dev</span> watch mode). No extra configuration needed.
      </p>

      <h2 style={s.h2}>Usage</h2>
      <CodeBlock language="tsx">
        {`import { route } from './routes.generated';

// Static routes — no params needed
route('/')                                    // → "/"
route('/about')                               // → "/about"

// Dynamic routes — params are required and type-checked
route('/docs/[slug]', { slug: 'metadata' })   // → "/docs/metadata"
route('/posts/[id]', { id: '42' })            // → "/posts/42"

// Works with Link
<Link href={route('/docs/[slug]', { slug: 'installation' })}>
  Installation
</Link>

// Works with visit() and prefetch()
import { visit, prefetch } from 'lara-bun/router';
visit(route('/docs/[slug]', { slug: 'metadata' }));
prefetch(route('/posts/[id]', { id: '1' }));`}
      </CodeBlock>

      <h2 style={s.h2}>Type Safety</h2>
      <p style={s.p}>
        TypeScript catches mistakes at compile time:
      </p>
      <CodeBlock language="tsx">
        {`// ✗ Error: missing required params
route('/docs/[slug]')

// ✗ Error: wrong param name
route('/docs/[slug]', { wrong: 'value' })

// ✗ Error: route doesn't exist
route('/nonexistent')`}
      </CodeBlock>

      <h2 style={s.h2}>Constrained Params</h2>
      <p style={s.p}>
        When your <span style={s.mono}>route.php</span> defines <span style={s.mono}>staticPaths</span> or <span style={s.mono}>where</span> constraints, the generated types narrow the param to only valid values:
      </p>
      <CodeBlock language="php" title="resources/js/rsc/app/docs/[slug]/route.php">
        {`<?php

use LaraBun\\Rsc\\PageRoute;

return PageRoute::make()
    ->staticPaths([
        'installation',
        'configuration',
        'deployment',
    ]);`}
      </CodeBlock>
      <p style={s.p}>
        This generates:
      </p>
      <CodeBlock language="typescript">
        {`// In routes.generated.ts
export interface RouteParams {
  '/': Record<string, never>;
  '/docs/[slug]': { slug: 'installation' | 'configuration' | 'deployment' };
}`}
      </CodeBlock>
      <p style={s.p}>
        The same works with <span style={s.mono}>where</span> constraints using simple alternation patterns:
      </p>
      <CodeBlock language="php">
        {`PageRoute::make()->where('status', 'active|archived')
// Generates: status: 'active' | 'archived'`}
      </CodeBlock>

      <h2 style={s.h2}>Generated File</h2>
      <p style={s.p}>
        The generated <span style={s.mono}>routes.generated.ts</span> is placed in your RSC source directory (e.g. <span style={s.mono}>resources/js/rsc/</span>). It exports:
      </p>
      <div style={s.box}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 13, fontWeight: 600, color: '#fafafa', fontFamily: "ui-monospace, 'Fira Code', monospace" }}>Export</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 13, fontWeight: 600, color: '#fafafa' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13, color: '#f59e0b', fontFamily: "ui-monospace, 'Fira Code', monospace" }}>RouteParams</td>
              <td style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 14, color: '#a1a1aa' }}>Interface mapping route paths to their param types</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13, color: '#f59e0b', fontFamily: "ui-monospace, 'Fira Code', monospace" }}>RoutePath</td>
              <td style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 14, color: '#a1a1aa' }}>Union type of all valid route paths</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 12px', fontSize: 13, color: '#f59e0b', fontFamily: "ui-monospace, 'Fira Code', monospace" }}>route()</td>
              <td style={{ padding: '8px 12px', fontSize: 14, color: '#a1a1aa' }}>Type-safe URL generator function</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p style={s.p}>
        Add <span style={s.mono}>routes.generated.ts</span> to your <span style={s.mono}>.gitignore</span> — it's regenerated on every build.
      </p>

      <hr style={s.hr} />
      <p style={s.p}>
        Next: <Link href="/docs/deployment" style={s.accent}>Deployment →</Link>
      </p>
    </div>
  );
}
