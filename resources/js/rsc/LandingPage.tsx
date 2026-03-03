import Link from 'lara-bun/Link';
import CodeBlock from './CodeBlock';

const f = {
  display: "'Bricolage Grotesque', sans-serif",
  body: "'Outfit', system-ui, sans-serif",
  mono: "ui-monospace, 'Fira Code', 'Cascadia Code', monospace",
};

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section style={{
        padding: '100px 24px 0',
        maxWidth: 960,
        margin: '0 auto',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontFamily: f.display,
          fontSize: 'clamp(52px, 8vw, 96px)',
          fontWeight: 800,
          lineHeight: 0.92,
          letterSpacing: '-0.05em',
          color: '#fafafa',
          marginBottom: 28,
          animation: 'fadeInUp 0.6s ease-out both',
        }}>
          LaraBun
        </h1>

        <p style={{
          fontFamily: f.body,
          fontSize: 'clamp(17px, 2.2vw, 21px)',
          fontWeight: 300,
          color: '#71717a',
          lineHeight: 1.6,
          maxWidth: 520,
          margin: '0 auto 56px',
          animation: 'fadeInUp 0.6s ease-out 0.1s both',
        }}>
          A bridge between PHP and Bun for React Server Components,
          streaming, and server actions in Laravel.
        </p>

        {/* The pitch: two code blocks side by side */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          textAlign: 'left',
          marginBottom: 48,
          animation: 'fadeInUp 0.6s ease-out 0.2s both',
        }}>
          <CodeBlock language="tsx" title="resources/js/rsc/app/page.tsx">
            {`export default async function Home() {
  const posts = await php('Posts.latest');

  return (
    <main>
      <h1>Recent posts</h1>
      {posts.map(p => (
        <article key={p.id}>
          <h2>{p.title}</h2>
          <p>{p.excerpt}</p>
        </article>
      ))}
    </main>
  );
}`}
          </CodeBlock>

          <CodeBlock language="php" title="app/Rsc/Posts.php">
            {`<?php

namespace App\\Rsc;

use App\\Models\\Post;

class Posts
{
    public function latest(): array
    {
        return Post::with('author')
            ->published()
            ->latest()
            ->take(10)
            ->get()
            ->toArray();
    }
}`}
          </CodeBlock>
        </div>

        {/* Install + CTAs */}
        <div style={{
          animation: 'fadeInUp 0.6s ease-out 0.3s both',
          marginBottom: 48,
        }}>
          <div style={{
            fontFamily: f.mono,
            fontSize: 13,
            color: '#71717a',
            marginBottom: 24,
          }}>
            <span style={{ userSelect: 'none' }}>$ </span>
            <span style={{ color: '#d4d4d8' }}>composer require ramonmalcolm10/lara-bun</span>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/docs/installation"
              prefetch="hover"
              style={{
                fontFamily: f.body,
                fontWeight: 600,
                fontSize: 14,
                padding: '10px 22px',
                background: '#fafafa',
                color: '#09090b',
                borderRadius: 6,
              }}
            >
              Documentation
            </Link>
            <a
              href="https://github.com/ramonmalcolm10/lara-bun"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: f.body,
                fontWeight: 500,
                fontSize: 14,
                padding: '10px 22px',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#d4d4d8',
                borderRadius: 6,
              }}
            >
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Features — cards with icons */}
      <section style={{
        maxWidth: 960,
        margin: '0 auto',
        padding: '48px 24px 64px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
        }}>
          {([
            ['📁', 'File-based routing', 'page.tsx becomes a route. layout.tsx wraps it. Nested layouts compose automatically. No manual route config needed.'],
            ['🌊', 'Streaming HTML', 'Suspense boundaries stream progressively over the wire. The shell ships instantly, data fills in as it resolves.'],
            ['🐘', 'PHP callables', 'Call Eloquent queries, run gate checks, access sessions and auth — all from inside your JSX server components.'],
            ['⚡', 'Server actions', '"use server" functions route form mutations through Bun back to PHP. Type-safe, no API layer to maintain.'],
            ['📦', 'Static generation', 'Pages without dynamic segments are automatically static. Add route.php with staticPaths() for parameterized routes.'],
            ['🔌', 'Unix socket bridge', 'Binary frame protocol over a unix socket. Sub-millisecond PHP ↔ Bun communication with zero network overhead.'],
          ] as [string, string, string][]).map(([icon, title, desc]) => (
            <div key={title} style={{
              background: '#18181b',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 8,
              padding: '20px 20px 24px',
            }}>
              <div style={{
                fontSize: 20,
                marginBottom: 12,
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.04)',
                borderRadius: 8,
              }}>
                {icon}
              </div>
              <div style={{
                fontFamily: f.display,
                fontSize: 15,
                fontWeight: 600,
                color: '#e4e4e7',
                marginBottom: 8,
              }}>
                {title}
              </div>
              <div style={{
                fontFamily: f.body,
                fontSize: 13,
                fontWeight: 300,
                color: '#a1a1aa',
                lineHeight: 1.6,
              }}>
                {desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* File-based routing */}
      <section style={{
        maxWidth: 960,
        margin: '0 auto',
        padding: '64px 24px 80px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <h2 style={{
          fontFamily: f.display,
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: '-0.03em',
          color: '#fafafa',
          marginBottom: 8,
        }}>
          File-based routing
        </h2>
        <p style={{
          fontFamily: f.body,
          fontSize: 15,
          fontWeight: 300,
          color: '#a1a1aa',
          marginBottom: 40,
          maxWidth: 480,
        }}>
          Next.js App Router conventions. Pages and layouts are auto-discovered.
          Static pages detected automatically.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
        }}>
          {/* Directory tree */}
          <div style={{
            background: '#18181b',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 8,
            padding: '20px 24px',
            fontFamily: f.mono,
            fontSize: 13,
            lineHeight: 2,
            color: '#a1a1aa',
          }}>
            <div style={{ color: '#a1a1aa', marginBottom: 4 }}>resources/js/rsc/app/</div>
            <div><span style={{ color: '#e4e4e7' }}>layout.tsx</span></div>
            <div><span style={{ color: '#e4e4e7' }}>page.tsx</span> <span style={{ color: '#71717a' }}>&rarr;</span> <span style={{ color: '#fafafa' }}>/</span></div>
            <div style={{ color: '#a1a1aa' }}>about/</div>
            <div style={{ paddingLeft: 20 }}><span style={{ color: '#e4e4e7' }}>page.tsx</span> <span style={{ color: '#71717a' }}>&rarr;</span> <span style={{ color: '#fafafa' }}>/about</span></div>
            <div style={{ color: '#a1a1aa' }}>docs/</div>
            <div style={{ paddingLeft: 20 }}><span style={{ color: '#e4e4e7' }}>layout.tsx</span></div>
            <div style={{ paddingLeft: 20 }}><span style={{ color: '#e4e4e7' }}>page.tsx</span> <span style={{ color: '#71717a' }}>&rarr;</span> <span style={{ color: '#fafafa' }}>/docs</span></div>
            <div style={{ paddingLeft: 20, color: '#a1a1aa' }}>[slug]/</div>
            <div style={{ paddingLeft: 40 }}><span style={{ color: '#e4e4e7' }}>page.tsx</span> <span style={{ color: '#71717a' }}>&rarr;</span> <span style={{ color: '#fafafa' }}>/docs/{'{slug}'}</span></div>
            <div style={{ paddingLeft: 40 }}><span style={{ color: '#e4e4e7' }}>route.php</span></div>
          </div>

          <CodeBlock language="php" title="app/docs/[slug]/route.php">
            {`<?php

use RamonMalcolm\\LaraBun\\Rsc\\PageRoute;

return PageRoute::make()
    ->middleware(['auth', 'verified'])
    ->staticPaths(
        fn () => Post::pluck('slug')->all()
    )
    ->viewData(fn (string $slug) => [
        'title' => "Docs: $slug",
    ]);`}
          </CodeBlock>
        </div>
      </section>

      {/* Architecture diagram */}
      <section style={{
        maxWidth: 960,
        margin: '0 auto',
        padding: '64px 24px 56px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <h2 style={{
          fontFamily: f.display,
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: '-0.03em',
          color: '#fafafa',
          marginBottom: 8,
          textAlign: 'center',
        }}>
          How it works
        </h2>
        <p style={{
          fontFamily: f.body,
          fontSize: 15,
          fontWeight: 300,
          color: '#a1a1aa',
          marginBottom: 40,
          textAlign: 'center',
          maxWidth: 480,
          margin: '0 auto 40px',
        }}>
          Two runtimes, one unix socket. PHP handles your backend. Bun renders React.
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0,
        }}>
          {/* PHP box */}
          <div style={{
            background: '#18181b',
            border: '1px solid rgba(168,85,247,0.25)',
            borderRadius: 10,
            padding: '24px 28px',
            textAlign: 'center',
            minWidth: 200,
          }}>
            <div style={{
              fontFamily: f.mono,
              fontSize: 10,
              fontWeight: 500,
              color: '#a78bfa',
              letterSpacing: '0.1em',
              textTransform: 'uppercase' as const,
              marginBottom: 8,
            }}>
              Runtime
            </div>
            <div style={{
              fontFamily: f.display,
              fontSize: 22,
              fontWeight: 700,
              color: '#e4e4e7',
              marginBottom: 6,
            }}>
              PHP
            </div>
            <div style={{
              fontFamily: f.body,
              fontSize: 12,
              color: '#a1a1aa',
              lineHeight: 1.5,
            }}>
              Laravel, Eloquent,<br />Sessions, Auth
            </div>
          </div>

          {/* Arrow left */}
          <div style={{
            fontFamily: f.mono,
            fontSize: 18,
            color: '#52525b',
            padding: '0 8px',
          }}>
            &larr;
          </div>

          {/* Unix socket box */}
          <div style={{
            background: '#18181b',
            border: '1px solid rgba(251,191,36,0.25)',
            borderRadius: 10,
            padding: '24px 28px',
            textAlign: 'center',
            minWidth: 180,
          }}>
            <div style={{
              fontFamily: f.mono,
              fontSize: 10,
              fontWeight: 500,
              color: '#fbbf24',
              letterSpacing: '0.1em',
              textTransform: 'uppercase' as const,
              marginBottom: 8,
            }}>
              Bridge
            </div>
            <div style={{
              fontFamily: f.display,
              fontSize: 22,
              fontWeight: 700,
              color: '#e4e4e7',
              marginBottom: 6,
            }}>
              Unix Socket
            </div>
            <div style={{
              fontFamily: f.body,
              fontSize: 12,
              color: '#a1a1aa',
              lineHeight: 1.5,
            }}>
              Binary frame protocol,<br />sub-ms latency
            </div>
          </div>

          {/* Arrow right */}
          <div style={{
            fontFamily: f.mono,
            fontSize: 18,
            color: '#52525b',
            padding: '0 8px',
          }}>
            &rarr;
          </div>

          {/* Bun box */}
          <div style={{
            background: '#18181b',
            border: '1px solid rgba(34,211,238,0.25)',
            borderRadius: 10,
            padding: '24px 28px',
            textAlign: 'center',
            minWidth: 200,
          }}>
            <div style={{
              fontFamily: f.mono,
              fontSize: 10,
              fontWeight: 500,
              color: '#22d3ee',
              letterSpacing: '0.1em',
              textTransform: 'uppercase' as const,
              marginBottom: 8,
            }}>
              Runtime
            </div>
            <div style={{
              fontFamily: f.display,
              fontSize: 22,
              fontWeight: 700,
              color: '#e4e4e7',
              marginBottom: 6,
            }}>
              Bun
            </div>
            <div style={{
              fontFamily: f.body,
              fontSize: 12,
              color: '#a1a1aa',
              lineHeight: 1.5,
            }}>
              React Server Components,<br />SSR, Streaming
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{
        maxWidth: 960,
        margin: '0 auto',
        padding: '56px 24px 120px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        textAlign: 'center',
      }}>
        <Link
          href="/docs/installation"
          prefetch="hover"
          style={{
            fontFamily: f.body,
            fontWeight: 500,
            fontSize: 15,
            color: '#d4d4d8',
            borderBottom: '1px solid #71717a',
            paddingBottom: 2,
          }}
        >
          Read the docs &rarr;
        </Link>
      </section>
    </div>
  );
}
