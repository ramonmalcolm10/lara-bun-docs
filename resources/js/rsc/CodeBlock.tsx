"use client";

import { useState, useCallback, useMemo } from 'react';

interface CodeBlockProps {
  children: string;
  language?: string;
  title?: string;
}

interface Token {
  text: string;
  color?: string;
}

const c = {
  keyword:  '#c084fc', // purple
  string:   '#86efac', // green
  comment:  '#a1a1aa', // dim
  tag:      '#7dd3fc', // sky blue
  attr:     '#fca5a5', // coral
  func:     '#93c5fd', // blue
  type:     '#fcd34d', // warm yellow
  number:   '#fdba74', // orange
  variable: '#e4e4e7', // white
  punct:    '#71717a', // gray
  plain:    '#d4d4d8', // light gray
};

function highlightTsx(code: string): Token[][] {
  const keywords = new Set([
    'import', 'from', 'export', 'default', 'function', 'return', 'const',
    'let', 'var', 'async', 'await', 'if', 'else', 'new', 'throw', 'try',
    'catch', 'typeof', 'instanceof',
  ]);
  const typeKeywords = new Set(['interface', 'type', 'as', 'extends']);

  return code.split('\n').map(line => {
    const tokens: Token[] = [];
    let i = 0;

    while (i < line.length) {
      // Line comment
      if (line[i] === '/' && line[i + 1] === '/') {
        tokens.push({ text: line.slice(i), color: c.comment });
        break;
      }

      // JSX tag
      if (line[i] === '<') {
        const closing = line[i + 1] === '/';
        const tagStart = i;
        i += closing ? 2 : 1;
        let tagName = '';
        while (i < line.length && /[a-zA-Z0-9.]/.test(line[i])) {
          tagName += line[i];
          i++;
        }
        if (tagName) {
          tokens.push({ text: line.slice(tagStart, tagStart + (closing ? 2 : 1)), color: c.punct });
          tokens.push({ text: tagName, color: tagName[0] === tagName[0].toUpperCase() ? c.type : c.tag });

          // Collect rest until >
          while (i < line.length && line[i] !== '>') {
            // Attribute name
            if (/[a-zA-Z]/.test(line[i])) {
              let attrName = '';
              while (i < line.length && /[a-zA-Z0-9-]/.test(line[i])) {
                attrName += line[i]; i++;
              }
              tokens.push({ text: attrName, color: c.attr });
            }
            // String value
            else if (line[i] === '"' || line[i] === "'") {
              const q = line[i];
              let str = q;
              i++;
              while (i < line.length && line[i] !== q) { str += line[i]; i++; }
              if (i < line.length) { str += line[i]; i++; }
              tokens.push({ text: str, color: c.string });
            }
            else {
              tokens.push({ text: line[i], color: c.punct });
              i++;
            }
          }
          if (i < line.length) {
            // Check for /> or >
            if (line[i - 1] === '/') {
              tokens.push({ text: '/>', color: c.punct });
              i++;
            } else {
              tokens.push({ text: '>', color: c.punct });
              i++;
            }
          }
          continue;
        }
        // Not a tag, just a less-than
        tokens.push({ text: '<', color: c.punct });
        continue;
      }

      // String
      if (line[i] === "'" || line[i] === '"' || line[i] === '`') {
        const q = line[i];
        let str = q;
        i++;
        while (i < line.length && line[i] !== q) {
          if (line[i] === '\\') { str += line[i]; i++; }
          if (i < line.length) { str += line[i]; i++; }
        }
        if (i < line.length) { str += line[i]; i++; }
        tokens.push({ text: str, color: c.string });
        continue;
      }

      // Number
      if (/[0-9]/.test(line[i]) && (i === 0 || !/[a-zA-Z_]/.test(line[i - 1]))) {
        let num = '';
        while (i < line.length && /[0-9.]/.test(line[i])) { num += line[i]; i++; }
        tokens.push({ text: num, color: c.number });
        continue;
      }

      // Word (keyword, identifier, type)
      if (/[a-zA-Z_$]/.test(line[i])) {
        let word = '';
        while (i < line.length && /[a-zA-Z0-9_$]/.test(line[i])) { word += line[i]; i++; }

        if (keywords.has(word)) {
          tokens.push({ text: word, color: c.keyword });
        } else if (typeKeywords.has(word)) {
          tokens.push({ text: word, color: c.keyword });
        } else if (i < line.length && line[i] === '(') {
          tokens.push({ text: word, color: c.func });
        } else if (word[0] === word[0].toUpperCase() && /[a-z]/.test(word.slice(1))) {
          tokens.push({ text: word, color: c.type });
        } else {
          tokens.push({ text: word, color: c.plain });
        }
        continue;
      }

      // Braces, punctuation
      if ('{}()[];,:.=>!&|?+-*/'.includes(line[i])) {
        // Arrow =>
        if (line[i] === '=' && line[i + 1] === '>') {
          tokens.push({ text: '=>', color: c.keyword });
          i += 2;
          continue;
        }
        tokens.push({ text: line[i], color: c.punct });
        i++;
        continue;
      }

      // Whitespace or other
      tokens.push({ text: line[i], color: c.plain });
      i++;
    }

    return tokens;
  });
}

