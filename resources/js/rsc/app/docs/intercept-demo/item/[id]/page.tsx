import Link from 'lara-bun/Link';

const items: Record<string, { title: string; description: string; color: string }> = {
  '1': { title: 'React Server Components', description: 'Server-rendered React with zero client JS for server components. Stream HTML progressively with Suspense.', color: '#3b82f6' },
  '2': { title: 'PHP Callables', description: 'Call PHP functions directly from server components. Data fetching without API routes or serialization.', color: '#10b981' },
  '3': { title: 'Route Interception', description: 'Show content in a modal on SPA navigation. Full page on hard navigation. Same convention as Next.js.', color: '#f59e0b' },
};

export default function ItemPage({ id }: { id: string }) {
  const item = items[id] ?? { title: `Item ${id}`, description: 'Unknown item.', color: '#6b7280' };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <Link href="/docs/intercept-demo" style={{ color: '#f59e0b', fontSize: 14, marginBottom: 24, display: 'inline-block' }}>
        ← Back to demo
      </Link>
      <div style={{
        width: 64,
        height: 64,
        borderRadius: 16,
        background: item.color,
        opacity: 0.2,
        marginBottom: 20,
      }} />
      <h1 style={{
        fontFamily: "'Bricolage Grotesque', sans-serif",
        fontSize: 28,
        fontWeight: 700,
        color: '#fafafa',
        marginBottom: 12,
      }}>
        {item.title}
      </h1>
      <p style={{
        color: '#a1a1aa',
        fontSize: 15,
        lineHeight: 1.8,
        marginBottom: 24,
      }}>
        {item.description}
      </p>
      <p style={{
        color: '#52525b',
        fontSize: 12,
        fontFamily: "ui-monospace, 'Fira Code', monospace",
      }}>
        This is the full page — shown on direct navigation or page refresh.
      </p>
    </div>
  );
}
