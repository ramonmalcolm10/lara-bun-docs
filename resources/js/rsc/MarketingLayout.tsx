import NavBar from './NavBar';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavBar />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '40px 24px',
        textAlign: 'center',
        color: '#9a9aa2',
        fontFamily: "'Outfit', sans-serif",
        fontSize: '14px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 12,
          }}>
            <span style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 700,
              fontSize: '16px',
              color: '#fafafa',
            }}>LaraBun</span>
            <span style={{ color: '#85858d' }}>·</span>
            <span>Laravel + Bun, unified</span>
          </div>
          <p style={{ color: '#85858d', fontSize: '13px' }}>
            Built with LaraBun RSC
          </p>
        </div>
      </footer>
    </div>
  );
}