function highlightPhp(code: string): Token[][] {
  const keywords = new Set([
    'return', 'function', 'class', 'public', 'private', 'protected',
    'static', 'new', 'use', 'namespace', 'if', 'else', 'foreach',
    'as', 'fn', 'match', 'throw', 'try', 'catch', 'extends', 'implements',
    'abstract', 'final', 'readonly', 'enum', 'interface', 'trait',
  ]);

  return code.split('\n').map(line => {
    const tokens: Token[] = [];
    let i = 0;

    while (i < line.length) {
      // PHP open tag
      if (line.slice(i, i + 5) === '<?php') {
        tokens.push({ text: '<?php', color: c.keyword });
        i += 5;
        continue;
      }

      // Line comment
      if ((line[i] === '/' && line[i + 1] === '/') || line[i] === '#') {
        tokens.push({ text: line.slice(i), color: c.comment });
        break;
      }

      // Block comment start
      if (line[i] === '/' && line[i + 1] === '*') {
        tokens.push({ text: line.slice(i), color: c.comment });
        break;
      }

      // Variable
      if (line[i] === '$') {
        let v = '$';
        i++;
        while (i < line.length && /[a-zA-Z0-9_]/.test(line[i])) { v += line[i]; i++; }
        tokens.push({ text: v, color: c.attr });
        continue;
      }

      // String
      if (line[i] === "'" || line[i] === '"') {
        const q = line[i];
        let str = q;
        i++;
        while (i < line.length && line[i] !== q) {
          if (line[i] === '\\') { str += line[i]; i++; }
          if (i < line.length) { str += line[i]; i++; }
        }
        if (i < line.length) { str += line[i]; i++; }
        tokens.push({ text: str, color: c.string });
        continue;
      }

      // Number
      if (/[0-9]/.test(line[i]) && (i === 0 || !/[a-zA-Z_]/.test(line[i - 1]))) {
        let num = '';
        while (i < line.length && /[0-9.]/.test(line[i])) { num += line[i]; i++; }
        tokens.push({ text: num, color: c.number });
        continue;
      }

      // Arrow ->
      if (line[i] === '-' && line[i + 1] === '>') {
        tokens.push({ text: '->', color: c.punct });
        i += 2;
        continue;
      }

      // Double arrow =>
      if (line[i] === '=' && line[i + 1] === '>') {
        tokens.push({ text: '=>', color: c.keyword });
        i += 2;
        continue;
      }

      // Static access ::
      if (line[i] === ':' && line[i + 1] === ':') {
        tokens.push({ text: '::', color: c.punct });
        i += 2;
        continue;
      }

      // Word
      if (/[a-zA-Z_]/.test(line[i])) {
        let word = '';
        while (i < line.length && /[a-zA-Z0-9_]/.test(line[i])) { word += line[i]; i++; }

        if (keywords.has(word)) {
          tokens.push({ text: word, color: c.keyword });
        } else if (word === 'array' || word === 'string' || word === 'int' || word === 'bool' || word === 'null' || word === 'void' || word === 'self') {
          tokens.push({ text: word, color: c.type });
        } else if (i < line.length && line[i] === '(') {
          tokens.push({ text: word, color: c.func });
        } else if (word[0] === word[0].toUpperCase() && /[a-z]/.test(word.slice(1))) {
          tokens.push({ text: word, color: c.type });
        } else {
          tokens.push({ text: word, color: c.plain });
        }
        continue;
      }

      // Punctuation
      if ('{}()[];,:.=>!&|?+-*/\\@'.includes(line[i])) {
        tokens.push({ text: line[i], color: c.punct });
        i++;
        continue;
      }

      tokens.push({ text: line[i], color: c.plain });
      i++;
    }

    return tokens;
  });
}

