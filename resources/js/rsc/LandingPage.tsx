import Link from 'lara-bun/Link';
import CodeBlock from './CodeBlock';

const features = [
  {
    icon: '⚡',
    title: 'Bun-Powered SSR',
    description: 'Replace Node.js with Bun for Inertia SSR. Faster cold starts, lower memory, same API.',
    color: '#f59e0b',
  },
  {
    icon: '🧩',
    title: 'React Server Components',
    description: 'Full RSC support with streaming HTML, Flight payloads, and progressive hydration.',
    color: '#a78bfa',
  },
  {
    icon: '🔌',
    title: 'Unix Socket Bridge',
    description: 'Zero-overhead PHP ↔ Bun communication via a binary frame protocol over Unix sockets.',
    color: '#22d3ee',
  },
  {
    icon: '📞',
    title: 'PHP Callables',
    description: 'Call PHP functions directly from your React server components. Query Eloquent, run policies, all from JSX.',
    color: '#4ade80',
  },
  {
    icon: '🚀',
    title: 'Server Actions',
    description: '"use server" directives that route through Bun back to PHP. Type-safe mutations with validation.',
    color: '#f97316',
  },
  {
    icon: '🏗️',
    title: 'Zero Config',
    description: 'Auto-discovers components, generates manifests, and builds server + client bundles in one command.',
    color: '#fb7185',
  },
];

