import TodoDemo from './TodoDemo';

export default async function LiveTodoDemo() {
  const sessionId = await php<string>("Todos.generate");
  const todos = await php<{ id: string; title: string; done: boolean }[]>("Todos.list", sessionId);

  return <TodoDemo sessionId={sessionId} initial={todos} />;
}
