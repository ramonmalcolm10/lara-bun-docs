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

export default function DocsMetadata() {
  return (
    <div>
      <h1 style={s.h1}>Page Metadata</h1>
      <p style={s.p}>
        LaraBun supports Next.js-style page metadata exports. Define <span style={s.mono}>title</span>, <span style={s.mono}>description</span>, Open Graph tags, and more directly in your <span style={s.mono}>page.tsx</span> files — no <span style={s.mono}>route.php</span> or Blade changes needed.
      </p>

      <h2 style={s.h2}>Static Metadata</h2>
      <p style={s.p}>
        Export a <span style={s.mono}>metadata</span> object from your page component:
      </p>
      <CodeBlock language="tsx" title="resources/js/rsc/app/about/page.tsx">
        {`import type { Metadata } from 'lara-bun';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about our team.',
  keywords: ['about', 'team', 'company'],
  'og:title': 'About Us',
  'og:description': 'Learn more about our team.',
};

export default function AboutPage() {
  return <h1>About Us</h1>;
}`}
      </CodeBlock>

      <h2 style={s.h2}>Dynamic Metadata</h2>
      <p style={s.p}>
        For pages that need data-driven metadata, export a <span style={s.mono}>generateMetadata</span> function. It receives the route params and can call <span style={s.mono}>php()</span> to fetch data:
      </p>
      <CodeBlock language="tsx" title="resources/js/rsc/app/posts/[id]/page.tsx">
        {`import type { GenerateMetadata } from 'lara-bun';

export const generateMetadata: GenerateMetadata<{ id: string }> = async ({ id }) => {
  const post = await php<{ title: string; excerpt: string }>('PostCallable.show', { id });

  return {
    title: post.title,
    description: post.excerpt,
    'og:title': post.title,
    'og:description': post.excerpt,
  };
};

export default async function PostPage({ id }: { id: string }) {
  const post = await php('PostCallable.show', { id });
  return <h1>{post.title}</h1>;
}`}
      </CodeBlock>

      <h2 style={s.h2}>Supported Keys</h2>
      <p style={s.p}>
        The <span style={s.mono}>Metadata</span> type supports all common meta tags:
      </p>
      <div style={s.box}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 13, fontWeight: 600, color: '#fafafa', fontFamily: "ui-monospace, 'Fira Code', monospace" }}>Key</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 13, fontWeight: 600, color: '#fafafa' }}>HTML Output</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['title', '<title>...</title>'],
              ['description', '<meta name="description">'],
              ['keywords', '<meta name="keywords">'],
              ['author', '<meta name="author">'],
              ['robots', '<meta name="robots">'],
              ['og:*', '<meta property="og:*">'],
              ['twitter:*', '<meta name="twitter:*">'],
            ].map(([key, output], i) => (
              <tr key={key}>
                <td style={{ padding: '8px 12px', borderBottom: i < 6 ? '1px solid rgba(255,255,255,0.04)' : 'none', fontSize: 13, color: '#f59e0b', fontFamily: "ui-monospace, 'Fira Code', monospace" }}>{key}</td>
                <td style={{ padding: '8px 12px', borderBottom: i < 6 ? '1px solid rgba(255,255,255,0.04)' : 'none', fontSize: 13, color: '#a1a1aa', fontFamily: "ui-monospace, 'Fira Code', monospace" }}>{output}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={s.p}>
        Any key prefixed with <span style={s.mono}>og:</span> becomes a <span style={s.mono}>{`<meta property="...">`}</span> tag. Any key prefixed with <span style={s.mono}>twitter:</span> becomes a <span style={s.mono}>{`<meta name="...">`}</span> tag. You can also use arbitrary keys via the index signature.
      </p>

      <h2 style={s.h2}>Keywords as Arrays</h2>
      <p style={s.p}>
        The <span style={s.mono}>keywords</span> field accepts either a string or an array of strings. Arrays are automatically joined with commas:
      </p>
      <CodeBlock language="tsx">
        {`export const metadata: Metadata = {
  // Both are equivalent:
  keywords: 'react, laravel, rsc',
  keywords: ['react', 'laravel', 'rsc'],
};`}
      </CodeBlock>

      <h2 style={s.h2}>How It Works</h2>
      <div style={s.box}>
        <div style={{
          fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace",
          fontSize: 13,
          color: '#a1a1aa',
          lineHeight: 2.2,
        }}>
          <div><span style={{ color: '#f59e0b' }}>Build time</span> — LaraBun detects metadata exports in your pages</div>
          <div style={{ paddingLeft: 16 }}>→ Generates a <span style={{ color: '#f97316' }}>resolveMetadata()</span> function in the RSC bundle</div>
          <div style={{ paddingLeft: 16 }}>→ Called during rendering alongside your page component</div>
          <div style={{ marginTop: 8 }}><span style={{ color: '#f59e0b' }}>Full page load</span> — Meta tags injected into <span style={{ color: '#f97316' }}>{`<head>`}</span> automatically</div>
          <div style={{ paddingLeft: 16 }}>→ No Blade template changes needed</div>
          <div style={{ marginTop: 8 }}><span style={{ color: '#f59e0b' }}>SPA navigation</span> — Metadata sent via <span style={{ color: '#f97316' }}>X-RSC-Meta</span> header</div>
          <div style={{ paddingLeft: 16 }}>→ Client updates <span style={{ color: '#f97316' }}>document.title</span> and meta tags in-place</div>
        </div>
      </div>

      <h2 style={s.h2}>Precedence</h2>
      <p style={s.p}>
        If you also have a <span style={s.mono}>route.php</span> file with <span style={s.mono}>viewData</span>, the route-level values take precedence over the page-level metadata. This lets you override metadata from the server when needed:
      </p>
      <CodeBlock language="php" title="resources/js/rsc/app/about/route.php">
        {`<?php

use LaraBun\\Rsc\\PageRoute;

// This title overrides the one from page.tsx metadata
return PageRoute::make()
    ->viewData(fn () => [
        'title' => 'Custom Title from Route',
    ]);`}
      </CodeBlock>

      <hr style={s.hr} />
      <p style={s.p}>
        Next: <Link href="/docs/static-generation" style={s.accent}>Static Generation →</Link>
      </p>
    </div>
  );
}