const steps = [
  {
    step: '01',
    title: 'Install the package',
    code: 'composer require ramonmalcolm10/lara-bun',
  },
  {
    step: '02',
    title: 'Create a component',
    code: `// resources/js/rsc/Dashboard.tsx
export default function Dashboard({ user }: { user: string }) {
  return <h1>Welcome, {user}</h1>;
}`,
  },
  {
    step: '03',
    title: 'Return from a route',
    code: `// routes/web.php
Route::get('/dashboard', fn () => rsc('Dashboard', [
    'user' => auth()->user()->name,
]));`,
  },
  {
    step: '04',
    title: 'Build and serve',
    code: `bun run build:rsc
php artisan bun:serve`,
  },
];

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section style={{
        padding: '120px 24px 80px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Glow */}
        <div style={{
          position: 'absolute',
          top: -200,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 16px',
            borderRadius: 100,
            background: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.15)',
            fontSize: 13,
            fontWeight: 500,
            color: '#f59e0b',
            marginBottom: 32,
            fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace",
          }}>
            <span style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#f59e0b',
              animation: 'glow 2s ease-in-out infinite',
            }} />
            Now with React Server Components
          </div>

          <h1 style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: 'clamp(40px, 6vw, 72px)',
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            marginBottom: 24,
            color: '#fafafa',
          }}>
            Laravel meets{' '}
            <span style={{
              background: 'linear-gradient(135deg, #f59e0b, #f97316)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Bun
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: '#a1a1aa',
            maxWidth: 560,
            margin: '0 auto 40px',
            lineHeight: 1.7,
          }}>
            A bridge between PHP and Bun's JavaScript runtime.
            Server-render React components, stream HTML, and call PHP from JSX — all over a Unix socket.
          </p>

          {/* Install command */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 24px',
            borderRadius: 10,
            background: '#18181b',
            border: '1px solid rgba(255,255,255,0.08)',
            fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace",
            fontSize: 14,
            color: '#e4e4e7',
            marginBottom: 32,
          }}>
            <span style={{ color: '#9a9aa2' }}>$</span>
            composer require ramonmalcolm10/lara-bun
          </div>

          {/* CTAs */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            flexWrap: 'wrap',
          }}>
            <Link
              href="/docs/installation"
              prefetch="hover"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 28px',
                borderRadius: 10,
                background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                color: '#09090b',
                fontWeight: 600,
                fontSize: 15,
                transition: 'transform 0.15s, box-shadow 0.15s',
                boxShadow: '0 4px 24px rgba(245,158,11,0.25)',
              }}
            >
              Get Started
              <span>→</span>
            </Link>
            <a
              href="https://github.com/ramonmalcolm10/lara-bun"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 28px',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fafafa',
                fontWeight: 500,
                fontSize: 15,
                background: 'rgba(255,255,255,0.03)',
              }}
            >
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{
        padding: '80px 24px',
        maxWidth: 1200,
        margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            marginBottom: 16,
          }}>
            Everything you need
          </h2>
          <p style={{ color: '#a1a1aa', fontSize: 17, maxWidth: 500, margin: '0 auto' }}>
            A complete runtime bridge between Laravel and the Bun JavaScript engine.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 20,
        }}>
          {features.map((f) => (
            <div key={f.title} style={{
              padding: 28,
              borderRadius: 14,
              background: '#18181b',
              border: '1px solid rgba(255,255,255,0.06)',
              transition: 'border-color 0.2s, transform 0.2s',
            }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: `${f.color}12`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                marginBottom: 16,
              }}>
                {f.icon}
              </div>
              <h3 style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 8,
                color: '#fafafa',
              }}>
                {f.title}
              </h3>
              <p style={{ color: '#a1a1aa', fontSize: 14, lineHeight: 1.7 }}>
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture Diagram */}
      <section style={{
        padding: '80px 24px',
        maxWidth: 900,
        margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            marginBottom: 16,
          }}>
            How it works
          </h2>
          <p style={{ color: '#a1a1aa', fontSize: 17 }}>
            PHP and Bun communicate over a persistent Unix socket using a binary frame protocol.
          </p>
        </div>

        <div style={{
          background: '#18181b',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.06)',
          padding: '40px 32px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0,
            flexWrap: 'wrap',
            fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace",
            fontSize: 13,
          }}>
            {/* PHP */}
            <div style={{
              padding: '20px 28px',
              borderRadius: 12,
              background: 'rgba(167,139,250,0.08)',
              border: '1px solid rgba(167,139,250,0.2)',
              textAlign: 'center',
              minWidth: 140,
            }}>
              <div style={{ fontSize: 11, color: '#9a9aa2', marginBottom: 6 }}>RUNTIME</div>
              <div style={{ color: '#a78bfa', fontWeight: 600, fontSize: 16 }}>PHP</div>
              <div style={{ color: '#a1a1aa', fontSize: 11, marginTop: 4 }}>Laravel · Eloquent</div>
            </div>

            {/* Arrow */}
            <div style={{
              padding: '0 12px',
              color: '#a1a1aa',
              fontSize: 20,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
            }}>
              <span>⟷</span>
              <span style={{ fontSize: 11, color: '#9a9aa2' }}>frames</span>
            </div>

            {/* Socket */}
            <div style={{
              padding: '20px 28px',
              borderRadius: 12,
              background: 'rgba(245,158,11,0.08)',
              border: '1px solid rgba(245,158,11,0.2)',
              textAlign: 'center',
              minWidth: 140,
            }}>
              <div style={{ fontSize: 11, color: '#9a9aa2', marginBottom: 6 }}>BRIDGE</div>
              <div style={{ color: '#f59e0b', fontWeight: 600, fontSize: 16 }}>Unix Socket</div>
              <div style={{ color: '#a1a1aa', fontSize: 11, marginTop: 4 }}>4-byte len + JSON</div>
            </div>

            {/* Arrow */}
            <div style={{
              padding: '0 12px',
              color: '#a1a1aa',
              fontSize: 20,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
            }}>
              <span>⟷</span>
              <span style={{ fontSize: 11, color: '#9a9aa2' }}>frames</span>
            </div>

            {/* Bun */}
            <div style={{
              padding: '20px 28px',
              borderRadius: 12,
              background: 'rgba(34,211,238,0.08)',
              border: '1px solid rgba(34,211,238,0.2)',
              textAlign: 'center',
              minWidth: 140,
            }}>
              <div style={{ fontSize: 11, color: '#9a9aa2', marginBottom: 6 }}>RUNTIME</div>
              <div style={{ color: '#22d3ee', fontWeight: 600, fontSize: 16 }}>Bun</div>
              <div style={{ color: '#a1a1aa', fontSize: 11, marginTop: 4 }}>React · RSC · SSR</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section style={{
        padding: '80px 24px 120px',
        maxWidth: 700,
        margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            marginBottom: 16,
          }}>
            Up and running in minutes
          </h2>
        </div>

        {steps.map((s, i) => (
          <div key={s.step} style={{ marginBottom: i < steps.length - 1 ? 32 : 0 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 12,
            }}>
              <span style={{
                fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace",
                fontSize: 12,
                fontWeight: 600,
                color: '#f59e0b',
                background: 'rgba(245,158,11,0.08)',
                padding: '2px 10px',
                borderRadius: 6,
              }}>
                {s.step}
              </span>
              <span style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: 16,
                fontWeight: 600,
                color: '#fafafa',
              }}>
                {s.title}
              </span>
            </div>
            <CodeBlock language={s.step === '03' ? 'php' : s.step === '02' ? 'tsx' : 'bash'}>
              {s.code}
            </CodeBlock>
          </div>
        ))}
      </section>
    </div>
  );
}
