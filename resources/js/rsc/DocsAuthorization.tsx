import CodeBlock from './CodeBlock';
import Link from 'lara-bun/Link';

const s = {
  h1: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12 } as const,
  h2: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', marginTop: 48, marginBottom: 12 } as const,
  h3: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em', marginTop: 32, marginBottom: 8 } as const,
  p: { color: '#d4d4d8', fontSize: 15, lineHeight: 1.8, marginBottom: 16 } as const,
  mono: { fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace", fontSize: 13, background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 4, color: '#e4e4e7' } as const,
  hr: { border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '40px 0' } as const,
  accent: { color: '#f59e0b' } as const,
  box: { background: '#18181b', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: 24, marginBottom: 20 } as const,
};

export default function DocsAuthorization() {
  return (
    <div>
      <h1 style={s.h1}>Authorization</h1>
      <p style={s.p}>
        Server actions go through a single <span style={s.mono}>POST /_rsc/action</span> endpoint.
        Page-level middleware like <span style={s.mono}>auth</span> or <span style={s.mono}>can</span> doesn't
        apply to action calls. LaraBun provides PHP attributes to declare authorization requirements
        directly on your action classes and methods.
      </p>

      <h2 style={s.h2}>Available Attributes</h2>

      <div style={s.box}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 13, fontWeight: 600, color: '#fafafa', fontFamily: "ui-monospace, 'Fira Code', monospace" }}>Attribute</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 13, fontWeight: 600, color: '#fafafa' }}>Effect</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 13, fontWeight: 600, color: '#fafafa' }}>HTTP Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13, color: '#f59e0b', fontFamily: "ui-monospace, 'Fira Code', monospace" }}>#[Authenticated]</td>
              <td style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 14, color: '#a1a1aa' }}>Requires an authenticated user</td>
              <td style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 14, color: '#a1a1aa' }}>401</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13, color: '#f59e0b', fontFamily: "ui-monospace, 'Fira Code', monospace" }}>#[Can]</td>
              <td style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 14, color: '#a1a1aa' }}>Checks a gate/policy ability</td>
              <td style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 14, color: '#a1a1aa' }}>403</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 12px', fontSize: 13, color: '#f59e0b', fontFamily: "ui-monospace, 'Fira Code', monospace" }}>#[Middleware]</td>
              <td style={{ padding: '8px 12px', fontSize: 14, color: '#a1a1aa' }}>Runs Laravel middleware</td>
              <td style={{ padding: '8px 12px', fontSize: 14, color: '#a1a1aa' }}>Depends on middleware</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p style={s.p}>
        Attributes can be placed on the <strong style={{ color: '#fafafa' }}>class</strong> (applies to all methods) or on individual <strong style={{ color: '#fafafa' }}>methods</strong>. When both are present, they combine.
      </p>

      <h2 style={s.h2}>#[Authenticated]</h2>
      <p style={s.p}>
        The simplest attribute — checks that the current request has an authenticated user. If not, the action returns a <span style={s.mono}>401</span> response.
      </p>
      <CodeBlock language="php" title="app/Rsc/Actions/TodoActions.php">
        {`<?php

namespace App\\Rsc\\Actions;

use LaraBun\\Rsc\\Attributes\\Authenticated;

#[Authenticated]
class TodoActions
{
    public function add(string $title): array
    {
        // All methods require authentication
        return Todo::create(['title' => $title])->toArray();
    }

    public function list(): array
    {
        return Todo::all()->toArray();
    }
}`}
      </CodeBlock>

      <p style={s.p}>
        You can specify a guard if the default isn't what you need:
      </p>
      <CodeBlock language="php">
        {`#[Authenticated('sanctum')]
class ApiActions
{
    // ...
}`}
      </CodeBlock>

      <h2 style={s.h2}>#[Can]</h2>
      <p style={s.p}>
        Runs a Laravel Gate authorization check. If it fails, the action returns a <span style={s.mono}>403</span> response. This uses <span style={s.mono}>Gate::authorize()</span> under the hood, so your policies and gates work as expected.
      </p>
      <CodeBlock language="php" title="app/Rsc/Actions/TodoActions.php">
        {`<?php

namespace App\\Rsc\\Actions;

use App\\Models\\Todo;
use LaraBun\\Rsc\\Attributes\\Authenticated;
use LaraBun\\Rsc\\Attributes\\Can;

#[Authenticated]
class TodoActions
{
    public function add(string $title): array
    {
        return Todo::create(['title' => $title])->toArray();
    }

    #[Can('delete', Todo::class)]
    public function delete(string $id): array
    {
        Todo::findOrFail($id)->delete();

        return ['deleted' => $id];
    }
}`}
      </CodeBlock>

      <p style={s.p}>
        The <span style={s.mono}>#[Can]</span> attribute is repeatable — you can stack multiple checks on one method:
      </p>
      <CodeBlock language="php">
        {`#[Can('view', Post::class)]
#[Can('moderate')]
public function moderate(string $id): array
{
    // Must pass both gate checks
}`}
      </CodeBlock>

      <h2 style={s.h2}>#[Middleware]</h2>
      <p style={s.p}>
        Runs one or more Laravel middleware through the <span style={s.mono}>Pipeline</span>. This gives you the full power of Laravel's middleware system — rate limiting, auth guards, custom middleware, and anything else you'd use in a route definition.
      </p>
      <CodeBlock language="php" title="app/Rsc/Actions/AdminActions.php">
        {`<?php

namespace App\\Rsc\\Actions;

use LaraBun\\Rsc\\Attributes\\Middleware;

#[Middleware('auth:sanctum', 'verified')]
class AdminActions
{
    public function reset(): void
    {
        // Only verified sanctum-authenticated users
    }
}`}
      </CodeBlock>

      <p style={s.p}>
        You can combine <span style={s.mono}>#[Middleware]</span> with the other attributes freely:
      </p>
      <CodeBlock language="php">
        {`#[Middleware('throttle:60,1')]
#[Authenticated]
class RateLimitedActions
{
    #[Can('admin')]
    public function dangerousAction(): void
    {
        // Throttled + authenticated + admin gate check
    }
}`}
      </CodeBlock>

      <h2 style={s.h2}>Combining Class & Method Attributes</h2>
      <p style={s.p}>
        Class-level attributes apply to every method. Method-level attributes add to them. This means you can set a baseline on the class and add extra checks per-method:
      </p>
      <div style={s.box}>
        <div style={{
          fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace",
          fontSize: 13,
          color: '#a1a1aa',
          lineHeight: 2.2,
        }}>
          <div><span style={{ color: '#c084fc' }}>#[Authenticated]</span> on class</div>
          <div style={{ paddingLeft: 16 }}>→ <span style={{ color: '#86efac' }}>add()</span> checks <span style={{ color: '#f59e0b' }}>auth only</span></div>
          <div style={{ paddingLeft: 16 }}>→ <span style={{ color: '#86efac' }}>delete()</span> checks <span style={{ color: '#f59e0b' }}>auth + Can('delete')</span></div>
        </div>
      </div>

      <h2 style={s.h2}>Error Handling on the Client</h2>
      <p style={s.p}>
        <strong style={{ color: '#fafafa' }}>401 — Automatic redirect.</strong> When <span style={s.mono}>#[Authenticated]</span> fails, the client is automatically navigated to your <span style={s.mono}>login</span> named route. No client-side code needed.
      </p>
      <p style={s.p}>
        <strong style={{ color: '#fafafa' }}>403 — Error page.</strong> When <span style={s.mono}>#[Can]</span> fails, the <span style={s.mono}>AuthorizationException</span> propagates to Laravel's exception handler. Configure it in <span style={s.mono}>bootstrap/app.php</span> to render an RSC error page:
      </p>
      <CodeBlock language="php" title="bootstrap/app.php">
        {`$exceptions->respond(function ($response, $exception, $request) {
    if (in_array($response->getStatusCode(), [403, 404, 419, 500])) {
        return rsc('Error', ['status' => $response->getStatusCode()])
            ->status($response->getStatusCode())
            ->toResponse($request);
    }

    return $response;
});`}
      </CodeBlock>
      <p style={s.p}>
        The error page renders inline during SPA navigation — no full page reload. Create an <span style={s.mono}>Error</span> component that receives a <span style={s.mono}>status</span> prop:
      </p>
      <CodeBlock language="tsx" title="resources/js/rsc/Error.tsx">
        {`export default function Error({ status }: { status: number }) {
  const titles: Record<number, string> = {
    403: 'Forbidden',
    404: 'Not Found',
    419: 'Session Expired',
    500: 'Server Error',
  };

  return (
    <div>
      <h1>{status}</h1>
      <p>{titles[status] ?? 'Error'}</p>
    </div>
  );
}`}
      </CodeBlock>

      <h2 style={s.h2}>Closures Are Unaffected</h2>
      <p style={s.p}>
        Authorization attributes only apply to class-based callables. If you register a closure directly via the <span style={s.mono}>CallableRegistry</span>, attributes have no effect — closures are executed as-is.
      </p>

      <h2 style={s.h2}>Attribute Reference</h2>
      <div style={s.box}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 13, fontWeight: 600, color: '#fafafa', fontFamily: "ui-monospace, 'Fira Code', monospace" }}>Attribute</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 13, fontWeight: 600, color: '#fafafa' }}>Parameters</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 13, fontWeight: 600, color: '#fafafa' }}>Repeatable</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13, color: '#f59e0b', fontFamily: "ui-monospace, 'Fira Code', monospace" }}>#[Authenticated]</td>
              <td style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13, color: '#a1a1aa', fontFamily: "ui-monospace, 'Fira Code', monospace" }}>?string $guard = null</td>
              <td style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 14, color: '#a1a1aa' }}>No</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13, color: '#f59e0b', fontFamily: "ui-monospace, 'Fira Code', monospace" }}>#[Can]</td>
              <td style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13, color: '#a1a1aa', fontFamily: "ui-monospace, 'Fira Code', monospace" }}>string $ability, ?string $model = null</td>
              <td style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 14, color: '#a1a1aa' }}>Yes</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 12px', fontSize: 13, color: '#f59e0b', fontFamily: "ui-monospace, 'Fira Code', monospace" }}>#[Middleware]</td>
              <td style={{ padding: '8px 12px', fontSize: 13, color: '#a1a1aa', fontFamily: "ui-monospace, 'Fira Code', monospace" }}>string ...$middleware</td>
              <td style={{ padding: '8px 12px', fontSize: 14, color: '#a1a1aa' }}>No</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p style={s.p}>
        All three attributes can target both classes and methods. The namespace is <span style={s.mono}>LaraBun\Rsc\Attributes</span>.
      </p>

      <hr style={s.hr} />
      <p style={s.p}>
        Next: <Link href="/docs/validation" style={s.accent}>Validation &rarr;</Link>
      </p>
    </div>
  );
}