function highlightBash(code: string): Token[][] {
  return code.split('\n').map(line => {
    const tokens: Token[] = [];
    const trimmed = line.trimStart();

    // Comment
    if (trimmed.startsWith('#')) {
      tokens.push({ text: line, color: c.comment });
      return tokens;
    }

    let i = 0;
    while (i < line.length) {
      // String
      if (line[i] === "'" || line[i] === '"') {
        const q = line[i];
        let str = q;
        i++;
        while (i < line.length && line[i] !== q) {
          if (line[i] === '\\') { str += line[i]; i++; }
          if (i < line.length) { str += line[i]; i++; }
        }
        if (i < line.length) { str += line[i]; i++; }
        tokens.push({ text: str, color: c.string });
        continue;
      }

      // Flag
      if (line[i] === '-' && i > 0 && line[i - 1] === ' ') {
        let flag = '';
        while (i < line.length && line[i] !== ' ') { flag += line[i]; i++; }
        tokens.push({ text: flag, color: c.attr });
        continue;
      }

      // Word
      if (/[a-zA-Z_]/.test(line[i])) {
        let word = '';
        const start = i;
        while (i < line.length && /[a-zA-Z0-9_:./\\-]/.test(line[i])) { word += line[i]; i++; }

        // First word on the line (command)
        const before = line.slice(0, start).trim();
        if (before === '' || before === '$' || before.endsWith('&&') || before.endsWith('|')) {
          tokens.push({ text: word, color: c.func });
        } else {
          tokens.push({ text: word, color: c.plain });
        }
        continue;
      }

      if (line[i] === '$') {
        tokens.push({ text: '$', color: c.punct });
        i++;
        continue;
      }

      tokens.push({ text: line[i], color: c.plain });
      i++;
    }

    return tokens;
  });
}

function highlightJson(code: string): Token[][] {
  return code.split('\n').map(line => {
    const tokens: Token[] = [];
    let i = 0;

    while (i < line.length) {
      // String (key or value)
      if (line[i] === '"') {
        let str = '"';
        i++;
        while (i < line.length && line[i] !== '"') {
          if (line[i] === '\\') { str += line[i]; i++; }
          if (i < line.length) { str += line[i]; i++; }
        }
        if (i < line.length) { str += '"'; i++; }

        // Check if it's a key (followed by colon)
        const rest = line.slice(i).trimStart();
        if (rest.startsWith(':')) {
          tokens.push({ text: str, color: c.attr });
        } else {
          tokens.push({ text: str, color: c.string });
        }
        continue;
      }

      // Number
      if (/[0-9]/.test(line[i])) {
        let num = '';
        while (i < line.length && /[0-9.]/.test(line[i])) { num += line[i]; i++; }
        tokens.push({ text: num, color: c.number });
        continue;
      }

      // Boolean / null
      if (/[a-z]/.test(line[i])) {
        let word = '';
        while (i < line.length && /[a-z]/.test(line[i])) { word += line[i]; i++; }
        if (word === 'true' || word === 'false' || word === 'null') {
          tokens.push({ text: word, color: c.keyword });
        } else {
          tokens.push({ text: word, color: c.plain });
        }
        continue;
      }

      // Punctuation
      if ('{}[],:'.includes(line[i])) {
        tokens.push({ text: line[i], color: c.punct });
        i++;
        continue;
      }

      tokens.push({ text: line[i], color: c.plain });
      i++;
    }

    return tokens;
  });
}

