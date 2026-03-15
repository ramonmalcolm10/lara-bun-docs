import CodeBlock from './CodeBlock';
import Link from 'lara-bun/Link';

const s = {
  h1: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12 } as const,
  h2: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', marginTop: 48, marginBottom: 12 } as const,
  h3: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 17, fontWeight: 600, marginTop: 32, marginBottom: 8 } as const,
  p: { color: '#d4d4d8', fontSize: 15, lineHeight: 1.8, marginBottom: 16 } as const,
  li: { color: '#d4d4d8', fontSize: 15, lineHeight: 1.8, marginBottom: 6, paddingLeft: 8 } as const,
  accent: { color: '#f59e0b' } as const,
  mono: { fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace", fontSize: 13, background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 4, color: '#e4e4e7' } as const,
  hr: { border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '40px 0' } as const,
  callout: { background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 8, padding: '16px 20px', marginBottom: 20 } as const,
};

export default function DocsReactCompiler() {
  return (
    <div>
      <h1 style={s.h1}>React Compiler</h1>
      <p style={s.p}>
        LaraBun has built-in support for the <strong style={{ color: '#fafafa' }}>React Compiler</strong> (formerly React Forget). When enabled, it automatically memoizes your client components — eliminating the need for manual <span style={s.mono}>useMemo</span>, <span style={s.mono}>useCallback</span>, and <span style={s.mono}>React.memo</span>.
      </p>

      <div style={s.callout}>
        <p style={{ ...s.p, marginBottom: 0, fontSize: 14 }}>
          <strong style={{ color: '#f59e0b' }}>Opt-in.</strong> The React Compiler is automatically detected at build time. Just install the dependencies and it works — no configuration needed.
        </p>
      </div>

      <h2 style={s.h2}>Installation</h2>
      <p style={s.p}>
        Install the React Compiler Babel plugin and its dependencies:
      </p>
      <CodeBlock language="bash">
        {`bun add -d babel-plugin-react-compiler @babel/core @babel/preset-typescript`}
      </CodeBlock>
      <p style={s.p}>
        That's it. On your next <span style={s.mono}>bun run build</span> or <span style={s.mono}>bun run dev</span>, you'll see:
      </p>
      <CodeBlock language="bash">
        {`React Compiler enabled — client components will be auto-optimized.`}
      </CodeBlock>

      <h2 style={s.h2}>How It Works</h2>
      <p style={s.p}>
        LaraBun's build script auto-detects <span style={s.mono}>babel-plugin-react-compiler</span> at startup. When found, it registers a Bun build plugin that transforms all <span style={s.mono}>.tsx</span> and <span style={s.mono}>.jsx</span> client component files through the React Compiler before bundling.
      </p>
      <ul style={{ listStyle: 'none' }}>
        <li style={s.li}>• Runs during both <strong style={{ color: '#fafafa' }}>SSR</strong> and <strong style={{ color: '#fafafa' }}>browser</strong> builds for dev/prod parity</li>
        <li style={s.li}>• Skips <span style={s.mono}>node_modules</span> — only your components are compiled</li>
        <li style={s.li}>• Zero config — no Babel config files or build script changes needed</li>
        <li style={s.li}>• Works with <span style={s.mono}>bun run dev</span> (watch mode) and <span style={s.mono}>bun run build</span> (production)</li>
      </ul>

      <h3 style={s.h3}>What the Compiler Does</h3>
      <p style={s.p}>
        The React Compiler analyzes your components and automatically inserts memoization where it improves performance. A component like this:
      </p>
      <CodeBlock language="tsx" title="Counter.tsx">
        {`"use client";

export default function Counter({ count, onIncrement }: {
  count: number;
  onIncrement: () => void;
}) {
  const doubled = count * 2;

  return (
    <div>
      <p>Count: {count} (doubled: {doubled})</p>
      <button onClick={onIncrement}>+1</button>
    </div>
  );
}`}
      </CodeBlock>
      <p style={s.p}>
        Gets automatically optimized — the compiler determines which values to memoize and which re-renders to skip, without you writing <span style={s.mono}>useMemo</span> or <span style={s.mono}>React.memo</span>.
      </p>

      <h2 style={s.h2}>Requirements</h2>
      <ul style={{ listStyle: 'none' }}>
        <li style={s.li}>• <strong style={{ color: '#fafafa' }}>React 19</strong> — the compiler targets React 19's optimized runtime</li>
        <li style={s.li}>• <strong style={{ color: '#fafafa' }}>babel-plugin-react-compiler</strong> — the compiler itself</li>
        <li style={s.li}>• <strong style={{ color: '#fafafa' }}>@babel/core</strong> — Babel transform engine</li>
        <li style={s.li}>• <strong style={{ color: '#fafafa' }}>@babel/preset-typescript</strong> — TypeScript parsing support</li>
      </ul>

      <h2 style={s.h2}>Disabling the Compiler</h2>
      <p style={s.p}>
        To disable the React Compiler, simply uninstall the dependencies:
      </p>
      <CodeBlock language="bash">
        {`bun remove babel-plugin-react-compiler @babel/core @babel/preset-typescript`}
      </CodeBlock>
      <p style={s.p}>
        The build script will silently skip the compiler when the packages are not installed.
      </p>

      <h2 style={s.h2}>Opting Out Per Component</h2>
      <p style={s.p}>
        If the compiler causes issues with a specific component, you can opt it out using the <span style={s.mono}>"use no memo"</span> directive:
      </p>
      <CodeBlock language="tsx">
        {`"use client";

export default function LegacyWidget() {
  "use no memo";

  // This component will not be compiled
  return <div>...</div>;
}`}
      </CodeBlock>

      <hr style={s.hr} />
      <p style={s.p}>
        Next: <Link href="/docs/deployment" style={s.accent}>Deployment →</Link>
      </p>
    </div>
  );
}
