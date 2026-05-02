import { useState } from "react"
import type { TodoElementType } from "../../types/types"

export const TodoList = () => {
  const [todo, setTodo] = useState<TodoElementType[]>([]);
  const [currentTask, setCurrentTask] = useState<string>("");

  const addTask = ( taskValue: string ) => {
    if (!taskValue.trim()) return;
    const task = {
      id: crypto.randomUUID(),
      value: taskValue,
      createdAt: +new Date()
    }
    setTodo(prev => [task, ...prev]);
    setCurrentTask("");
  }

  return (
    <ul>
      <li>
        <input
          placeholder="Введите задачу..."
          value={currentTask}
          onChange={(e) => setCurrentTask(e.target.value)}
        >
        
        </input>
        <button
          onClick={() => addTask(currentTask)}
        >
          Добавить задачу
        </button>
      </li>
      {todo.length > 0 && todo.map((el: TodoElementType) => (
        <li key={el.id}>
          {el.value} - {el.createdAt}
        </li>
      ))}
    </ul>
  )
}