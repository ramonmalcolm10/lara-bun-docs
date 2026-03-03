"use client";

import { useState, useTransition } from 'react';
import { todoActionsAdd, todoActionsToggle, todoActionsDelete } from '../../../server-actions.generated';

interface Todo {
  id: string;
  title: string;
  done: boolean;
}

const mono = "ui-monospace, 'Cascadia Code', 'Fira Code', monospace";

export default function TodoDemo({ sessionId, initial }: { sessionId: string; initial: Todo[] }) {
  const [todos, setTodos] = useState<Todo[]>(initial);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleAdd() {
    const title = input.trim();
    if (!title) return;
    setInput('');
    startTransition(async () => {
      const updated = await todoActionsAdd(sessionId, title) as Todo[];
      setTodos(updated);
    });
  }

  function handleToggle(todoId: string) {
    startTransition(async () => {
      const updated = await todoActionsToggle(sessionId, todoId) as Todo[];
      setTodos(updated);
    });
  }

  function handleDelete(todoId: string) {
    startTransition(async () => {
      const updated = await todoActionsDelete(sessionId, todoId) as Todo[];
      setTodos(updated);
    });
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        gap: 8,
        marginBottom: 20,
      }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="What needs to be done?"
          style={{
            flex: 1,
            background: '#18181b',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 14,
            color: '#fafafa',
            outline: 'none',
            fontFamily: mono,
          }}
        />
        <button
          onClick={handleAdd}
          disabled={isPending || !input.trim()}
          style={{
            background: '#f59e0b',
            color: '#18181b',
            border: 'none',
            borderRadius: 8,
            padding: '10px 20px',
            fontSize: 14,
            fontWeight: 600,
            cursor: isPending || !input.trim() ? 'not-allowed' : 'pointer',
            opacity: isPending || !input.trim() ? 0.5 : 1,
            transition: 'opacity 0.15s',
          }}
        >
          Add
        </button>
      </div>

      <div style={{
        fontSize: 12,
        color: '#f59e0b',
        fontFamily: mono,
        height: 18,
        marginBottom: 12,
        opacity: isPending ? 0.8 : 0,
        transition: 'opacity 0.15s',
      }}>
        Syncing with server...
      </div>

      {todos.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '32px 0',
          color: '#52525b',
          fontSize: 14,
        }}>
          No todos yet. Add one above.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 6 }}>
          {todos.map((todo) => (
            <div
              key={todo.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                background: '#18181b',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <button
                onClick={() => handleToggle(todo.id)}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  border: todo.done ? '2px solid #4ade80' : '2px solid #3f3f46',
                  background: todo.done ? 'rgba(74,222,128,0.15)' : 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: 12,
                  color: '#4ade80',
                  padding: 0,
                }}
              >
                {todo.done ? '✓' : ''}
              </button>
              <span style={{
                flex: 1,
                fontSize: 14,
                color: todo.done ? '#52525b' : '#d4d4d8',
                textDecoration: todo.done ? 'line-through' : 'none',
                transition: 'all 0.15s',
              }}>
                {todo.title}
              </span>
              <button
                onClick={() => handleDelete(todo.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#52525b',
                  cursor: 'pointer',
                  fontSize: 16,
                  padding: '0 4px',
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{
        marginTop: 16,
        fontSize: 12,
        color: '#3f3f46',
        fontFamily: mono,
      }}>
        Session: {sessionId.slice(0, 8)}...
      </div>
    </div>
  );
}
