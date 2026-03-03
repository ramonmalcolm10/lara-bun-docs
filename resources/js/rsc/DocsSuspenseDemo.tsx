import { Suspense } from 'react';
import Link from 'lara-bun/Link';

const s = {
  h1: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12 } as const,
  h2: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', marginTop: 48, marginBottom: 12 } as const,
  p: { color: '#d4d4d8', fontSize: 15, lineHeight: 1.8, marginBottom: 16 } as const,
  mono: { fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace", fontSize: 13, background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 4, color: '#e4e4e7' } as const,
  hr: { border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '40px 0' } as const,
  accent: { color: '#f59e0b' } as const,
  box: { background: '#18181b', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: 0, marginBottom: 0, overflow: 'hidden' } as const,
};

function Skeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div style={{ padding: 20 }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes rsc-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}} />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} style={{
          height: 14,
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 4,
          marginBottom: i < lines - 1 ? 10 : 0,
          width: i === lines - 1 ? '60%' : '100%',
          animation: 'rsc-pulse 1.5s ease-in-out infinite',
          animationDelay: `${i * 0.15}s`,
        }} />
      ))}
    </div>
  );
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function QuickData() {
  await delay(500);
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80' }} />
        <span style={{ color: '#4ade80', fontWeight: 600, fontSize: 14, fontFamily: "ui-monospace, 'Fira Code', monospace" }}>
          Resolved in 500ms
        </span>
      </div>
      <p style={{ color: '#a1a1aa', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
        This async server component resolved first. React streamed the HTML replacement for this Suspense boundary as soon as the data was ready.
      </p>
    </div>
  );
}

async function MediumData() {
  await delay(2000);
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
        <span style={{ color: '#f59e0b', fontWeight: 600, fontSize: 14, fontFamily: "ui-monospace, 'Fira Code', monospace" }}>
          Resolved in 2s
        </span>
      </div>
      <p style={{ color: '#a1a1aa', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
        This component simulates a database query or API call that takes 2 seconds. The skeleton above was replaced without a full page reload.
      </p>
    </div>
  );
}

async function SlowData() {
  await delay(4000);
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#a78bfa' }} />
        <span style={{ color: '#a78bfa', fontWeight: 600, fontSize: 14, fontFamily: "ui-monospace, 'Fira Code', monospace" }}>
          Resolved in 4s
        </span>
      </div>
      <p style={{ color: '#a1a1aa', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
        The slowest component. Even though this took 4 seconds, the rest of the page was interactive the entire time. No loading spinners, no client-side fetching.
      </p>
    </div>
  );
}

export default function DocsSuspenseDemo() {
  return (
    <div>
      <h1 style={s.h1}>Suspense Streaming Demo</h1>
      <p style={s.p}>
        This page demonstrates React Suspense with streaming HTML. Each section below wraps an async server component in a Suspense boundary. Watch the skeletons get replaced progressively as each component resolves.
      </p>
      <p style={{ ...s.p, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 8, padding: '12px 16px', fontSize: 13 }}>
        <strong style={{ color: '#f59e0b' }}>Tip:</strong>{' '}
        <span style={{ color: '#d4d4d8' }}>
          Reload this page (or visit the URL directly) to see Suspense streaming in action. The initial HTML load streams progressively. SPA navigation waits for all data before rendering.
        </span>
      </p>

      <h2 style={s.h2}>Progressive Loading</h2>
      <p style={s.p}>
        Three async server components with different delays. The shell and skeleton fallbacks are sent immediately, then React streams <span style={s.mono}>{'<template>'}</span> + <span style={s.mono}>{'<script>'}</span> tags to swap in resolved content.
      </p>

      <div style={{ display: 'grid', gap: 16, marginTop: 24 }}>
        <div style={s.box}>
          <div style={{ padding: '12px 20px 0', fontSize: 12, color: '#9a9aa2', fontFamily: "ui-monospace, 'Fira Code', monospace" }}>
            {'<Suspense fallback={<Skeleton />}>'}
          </div>
          <Suspense fallback={<Skeleton lines={2} />}>
            <QuickData />
          </Suspense>
        </div>

        <div style={s.box}>
          <div style={{ padding: '12px 20px 0', fontSize: 12, color: '#9a9aa2', fontFamily: "ui-monospace, 'Fira Code', monospace" }}>
            {'<Suspense fallback={<Skeleton />}>'}
          </div>
          <Suspense fallback={<Skeleton lines={3} />}>
            <MediumData />
          </Suspense>
        </div>

        <div style={s.box}>
          <div style={{ padding: '12px 20px 0', fontSize: 12, color: '#9a9aa2', fontFamily: "ui-monospace, 'Fira Code', monospace" }}>
            {'<Suspense fallback={<Skeleton />}>'}
          </div>
          <Suspense fallback={<Skeleton lines={4} />}>
            <SlowData />
          </Suspense>
        </div>
      </div>

      <h2 style={s.h2}>How It Works</h2>
      <p style={s.p}>
        On initial page load, LaraBun streams the HTML response via <span style={s.mono}>toStreamedHtmlResponse</span>. React renders the shell (with Suspense fallbacks) immediately. As each async component resolves on the server, React injects a <span style={s.mono}>{'<template>'}</span> element containing the resolved HTML and a <span style={s.mono}>{'<script>'}</span> tag that swaps it in. The browser handles this natively.
      </p>
      <p style={s.p}>
        No client-side JavaScript is needed for the swap. No waterfall of API calls. The server does all the data fetching and streams results as they become available.
      </p>

      <hr style={s.hr} />
      <p style={s.p}>
        Back to: <Link href="/docs/rsc" style={s.accent}>React Server Components</Link>
      </p>
    </div>
  );
}
