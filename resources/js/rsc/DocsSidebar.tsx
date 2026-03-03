"use client";

import Link from 'lara-bun/Link';
import { usePathname } from 'lara-bun/usePathname';

interface NavItem {
  label: string;
  slug: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const sections: NavSection[] = [
  {
    title: 'Getting Started',
    items: [
      { label: 'Installation', slug: 'installation' },
      { label: 'Configuration', slug: 'configuration' },
      { label: 'How It Works', slug: 'how-it-works' },
    ],
  },
  {
    title: 'Features',
    items: [
      { label: 'Inertia SSR', slug: 'inertia-ssr' },
      { label: 'RSC & File-Based Routing', slug: 'rsc' },
      { label: 'PHP Callables', slug: 'php-callables' },
      { label: 'Server Actions', slug: 'server-actions' },
    ],
  },
  {
    title: 'Advanced',
    items: [
      { label: 'Validation', slug: 'validation' },
      { label: 'Static Generation', slug: 'static-generation' },
      { label: 'Deployment', slug: 'deployment' },
      { label: 'Suspense Demo', slug: 'suspense-demo' },
    ],
  },
];

export default function DocsSidebar() {
  const pathname = usePathname();

  return (
    <nav>
      {sections.map((section) => (
        <div key={section.title} style={{ marginBottom: 28 }}>
          <h4 style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#9a9aa2',
            marginBottom: 8,
            padding: '0 12px',
          }}>
            {section.title}
          </h4>
          <ul style={{ listStyle: 'none' }}>
            {section.items.map((item) => {
              const href = `/docs/${item.slug}`;
              const isActive = pathname === href;

              return (
                <li key={item.slug}>
                  <Link
                    href={href}
                    prefetch="hover"
                    style={{
                      display: 'block',
                      padding: '6px 12px',
                      borderRadius: 6,
                      fontSize: 14,
                      fontWeight: isActive ? 500 : 400,
                      color: isActive ? '#f59e0b' : '#a1a1aa',
                      background: isActive ? 'rgba(245,158,11,0.08)' : 'transparent',
                      transition: 'all 0.15s',
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
