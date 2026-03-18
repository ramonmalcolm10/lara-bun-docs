import Link from 'lara-bun/Link';

const s = {
  h1: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12 } as const,
  p: { color: '#d4d4d8', fontSize: 15, lineHeight: 1.8, marginBottom: 16 } as const,
  mono: { fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace", fontSize: 13, background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 4, color: '#e4e4e7' } as const,
  accent: { color: '#f59e0b' } as const,
};

const items = [
  { id: '1', title: 'React Server Components', color: '#3b82f6' },
  { id: '2', title: 'PHP Callables', color: '#10b981' },
  { id: '3', title: 'Route Interception', color: '#f59e0b' },
];

export default function InterceptDemoPage() {
  return (
    <div>
      <h1 style={s.h1}>Route Interception Demo</h1>
      <p style={s.p}>
        Click an item below to open it in a modal (intercepted route). The URL changes to <span style={s.mono}>/docs/intercept-demo/item/[id]</span> but the current page stays visible. Refresh the page on a modal URL to see the full page instead.
      </p>

      <div style={{ display: 'grid', gap: 12, marginTop: 24, marginBottom: 32 }}>
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/docs/intercept-demo/item/${item.id}`}
            prefetch="hover"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '16px 20px',
              background: '#18181b',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.06)',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: item.color,
              opacity: 0.15,
              flexShrink: 0,
            }} />
            <div>
              <div style={{ color: '#fafafa', fontWeight: 500, fontSize: 15 }}>{item.title}</div>
              <div style={{ color: '#52525b', fontSize: 12, fontFamily: "ui-monospace, 'Fira Code', monospace", marginTop: 2 }}>
                /docs/intercept-demo/item/{item.id}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <p style={{ ...s.p, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 8, padding: '12px 16px', fontSize: 13 }}>
        <strong style={{ color: '#f59e0b' }}>How it works:</strong>{' '}
        <span style={{ color: '#d4d4d8' }}>
          The <span style={s.mono}>@modal/(.)item/[id]/page.tsx</span> interceptor renders in the modal slot on SPA clicks. The <span style={s.mono}>item/[id]/page.tsx</span> full page renders on hard navigation.
        </span>
      </p>

      <p style={s.p}>
        <Link href="/docs/route-interception" style={s.accent}>← Back to Route Interception docs</Link>
      </p>
    </div>
  );
}
