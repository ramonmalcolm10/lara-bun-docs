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

export default function DocsValidation() {
  return (
    <div>
      <h1 style={s.h1}>Validation</h1>
      <p style={s.p}>
        LaraBun integrates with Laravel's validation system. When a PHP callable throws a <span style={s.mono}>ValidationException</span>, the error is surfaced as a structured <span style={s.mono}>ServerValidationError</span> in your React components.
      </p>

      <h2 style={s.h2}>The Flow</h2>
      <div style={s.box}>
        <div style={{
          fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace",
          fontSize: 13,
          color: '#a1a1aa',
          lineHeight: 2.2,
        }}>
          <div>Client calls server action</div>
          <div style={{ paddingLeft: 16 }}>→ Bun routes to PHP via callback socket</div>
          <div style={{ paddingLeft: 16 }}>→ PHP throws <span style={{ color: '#f97316' }}>ValidationException</span></div>
          <div style={{ paddingLeft: 16 }}>→ LaraBun catches it, returns <span style={{ color: '#f97316' }}>422</span> with error bag</div>
          <div>→ Client receives <span style={{ color: '#f97316' }}>ServerValidationError</span></div>
        </div>
      </div>

      <h2 style={s.h2}>PHP Side</h2>
      <p style={s.p}>
        Use Laravel's validation as usual inside your callable:
      </p>
      <CodeBlock language="php" title="app/Rsc/Actions/CreatePost.php">
        {`<?php

namespace App\\Rsc\\Actions;

use Illuminate\\Support\\Facades\\Validator;

class CreatePost
{
    public function __invoke(string $title, string $body): array
    {
        $validated = Validator::validate([
            'title' => $title,
            'body' => $body,
        ], [
            'title' => ['required', 'min:3', 'max:255'],
            'body' => ['required', 'min:10'],
        ]);

        return Post::create($validated)->toArray();
    }
}`}
      </CodeBlock>

      <h2 style={s.h2}>React Side</h2>
      <p style={s.p}>
        Catch the <span style={s.mono}>ServerValidationError</span> in your client component:
      </p>
      <CodeBlock language="tsx">
        {`"use client";

import { useState } from 'react';
import { ServerValidationError } from 'lara-bun/router';
import { createPost } from './server-actions.generated';

export default function PostForm() {
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(formData: FormData) {
    try {
      setErrors({});
      await createPost(
        formData.get('title') as string,
        formData.get('body') as string,
      );
    } catch (error) {
      if (error instanceof ServerValidationError) {
        setErrors(error.errors);
        // error.errors = { title: ['Too short'], body: ['Required'] }
      }
    }
  }

  return (
    <form action={handleSubmit}>
      <div>
        <input name="title" />
        {errors.title?.map((msg) => (
          <p key={msg} style={{ color: 'red' }}>{msg}</p>
        ))}
      </div>
      <div>
        <textarea name="body" />
        {errors.body?.map((msg) => (
          <p key={msg} style={{ color: 'red' }}>{msg}</p>
        ))}
      </div>
      <button type="submit">Create</button>
    </form>
  );
}`}
      </CodeBlock>

      <h2 style={s.h2}>ServerValidationError</h2>
      <p style={s.p}>
        The <span style={s.mono}>ServerValidationError</span> class extends <span style={s.mono}>Error</span> and provides:
      </p>
      <div style={s.box}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 13, fontWeight: 600, color: '#fafafa', fontFamily: "ui-monospace, 'Fira Code', monospace" }}>Property</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 13, fontWeight: 600, color: '#fafafa' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 13, fontWeight: 600, color: '#fafafa' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13, color: '#f59e0b', fontFamily: "ui-monospace, 'Fira Code', monospace" }}>errors</td>
              <td style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13, color: '#a1a1aa', fontFamily: "ui-monospace, 'Fira Code', monospace" }}>{`Record<string, string[]>`}</td>
              <td style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 14, color: '#a1a1aa' }}>Field-keyed error messages from Laravel</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 12px', fontSize: 13, color: '#f59e0b', fontFamily: "ui-monospace, 'Fira Code', monospace" }}>message</td>
              <td style={{ padding: '8px 12px', fontSize: 13, color: '#a1a1aa', fontFamily: "ui-monospace, 'Fira Code', monospace" }}>string</td>
              <td style={{ padding: '8px 12px', fontSize: 14, color: '#a1a1aa' }}>Summary message from the exception</td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr style={s.hr} />
      <p style={s.p}>
        Next: <Link href="/docs/static-generation" style={s.accent}>Static Generation →</Link>
      </p>
    </div>
  );
}
