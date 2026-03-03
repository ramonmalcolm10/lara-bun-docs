import CodeBlock from './CodeBlock';
import Link from 'lara-bun/Link';

const s = {
  h1: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12 } as const,
  h2: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', marginTop: 48, marginBottom: 12 } as const,
  p: { color: '#d4d4d8', fontSize: 15, lineHeight: 1.8, marginBottom: 16 } as const,
  mono: { fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace", fontSize: 13, background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 4, color: '#e4e4e7' } as const,
  hr: { border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '40px 0' } as const,
  accent: { color: '#f59e0b' } as const,
  box: { background: '#18181b', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: 24, marginBottom: 20 } as const,
};

export default function DocsPhpCallables() {
  return (
    <div>
      <h1 style={s.h1}>PHP Callables</h1>
      <p style={s.p}>
        PHP Callables let your React server components call PHP functions during render. Query Eloquent models, check policies, run business logic — all from JSX.
      </p>

      <h2 style={s.h2}>How It Works</h2>
      <p style={s.p}>
        During a render, the <span style={s.mono}>php()</span> function sends a callback message from Bun back to PHP over a temporary Unix socket. PHP executes the callable, serializes the result, and sends it back. Bun awaits the response and continues rendering.
      </p>

      <h2 style={s.h2}>Creating a Callable</h2>
      <p style={s.p}>
        A callable is any PHP class with an <span style={s.mono}>__invoke()</span> method:
      </p>
      <CodeBlock language="php" title="app/RSC/GetUser.php">
        {`<?php

namespace App\\RSC;

use App\\Models\\User;

class GetUser
{
    public function __invoke(int $id): array
    {
        $user = User::findOrFail($id);

        return [
            'name' => $user->name,
            'email' => $user->email,
            'avatar' => $user->avatar_url,
        ];
    }
}`}
      </CodeBlock>

      <h2 style={s.h2}>Auto-Discovery</h2>
      <p style={s.p}>
        Classes in <span style={s.mono}>app/RSC/</span> are auto-discovered by convention — no registration needed. The callable name matches the class name:
      </p>
      <div style={s.box}>
        <div style={{ fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace", fontSize: 13, lineHeight: 2, color: '#d4d4d8' }}>
          <div><span style={{ color: '#c084fc' }}>GetUser</span>.php → <span style={{ color: '#86efac' }}>php('GetUser', ...)</span></div>
          <div><span style={{ color: '#c084fc' }}>ListPosts</span>.php → <span style={{ color: '#86efac' }}>php('ListPosts', ...)</span></div>
          <div><span style={{ color: '#a1a1aa' }}>Multi-method:</span> <span style={{ color: '#c084fc' }}>Posts</span>::latest() → <span style={{ color: '#86efac' }}>php('Posts.latest')</span></div>
        </div>
      </div>

      <h2 style={s.h2}>Calling from React</h2>
      <p style={s.p}>
        In a server component, use the global <span style={s.mono}>php()</span> function:
      </p>
      <CodeBlock language="tsx" title="resources/js/rsc/UserCard.tsx">
        {`interface User {
  name: string;
  email: string;
  avatar: string;
}

export default async function UserCard({ userId }: { userId: number }) {
  const user = await php<User>('GetUser', userId);

  return (
    <div>
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}`}
      </CodeBlock>

      <div style={{
        ...s.box,
        borderColor: 'rgba(245,158,11,0.2)',
        background: 'rgba(245,158,11,0.04)',
      }}>
        <p style={{ color: '#f59e0b', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
          Important
        </p>
        <p style={{ color: '#a1a1aa', fontSize: 14, lineHeight: 1.7, marginBottom: 0 }}>
          The <span style={s.mono}>php()</span> function is only available in server components during render. It cannot be called from client components or event handlers — use <Link href="/docs/server-actions" style={s.accent}>Server Actions</Link> for those cases.
        </p>
      </div>

      <h2 style={s.h2}>Dependency Injection</h2>
      <p style={s.p}>
        Callable classes are resolved through Laravel's service container, so you can type-hint dependencies in the constructor:
      </p>
      <CodeBlock language="php">
        {`class GetUserPosts
{
    public function __construct(
        private PostRepository $posts,
    ) {}

    public function __invoke(int $userId, int $limit = 10): array
    {
        return $this->posts
            ->forUser($userId)
            ->latest()
            ->take($limit)
            ->toArray();
    }
}`}
      </CodeBlock>

      <h2 style={s.h2}>Timeout</h2>
      <p style={s.p}>
        Callables have a configurable timeout (default: 5 seconds). If PHP doesn't respond in time, the render throws an error. Configure it in <span style={s.mono}>config/bun.php</span>:
      </p>
      <CodeBlock language="php">
        {`'callback_timeout' => 10, // seconds`}
      </CodeBlock>

      <hr style={s.hr} />
      <p style={s.p}>
        Next: <Link href="/docs/server-actions" style={s.accent}>Server Actions →</Link>
      </p>
    </div>
  );
}
