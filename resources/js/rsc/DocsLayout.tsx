import DocsSidebar from './DocsSidebar';
import MobileMenu from './MobileMenu';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <MobileMenu />
      <div style={{
        display: 'flex',
        flex: 1,
        maxWidth: 1400,
        margin: '0 auto',
        width: '100%',
        padding: '0 24px',
      }}>
        {/* Sidebar — hidden on mobile via MobileMenu */}
        <aside className="docs-sidebar" style={{
          width: 280,
          flexShrink: 0,
          borderRight: '1px solid rgba(255,255,255,0.06)',
          paddingTop: 32,
          paddingRight: 24,
          paddingBottom: 48,
          position: 'sticky',
          top: 64,
          height: 'calc(100vh - 64px)',
          overflowY: 'auto',
        }}>
          <DocsSidebar />
        </aside>

        {/* Content */}
        <article className="docs-content" style={{
          flex: 1,
          minWidth: 0,
          padding: '32px 0 80px 48px',
          maxWidth: 800,
        }}>
          {children}
        </article>
      </div>
    </div>
  );
}
