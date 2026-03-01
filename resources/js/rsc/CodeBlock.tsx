"use client";

import { useState, useCallback } from 'react';

interface CodeBlockProps {
  children: string;
  language?: string;
  title?: string;
}

export default function CodeBlock({ children, language, title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(children).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [children]);

  return (
    <div style={{
      background: '#18181b',
      borderRadius: 10,
      border: '1px solid rgba(255,255,255,0.06)',
      overflow: 'hidden',
      marginBottom: 20,
    }}>
      {(title || language) && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.02)',
        }}>
          <span style={{
            fontSize: 12,
            fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace",
            color: '#9a9aa2',
          }}>
            {title || language}
          </span>
          <button
            onClick={handleCopy}
            style={{
              background: 'none',
              border: 'none',
              color: copied ? '#4ade80' : '#9a9aa2',
              cursor: 'pointer',
              fontSize: 12,
              fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace",
              padding: '2px 8px',
              borderRadius: 4,
              transition: 'color 0.15s',
            }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
      <pre style={{
        padding: 16,
        overflowX: 'auto',
        margin: 0,
      }}>
        <code style={{
          fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace",
          fontSize: 13,
          lineHeight: 1.7,
          color: '#e4e4e7',
        }}>
          {children}
        </code>
      </pre>
    </div>
  );
}
