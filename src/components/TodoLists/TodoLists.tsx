import { useState } from "react"
import { TodoList } from "../TodoList/TodoList";
import type { TodoListType } from "../../types/types";

export const TodoLists = () => {
  const [todos, setTodos] = useState<TodoListType[]>([]);
  const [currentTodoName, setCurrentTodoName] = useState<string>("");

  const createTodo = ( name: string ) => {
    if (!name.trim()) return;
    const todoList = {
      id: crypto.randomUUID(),
      name: name,
      createdAt: +new Date()
    };
    setTodos(prev => [todoList, ...prev]);
    setCurrentTodoName("");
  }

  return (
    <>
      <h1>To-Do Lists</h1>
      {todos.length === 0 && (
        <span>
          Создайте свой первый список задач
        </span>
      )} 
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createTodo(currentTodoName);
        }}
      >
        <input
          placeholder="Введите название списка"
          value={currentTodoName}
          onChange={(e) => setCurrentTodoName(e.target.value)}
        />
        <button
          type="submit"
        >
          Добавить список
        </button>
      </form>
      {todos.length > 0 && (
        <>
          {todos.map(todo => (
            <div key={todo.id}>
              <h2>{todo.name} - {todo.createdAt}</h2>
              <TodoList />
            </div>
          ))}
        </>
      )}
    </>
  )
}