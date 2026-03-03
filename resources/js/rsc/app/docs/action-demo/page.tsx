import Link from 'lara-bun/Link';
import CodeBlock from '../../../CodeBlock';
import TodoDemo from './TodoDemo';

const s = {
  h1: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12 } as const,
  h2: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', marginTop: 48, marginBottom: 12 } as const,
  p: { color: '#d4d4d8', fontSize: 15, lineHeight: 1.8, marginBottom: 16 } as const,
  mono: { fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace", fontSize: 13, background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 4, color: '#e4e4e7' } as const,
  hr: { border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '40px 0' } as const,
  accent: { color: '#f59e0b' } as const,
  box: { background: '#18181b', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: 24, marginBottom: 20 } as const,
};

export default async function ActionDemoPage() {
  const sessionId = await php<string>("Todos.generate");
  const todos = await php<{ id: string; title: string; done: boolean }[]>("Todos.list", sessionId);

  return (
    <div>
      <h1 style={s.h1}>Server Actions Demo</h1>
      <p style={s.p}>
        A live todo list powered by auto-generated server actions. PHP classes in <span style={s.mono}>app/Rsc/Actions/</span> are discovered at build time and exposed as typed JS functions. The client imports them from <span style={s.mono}>server-actions.generated.ts</span> and calls them like regular async functions.
      </p>
      <p style={{ ...s.p, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 8, padding: '12px 16px', fontSize: 13 }}>
        <strong style={{ color: '#f59e0b' }}>Note:</strong>{' '}
        <span style={{ color: '#d4d4d8' }}>
          Each page load gets a unique session ID from PHP. Todos are stored in Laravel's cache — they persist across actions but reset on page reload.
        </span>
      </p>

      <h2 style={s.h2}>Try It</h2>
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.06)',
        padding: 24,
        marginBottom: 24,
      }}>
        <TodoDemo sessionId={sessionId} initial={todos} />
      </div>

      <h2 style={s.h2}>How It Works</h2>
      <div style={s.box}>
        <div style={{
          fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace",
          fontSize: 13,
          color: '#a1a1aa',
          lineHeight: 2.2,
        }}>
          <div>1. Server component generates a <span style={{ color: '#f97316' }}>random UUID</span> as session key</div>
          <div>2. Client component calls <span style={{ color: '#f97316' }}>todoActionsAdd(sessionId, title)</span></div>
          <div style={{ paddingLeft: 16 }}>→ React serializes args via Flight protocol</div>
          <div style={{ paddingLeft: 16 }}>→ Browser POSTs to <span style={{ color: '#f97316' }}>/_rsc/action</span></div>
          <div style={{ paddingLeft: 16 }}>→ Bun calls <span style={{ color: '#f97316' }}>php("TodoActions.add", ...)</span> → Laravel</div>
          <div style={{ paddingLeft: 16 }}>→ Updated todo list streamed back as Flight payload</div>
          <div>3. React updates the UI with the server response</div>
        </div>
      </div>

      <h2 style={s.h2}>The Code</h2>
      <p style={s.p}>
        <strong style={{ color: '#fafafa' }}>Reads</strong> — the server component calls <span style={s.mono}>php()</span> directly as a callable:
      </p>
      <CodeBlock language="tsx" title="page.tsx (server component)">
{`const sessionId = await php<string>("Todos.generate");
const todos = await php<Todo[]>("Todos.list", sessionId);`}
      </CodeBlock>
      <p style={s.p}>
        <strong style={{ color: '#fafafa' }}>Mutations</strong> — PHP class in <span style={s.mono}>app/Rsc/Actions/</span>, auto-generated as JS at build time:
      </p>
      <CodeBlock language="php" title="app/Rsc/Actions/TodoActions.php">
{`class TodoActions
{
    public function add(string $sessionId, string $title): array { ... }
    public function toggle(string $sessionId, string $todoId): array { ... }
    public function delete(string $sessionId, string $todoId): array { ... }
}`}
      </CodeBlock>
      <CodeBlock language="tsx" title="Client component imports">
{`import { todoActionsAdd, todoActionsToggle, todoActionsDelete }
  from './server-actions.generated';`}
      </CodeBlock>

      <hr style={s.hr} />
      <p style={s.p}>
        Back to: <Link href="/docs/server-actions" style={s.accent}>Server Actions</Link>
      </p>
    </div>
  );
}
