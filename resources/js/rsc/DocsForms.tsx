import CodeBlock from './CodeBlock';

const s = {
  h1: { fontFamily: "system-ui, -apple-system, sans-serif", fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12 } as const,
  h2: { fontFamily: "system-ui, -apple-system, sans-serif", fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', marginTop: 48, marginBottom: 12 } as const,
  h3: { fontFamily: "system-ui, -apple-system, sans-serif", fontSize: 17, fontWeight: 600, marginTop: 32, marginBottom: 8 } as const,
  p: { color: '#d4d4d8', fontSize: 15, lineHeight: 1.8, marginBottom: 16 } as const,
  mono: { fontFamily: "ui-monospace, 'SFMono-Regular', monospace", fontSize: 13, background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 4, color: '#e4e4e7' } as const,
  hr: { border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '40px 0' } as const,
  accent: { color: '#f59e0b' } as const,
  box: { background: '#18181b', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: 24, marginBottom: 20 } as const,
};

export default function DocsForms() {
  return (
    <div>
      <h1 style={s.h1}>Forms</h1>
      <p style={s.p}>
        LaraBun provides a <span style={s.mono}>&lt;Form&gt;</span> component and <span style={s.mono}>useForm</span> hook for handling form submissions with server actions. Built-in support for validation errors, loading states, optimistic updates, and GET form navigation.
      </p>

      <h2 style={s.h2}>The Form Component</h2>
      <p style={s.p}>
        The simplest way to handle forms. Works without any hooks — just pass a server action and use the render-prop for pending state and errors.
      </p>
      <CodeBlock language="tsx" title="TodoForm.tsx">
        {`"use client";

import { Form } from "lara-bun/router";
import { addTodo } from "./actions";

type FormValues = { title: string };

export default function TodoForm() {
  return (
    <Form<FormValues> action={addTodo}>
      {({ pending, error }) => (
        <>
          <input name="title" placeholder="What needs to be done?" />
          {error('title') && <span className="text-red-500">{error('title')}</span>}
          <button disabled={pending}>
            {pending ? 'Adding...' : 'Add Todo'}
          </button>
        </>
      )}
    </Form>
  );
}`}
      </CodeBlock>
      <p style={s.p}>
        The generic type parameter <span style={s.mono}>&lt;FormValues&gt;</span> gives you autocomplete on <span style={s.mono}>error()</span> and typed form data throughout the component.
      </p>

      <h3 style={s.h3}>Form Props</h3>
      <div style={s.box}>
        <div style={{ fontFamily: "ui-monospace, 'SFMono-Regular', monospace", fontSize: 13, color: '#a1a1aa', lineHeight: 2.2 }}>
          <div><span style={s.accent}>action</span> — server action function (POST) or URL string (GET)</div>
          <div><span style={s.accent}>method</span> — "get" | "post" (defaults to "post" for functions, "get" for strings)</div>
          <div><span style={s.accent}>resetOnSuccess</span> — auto-reset form on success (default: true)</div>
          <div><span style={s.accent}>optimistic</span> — callback for optimistic updates, called inside the transition</div>
          <div><span style={s.accent}>onSuccess</span> — called with the action result on success</div>
          <div><span style={s.accent}>onError</span> — called with validation errors on 422</div>
          <div><span style={s.accent}>onSubmit</span> — called before submit, return false to cancel</div>
          <div><span style={s.accent}>prefetch</span> — "hover" (default) | "mount" | "none" (GET forms only)</div>
          <div><span style={s.accent}>replace</span> — replace history state (GET forms)</div>
          <div><span style={s.accent}>preserveScroll</span> — keep scroll position (GET forms)</div>
        </div>
      </div>

      <h3 style={s.h3}>useFormStatus</h3>
      <p style={s.p}>
        Nested components can access form state via context, without prop drilling:
      </p>
      <CodeBlock language="tsx" title="SubmitButton.tsx">
        {`"use client";

import { useFormStatus } from "lara-bun/router";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save'}
    </button>
  );
}`}
      </CodeBlock>

      <hr style={s.hr} />

      <h2 style={s.h2}>The useForm Hook</h2>
      <p style={s.p}>
        For more control over form state — controlled inputs, field-level reset, transforms, and programmatic submit.
      </p>
      <CodeBlock language="tsx" title="EditProfile.tsx">
        {`"use client";

import { useForm } from "lara-bun/router";
import { updateProfile } from "./actions";

type ProfileForm = { name: string; email: string; bio: string };

export default function EditProfile({ profile }: { profile: ProfileForm }) {
  const { data, setData, errors, error, pending, recentlySuccessful, submit } =
    useForm<ProfileForm>(profile);

  return (
    <form onSubmit={(e) => { e.preventDefault(); submit(updateProfile); }}>
      <input
        value={data.name}
        onChange={(e) => setData('name', e.target.value)}
      />
      {error('name') && <span>{error('name')}</span>}

      <input
        value={data.email}
        onChange={(e) => setData('email', e.target.value)}
      />
      {error('email') && <span>{error('email')}</span>}

      <textarea
        value={data.bio}
        onChange={(e) => setData('bio', e.target.value)}
      />

      <button disabled={pending}>
        {pending ? 'Saving...' : 'Save'}
      </button>
      {recentlySuccessful && <span>Saved!</span>}
    </form>
  );
}`}
      </CodeBlock>

      <h3 style={s.h3}>useForm Return Values</h3>
      <div style={s.box}>
        <div style={{ fontFamily: "ui-monospace, 'SFMono-Regular', monospace", fontSize: 13, color: '#a1a1aa', lineHeight: 2.2 }}>
          <div><span style={s.accent}>data</span> — current form values (typed)</div>
          <div><span style={s.accent}>setData(field, value)</span> — update a single field</div>
          <div><span style={s.accent}>setData(values)</span> — batch update multiple fields</div>
          <div><span style={s.accent}>errors</span> — validation errors keyed by field name</div>
          <div><span style={s.accent}>error(field)</span> — first error message for a field</div>
          <div><span style={s.accent}>hasErrors</span> — boolean, true if any validation errors</div>
          <div><span style={s.accent}>pending / processing</span> — true while the action is running</div>
          <div><span style={s.accent}>wasSuccessful</span> — true after a successful submit</div>
          <div><span style={s.accent}>recentlySuccessful</span> — true for 2s after success (for "Saved!" indicators)</div>
          <div><span style={s.accent}>clearErrors(...fields)</span> — clear specific or all errors</div>
          <div><span style={s.accent}>reset(...fields)</span> — reset specific or all fields to defaults</div>
          <div><span style={s.accent}>setDefaults(values)</span> — update what reset() restores to</div>
          <div><span style={s.accent}>transform(fn)</span> — pre-submit data transform</div>
          <div><span style={s.accent}>submit(action, optimistic?)</span> — submit with optional optimistic callback</div>
        </div>
      </div>

      <hr style={s.hr} />

      <h2 style={s.h2}>Validation Errors</h2>
      <p style={s.p}>
        When a server action throws a Laravel <span style={s.mono}>ValidationException</span>, LaraBun catches it and returns a 422 response. Both <span style={s.mono}>&lt;Form&gt;</span> and <span style={s.mono}>useForm</span> automatically populate the <span style={s.mono}>errors</span> object — no manual error catching needed.
      </p>
      <CodeBlock language="php" title="app/Rsc/Actions/CreateTodo.php">
        {`<?php

namespace App\\Rsc\\Actions;

use Illuminate\\Support\\Facades\\Validator;

class CreateTodo
{
    public function __invoke(string $title): array
    {
        $validated = Validator::validate(
            ['title' => $title],
            ['title' => ['required', 'min:3', 'max:255']],
        );

        // Create the todo...

        return ['id' => 1, 'title' => $validated['title']];
    }
}`}
      </CodeBlock>
      <p style={s.p}>
        Errors are typed as <span style={s.mono}>{'Partial<Record<keyof T, string[]>>'}</span> — each field maps to an array of error messages, matching Laravel's error bag format.
      </p>

      <hr style={s.hr} />

      <h2 style={s.h2}>Optimistic Updates</h2>
      <p style={s.p}>
        Both <span style={s.mono}>&lt;Form&gt;</span> and <span style={s.mono}>useForm</span> support optimistic updates via React's <span style={s.mono}>useOptimistic</span> hook. The optimistic callback runs inside the transition, so React automatically reverts on error.
      </p>

      <h3 style={s.h3}>With the Form Component</h3>
      <CodeBlock language="tsx" title="TodoList.tsx">
        {`"use client";

import { useOptimistic } from "react";
import { Form } from "lara-bun/router";
import { addTodo } from "./actions";

type Todo = { id: number; title: string; done: boolean };

export default function TodoList({ todos }: { todos: Todo[] }) {
  const [optimisticTodos, addOptimistic] = useOptimistic(
    todos,
    (state, newTodo: Todo) => [...state, newTodo]
  );

  return (
    <div>
      <ul>
        {optimisticTodos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>

      <Form
        action={addTodo}
        optimistic={(data) =>
          addOptimistic({ id: Date.now(), title: data.title as string, done: false })
        }
      >
        <input name="title" />
        <button>Add</button>
      </Form>
    </div>
  );
}`}
      </CodeBlock>

      <h3 style={s.h3}>With useForm</h3>
      <CodeBlock language="tsx" title="TodoListWithHook.tsx">
        {`"use client";

import { useOptimistic } from "react";
import { useForm } from "lara-bun/router";
import { addTodo } from "./actions";

type Todo = { id: number; title: string; done: boolean };

export default function TodoList({ todos }: { todos: Todo[] }) {
  const [optimisticTodos, addOptimistic] = useOptimistic(
    todos,
    (state, newTodo: Todo) => [...state, newTodo]
  );

  const { data, setData, submit, pending } = useForm({ title: '' });

  function save(e: React.FormEvent) {
    e.preventDefault();
    submit(addTodo, () =>
      addOptimistic({ id: Date.now(), title: data.title, done: false })
    );
  }

  return (
    <div>
      <ul>
        {optimisticTodos.map((todo) => (
          <li key={todo.id} style={{ opacity: todo.id > 1e12 ? 0.5 : 1 }}>
            {todo.title}
          </li>
        ))}
      </ul>

      <form onSubmit={save}>
        <input
          value={data.title}
          onChange={(e) => setData('title', e.target.value)}
        />
        <button disabled={pending}>Add</button>
      </form>
    </div>
  );
}`}
      </CodeBlock>
      <p style={s.p}>
        You own the optimistic state with whatever type you need — the user list, a shopping cart, addresses — not limited to form values. React's <span style={s.mono}>useOptimistic</span> gives you full typing and automatic rollback on error.
      </p>

      <hr style={s.hr} />

      <h2 style={s.h2}>GET Forms (Search / Filters)</h2>
      <p style={s.p}>
        When <span style={s.mono}>action</span> is a URL string, the form navigates via RSC instead of doing a full page reload. Form fields are serialized as query parameters. Supports prefetching for instant navigation.
      </p>
      <CodeBlock language="tsx" title="SearchForm.tsx">
        {`"use client";

import { Form } from "lara-bun/router";

export default function SearchForm() {
  return (
    <Form action="/search" method="get" prefetch="hover">
      <input name="q" placeholder="Search..." />
      <select name="sort">
        <option value="relevance">Relevance</option>
        <option value="date">Date</option>
      </select>
      <button>Search</button>
    </Form>
  );
}`}
      </CodeBlock>
      <p style={s.p}>
        This navigates to <span style={s.mono}>/search?q=hello&sort=date</span> via SPA navigation. The nearest Suspense boundary streams in the results. With <span style={s.mono}>prefetch="hover"</span>, hovering the submit button pre-warms the base URL for instant feedback.
      </p>
    </div>
  );
}
