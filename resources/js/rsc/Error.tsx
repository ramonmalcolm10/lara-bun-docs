import Link from 'lara-bun/Link';

const titles: Record<number, string> = {
  403: 'Forbidden',
  404: 'Page Not Found',
  419: 'Session Expired',
  500: 'Server Error',
};

const descriptions: Record<number, string> = {
  403: "You don't have permission to access this page.",
  404: "The page you're looking for doesn't exist.",
  419: 'Your session has expired. Please refresh and try again.',
  500: 'Something went wrong on our end.',
};

const f = {
  display: "'Bricolage Grotesque', sans-serif",
  body: "'Outfit', system-ui, sans-serif",
};

export default function Error({ status }: { status: number }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: f.body,
      background: '#09090b',
      color: '#fafafa',
    }}>
      <div style={{ textAlign: 'center', padding: 24 }}>
        <p style={{
          fontFamily: f.display,
          fontSize: 120,
          fontWeight: 800,
          lineHeight: 1,
          margin: 0,
          background: 'linear-gradient(135deg, #818cf8, #a78bfa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          {status}
        </p>
        <h1 style={{
          fontFamily: f.display,
          fontSize: 28,
          fontWeight: 700,
          margin: '16px 0 8px',
        }}>
          {titles[status] ?? 'Error'}
        </h1>
        <p style={{ color: '#a1a1aa', fontSize: 16, margin: '0 0 32px' }}>
          {descriptions[status] ?? 'An unexpected error occurred.'}
        </p>
        <Link href="/" style={{
          display: 'inline-block',
          padding: '10px 24px',
          borderRadius: 8,
          background: 'rgba(255,255,255,0.08)',
          color: '#fafafa',
          textDecoration: 'none',
          fontSize: 14,
          fontWeight: 500,
          border: '1px solid rgba(255,255,255,0.1)',
          transition: 'background 0.15s',
        }}>
          Go Home
        </Link>
      </div>
    </div>
  );
}