function highlightEnv(code: string): Token[][] {
  return code.split('\n').map(line => {
    const trimmed = line.trimStart();

    // Comment
    if (trimmed.startsWith('#')) {
      return [{ text: line, color: c.comment }];
    }

    // KEY=VALUE
    const eqIdx = line.indexOf('=');
    if (eqIdx > 0) {
      return [
        { text: line.slice(0, eqIdx), color: c.attr },
        { text: '=', color: c.punct },
        { text: line.slice(eqIdx + 1), color: c.string },
      ];
    }

    return [{ text: line, color: c.plain }];
  });
}

function highlightBlade(code: string): Token[][] {
  return code.split('\n').map(line => {
    const tokens: Token[] = [];
    let i = 0;

    while (i < line.length) {
      // Blade comment {{-- --}}
      if (line.slice(i, i + 4) === '{{--') {
        const end = line.indexOf('--}}', i + 4);
        if (end !== -1) {
          tokens.push({ text: line.slice(i, end + 4), color: c.comment });
          i = end + 4;
        } else {
          tokens.push({ text: line.slice(i), color: c.comment });
          break;
        }
        continue;
      }

      // Blade unescaped {!! !!}
      if (line.slice(i, i + 3) === '{!!') {
        const end = line.indexOf('!!}', i + 3);
        if (end !== -1) {
          tokens.push({ text: '{!!', color: c.keyword });
          tokens.push({ text: line.slice(i + 3, end), color: c.attr });
          tokens.push({ text: '!!}', color: c.keyword });
          i = end + 3;
        } else {
          tokens.push({ text: line.slice(i), color: c.keyword });
          break;
        }
        continue;
      }

      // Blade echo {{ }}
      if (line[i] === '{' && line[i + 1] === '{') {
        const end = line.indexOf('}}', i + 2);
        if (end !== -1) {
          tokens.push({ text: '{{', color: c.keyword });
          tokens.push({ text: line.slice(i + 2, end), color: c.attr });
          tokens.push({ text: '}}', color: c.keyword });
          i = end + 2;
        } else {
          tokens.push({ text: line.slice(i), color: c.keyword });
          break;
        }
        continue;
      }

      // Blade directive @php, @if, @endif, etc.
      if (line[i] === '@' && /[a-zA-Z]/.test(line[i + 1] || '')) {
        let directive = '@';
        i++;
        while (i < line.length && /[a-zA-Z]/.test(line[i])) { directive += line[i]; i++; }
        tokens.push({ text: directive, color: c.keyword });

        // Capture parenthesized argument
        if (i < line.length && line[i] === '(') {
          let depth = 1;
          let arg = '(';
          i++;
          while (i < line.length && depth > 0) {
            if (line[i] === '(') depth++;
            if (line[i] === ')') depth--;
            arg += line[i];
            i++;
          }
          tokens.push({ text: arg, color: c.attr });
        }
        continue;
      }

      // HTML comment
      if (line.slice(i, i + 4) === '<!--') {
        const end = line.indexOf('-->', i + 4);
        if (end !== -1) {
          tokens.push({ text: line.slice(i, end + 3), color: c.comment });
          i = end + 3;
        } else {
          tokens.push({ text: line.slice(i), color: c.comment });
          break;
        }
        continue;
      }

      // <!DOCTYPE
      if (line.slice(i, i + 2) === '<!' && /[A-Z]/.test(line[i + 2] || '')) {
        const end = line.indexOf('>', i);
        if (end !== -1) {
          tokens.push({ text: line.slice(i, end + 1), color: c.tag });
          i = end + 1;
        } else {
          tokens.push({ text: line.slice(i), color: c.tag });
          break;
        }
        continue;
      }

      // HTML tag
      if (line[i] === '<') {
        const closing = line[i + 1] === '/';
        const tagStart = i;
        i += closing ? 2 : 1;
        let tagName = '';
        while (i < line.length && /[a-zA-Z0-9-]/.test(line[i])) { tagName += line[i]; i++; }

        if (tagName) {
          tokens.push({ text: line.slice(tagStart, tagStart + (closing ? 2 : 1)), color: c.punct });
          tokens.push({ text: tagName, color: c.tag });

          // Attributes until >
          while (i < line.length && line[i] !== '>') {
            // Blade inside attributes
            if (line.slice(i, i + 3) === '{!!' || (line[i] === '{' && line[i + 1] === '{')) {
              // Let the outer loop handle it next iteration
              break;
            }

            if (/[a-zA-Z:@-]/.test(line[i])) {
              let attrName = '';
              while (i < line.length && /[a-zA-Z0-9:@._-]/.test(line[i])) { attrName += line[i]; i++; }
              tokens.push({ text: attrName, color: c.attr });
            } else if (line[i] === '"' || line[i] === "'") {
              const q = line[i];
              let str = q;
              i++;
              while (i < line.length && line[i] !== q) { str += line[i]; i++; }
              if (i < line.length) { str += line[i]; i++; }
              tokens.push({ text: str, color: c.string });
            } else if (line[i] === '/' && line[i + 1] === '>') {
              break;
            } else {
              tokens.push({ text: line[i], color: c.punct });
              i++;
            }
          }
          if (i < line.length && line[i] === '>') {
            if (i > 0 && line[i - 1] === '/') {
              tokens.push({ text: '/>', color: c.punct });
              i++;
            } else {
              tokens.push({ text: '>', color: c.punct });
              i++;
            }
          }
          continue;
        }
        tokens.push({ text: '<', color: c.punct });
        continue;
      }

      // CSS-like content inside <style>
      if (line[i] === '{' || line[i] === '}' || line[i] === ';' || line[i] === ':') {
        tokens.push({ text: line[i], color: c.punct });
        i++;
        continue;
      }

      // Word
      if (/[a-zA-Z_]/.test(line[i])) {
        let word = '';
        while (i < line.length && /[a-zA-Z0-9_#.-]/.test(line[i])) { word += line[i]; i++; }
        tokens.push({ text: word, color: c.plain });
        continue;
      }

      tokens.push({ text: line[i], color: c.plain });
      i++;
    }

    return tokens;
  });
}

function highlightIni(code: string): Token[][] {
  return code.split('\n').map(line => {
    const trimmed = line.trimStart();

    // Comment
    if (trimmed.startsWith('#') || trimmed.startsWith(';')) {
      return [{ text: line, color: c.comment }];
    }

    // Section header [program:larabun]
    const sectionMatch = trimmed.match(/^(\[)([^\]]+)(\])(.*)$/);
    if (sectionMatch) {
      const indent = line.slice(0, line.length - trimmed.length);
      return [
        { text: indent, color: c.plain },
        { text: '[', color: c.punct },
        { text: sectionMatch[2], color: c.keyword },
        { text: ']', color: c.punct },
        ...(sectionMatch[4] ? [{ text: sectionMatch[4], color: c.comment }] : []),
      ];
    }

    // key=value
    const eqIdx = line.indexOf('=');
    if (eqIdx > 0) {
      return [
        { text: line.slice(0, eqIdx), color: c.attr },
        { text: '=', color: c.punct },
        { text: line.slice(eqIdx + 1), color: c.string },
      ];
    }

    return [{ text: line, color: c.plain }];
  });
}

function highlightDockerfile(code: string): Token[][] {
  const instructions = new Set([
    'FROM', 'RUN', 'CMD', 'LABEL', 'EXPOSE', 'ENV', 'ADD', 'COPY',
    'ENTRYPOINT', 'VOLUME', 'USER', 'WORKDIR', 'ARG', 'ONBUILD',
    'STOPSIGNAL', 'HEALTHCHECK', 'SHELL', 'AS',
  ]);

  return code.split('\n').map(line => {
    const tokens: Token[] = [];
    const trimmed = line.trimStart();

    // Comment
    if (trimmed.startsWith('#')) {
      return [{ text: line, color: c.comment }];
    }

    let i = 0;

    while (i < line.length) {
      // String
      if (line[i] === '"' || line[i] === "'") {
        const q = line[i];
        let str = q;
        i++;
        while (i < line.length && line[i] !== q) {
          if (line[i] === '\\') { str += line[i]; i++; }
          if (i < line.length) { str += line[i]; i++; }
        }
        if (i < line.length) { str += line[i]; i++; }
        tokens.push({ text: str, color: c.string });
        continue;
      }

      // Variable $HOME or ${VAR}
      if (line[i] === '$') {
        let v = '$';
        i++;
        if (i < line.length && line[i] === '{') {
          while (i < line.length && line[i] !== '}') { v += line[i]; i++; }
          if (i < line.length) { v += line[i]; i++; }
        } else {
          while (i < line.length && /[a-zA-Z0-9_]/.test(line[i])) { v += line[i]; i++; }
        }
        tokens.push({ text: v, color: c.type });
        continue;
      }

      // Flag
      if (line[i] === '-' && i > 0 && line[i - 1] === ' ') {
        let flag = '';
        while (i < line.length && line[i] !== ' ' && line[i] !== '=') { flag += line[i]; i++; }
        tokens.push({ text: flag, color: c.attr });
        continue;
      }

      // Word
      if (/[a-zA-Z_]/.test(line[i])) {
        let word = '';
        while (i < line.length && /[a-zA-Z0-9_.:~/-]/.test(line[i])) { word += line[i]; i++; }

        if (instructions.has(word)) {
          tokens.push({ text: word, color: c.keyword });
        } else {
          tokens.push({ text: word, color: c.plain });
        }
        continue;
      }

      // Punctuation
      if ('{}[]|&;=\\'.includes(line[i])) {
        tokens.push({ text: line[i], color: c.punct });
        i++;
        continue;
      }

      tokens.push({ text: line[i], color: c.plain });
      i++;
    }

    return tokens;
  });
}

function highlight(code: string, language?: string): Token[][] {
  const lang = (language || '').toLowerCase();

  if (['tsx', 'ts', 'jsx', 'js', 'typescript', 'javascript'].includes(lang)) {
    return highlightTsx(code);
  }
  if (['php'].includes(lang)) {
    return highlightPhp(code);
  }
  if (['bash', 'sh', 'shell', 'zsh'].includes(lang)) {
    return highlightBash(code);
  }
  if (['json'].includes(lang)) {
    return highlightJson(code);
  }
  if (['env', 'dotenv'].includes(lang)) {
    return highlightEnv(code);
  }
  if (['html', 'blade', 'htm', 'xml'].includes(lang)) {
    return highlightBlade(code);
  }
  if (['ini', 'conf', 'toml', 'service'].includes(lang)) {
    return highlightIni(code);
  }
  if (['dockerfile', 'docker'].includes(lang)) {
    return highlightDockerfile(code);
  }

  // No highlighting — return plain
  return code.split('\n').map(line => [{ text: line, color: c.plain }]);
}

export default function CodeBlock({ children, language, title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const copy = (text: string) => {
      if (navigator.clipboard?.writeText) {
        return navigator.clipboard.writeText(text);
      }
      // Fallback for non-HTTPS contexts
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      return Promise.resolve();
    };

    copy(children).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [children]);

  const highlighted = useMemo(() => highlight(children, language), [children, language]);

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
            color: '#d4d4d8',
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
        }}>
          {highlighted.map((lineTokens, li) => (
            <div key={li}>
              {lineTokens.length === 0
                ? '\n'
                : lineTokens.map((tok, ti) => (
                    <span key={ti} style={{ color: tok.color }}>{tok.text}</span>
                  ))
              }
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
