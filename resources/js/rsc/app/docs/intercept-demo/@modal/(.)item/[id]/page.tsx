"use client";

import Link from 'lara-bun/Link';

const items: Record<string, { title: string; description: string; color: string }> = {
  '1': { title: 'React Server Components', description: 'Server-rendered React with zero client JS for server components. Stream HTML progressively with Suspense.', color: '#3b82f6' },
  '2': { title: 'PHP Callables', description: 'Call PHP functions directly from server components. Data fetching without API routes or serialization.', color: '#10b981' },
  '3': { title: 'Route Interception', description: 'Show content in a modal on SPA navigation. Full page on hard navigation. Same convention as Next.js.', color: '#f59e0b' },
};

export default function ItemModal({ id }: { id: string }) {
  const item = items[id] ?? { title: `Item ${id}`, description: 'Unknown item.', color: '#6b7280' };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        style={{
          background: '#18181b',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.08)',
          padding: 32,
          maxWidth: 440,
          width: '90%',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: item.color,
          opacity: 0.15,
          marginBottom: 16,
        }} />
        <h2 style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: 22,
          fontWeight: 600,
          color: '#fafafa',
          marginBottom: 8,
        }}>
          {item.title}
        </h2>
        <p style={{
          color: '#a1a1aa',
          fontSize: 14,
          lineHeight: 1.7,
          marginBottom: 24,
        }}>
          {item.description}
        </p>
        <p style={{
          color: '#52525b',
          fontSize: 12,
          fontFamily: "ui-monospace, 'Fira Code', monospace",
          marginBottom: 20,
        }}>
          Rendered in @modal slot via (.)item/[id] interception
        </p>
        <Link
          href="/docs/intercept-demo"
          style={{
            display: 'inline-block',
            padding: '8px 20px',
            borderRadius: 8,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#d4d4d8',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Close
        </Link>
      </div>
    </div>
  );
}
