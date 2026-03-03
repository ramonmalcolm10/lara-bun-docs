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

export default function DocsServerActions() {
  return (
    <div>
      <h1 style={s.h1}>Server Actions</h1>
      <p style={s.p}>
        Server Actions let client components call PHP-backed functions. Mark a file with <span style={s.mono}>"use server"</span> and its exported functions become callable from the browser — routed through Bun back to PHP.
      </p>

      <h2 style={s.h2}>Two Approaches</h2>

      <div style={s.box}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <p style={{ color: '#a78bfa', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>PHP Actions</p>
            <p style={{ color: '#a1a1aa', fontSize: 13, lineHeight: 1.7 }}>
              Create classes in <span style={s.mono}>app/Rsc/Actions/</span>. Auto-discovered by convention — the build script generates JS stubs.
            </p>
          </div>
          <div>
            <p style={{ color: '#22d3ee', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>JS Actions</p>
            <p style={{ color: '#a1a1aa', fontSize: 13, lineHeight: 1.7 }}>
              Write <span style={s.mono}>"use server"</span> files in <span style={s.mono}>resources/js/rsc/</span> that call <span style={s.mono}>php()</span> internally. Run in Bun.
            </p>
          </div>
        </div>
      </div>

      <h2 style={s.h2}>PHP Actions</h2>

      <p style={s.p}>
        <strong style={{ color: '#fafafa' }}>1.</strong> Create a class in <span style={s.mono}>app/Rsc/Actions/</span>:
      </p>
      <CodeBlock language="php" title="app/Rsc/Actions/CreatePost.php">
        {`<?php

namespace App\\Rsc\\Actions;

use App\\Models\\Post;
use Illuminate\\Support\\Facades\\Auth;

class CreatePost
{
    public function __invoke(string $title, string $body): array
    {
        $post = Post::create([
            'user_id' => Auth::id(),
            'title' => $title,
            'body' => $body,
        ]);

        return $post->toArray();
    }
}`}
      </CodeBlock>

      <p style={s.p}>
        That's it — no config needed. Classes in <span style={s.mono}>app/Rsc/Actions/</span> are auto-discovered. The naming convention:
      </p>
      <div style={s.box}>
        <div style={{ fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace", fontSize: 13, lineHeight: 2, color: '#d4d4d8' }}>
          <div><span style={{ color: '#a1a1aa' }}>Invokable class:</span> <span style={{ color: '#c084fc' }}>CreatePost</span>::__invoke() → <span style={{ color: '#86efac' }}>createPost</span></div>
          <div><span style={{ color: '#a1a1aa' }}>Multi-method:</span> <span style={{ color: '#c084fc' }}>TodoActions</span>::add() → <span style={{ color: '#86efac' }}>todoActionsAdd</span></div>
          <div><span style={{ color: '#a1a1aa' }}>Multi-method:</span> <span style={{ color: '#c084fc' }}>TodoActions</span>::delete() → <span style={{ color: '#86efac' }}>todoActionsDelete</span></div>
          <div><span style={{ color: '#a1a1aa' }}>Callable suffix stripped:</span> <span style={{ color: '#c084fc' }}>AddTodoCallable</span>::__invoke() → <span style={{ color: '#86efac' }}>addTodo</span></div>
        </div>
      </div>

      <p style={s.p}>
        <strong style={{ color: '#fafafa' }}>2.</strong> Run the build — the generated <span style={s.mono}>server-actions.generated.ts</span> provides typed stubs. Import and call from a client component:
      </p>
      <CodeBlock language="tsx">
        {`"use client";

import { createPost } from './server-actions.generated';

export default function NewPostForm() {
  async function handleSubmit(formData: FormData) {
    const post = await createPost(
      formData.get('title'),
      formData.get('body')
    );
    console.log('Created:', post);
  }

  return (
    <form action={handleSubmit}>
      <input name="title" />
      <textarea name="body" />
      <button type="submit">Create Post</button>
    </form>
  );
}`}
      </CodeBlock>

      <h2 style={s.h2}>JS Actions</h2>
      <p style={s.p}>
        Create a <span style={s.mono}>"use server"</span> file with exported async functions. These run in Bun and can call <span style={s.mono}>php()</span> to reach Laravel:
      </p>
      <CodeBlock language="tsx" title="resources/js/rsc/app/todos/actions.ts">
        {`"use server";

export async function createPost(title: string, body: string) {
  return await php('CreatePost', title, body);
}

export async function deletePost(id: number) {
  return await php('DeletePost', id);
}`}
      </CodeBlock>

      <h2 style={s.h2}>How Actions Work</h2>
      <ol style={{ listStyle: 'none', paddingLeft: 0 }}>
        {[
          'Client component calls the action function',
          'Arguments are serialized using React\'s Flight format',
          'Browser sends a POST to /_rsc/action with the action ID and encoded args',
          'Bun receives the request, decodes the args, and executes the action',
          'The action calls php() which routes to Laravel via the callback socket',
          'Result is serialized as a Flight payload and streamed back to the browser',
        ].map((text, i) => (
          <li key={i} style={{ color: '#d4d4d8', fontSize: 15, lineHeight: 1.8, marginBottom: 8, paddingLeft: 8 }}>
            <span style={{ color: '#f59e0b', fontFamily: "ui-monospace, 'Fira Code', monospace", fontSize: 12, marginRight: 8 }}>{i + 1}.</span>
            {text}
          </li>
        ))}
      </ol>

      <h2 style={s.h2}>Error Handling</h2>
      <p style={s.p}>
        When a PHP callable throws a <span style={s.mono}>ValidationException</span>, LaraBun returns a <span style={s.mono}>422</span> response. The client receives a <span style={s.mono}>ServerValidationError</span> with structured error messages. See <Link href="/docs/validation" style={s.accent}>Validation</Link> for details.
      </p>

      <hr style={s.hr} />
      <p style={s.p}>
        Next: <Link href="/docs/validation" style={s.accent}>Validation →</Link>
      </p>
    </div>
  );
}
