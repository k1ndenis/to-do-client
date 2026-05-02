import { useState } from "react"
import type { TodoElementType } from "../../types/types"

interface TodoListProps {
  listId: string;
  tasks: TodoElementType[];
  onAddTask: (listId: string, taskValue: string) => void;
  onToggleTask: (listId: string, taskId: string) => void;
  onDeleteTask: (listId: string, taskId: string) => void;
}

export const TodoList = ({ listId, tasks, onAddTask, onToggleTask, onDeleteTask }: TodoListProps) => {
  const [currentTask, setCurrentTask] = useState<string>("");

  const addTask = (taskValue: string) => {
    if (!taskValue.trim()) return;
    onAddTask(listId, taskValue);
    setCurrentTask("");
  }

  return (
    <div>
      <form className="add-task-form" onSubmit={(e) => {
        e.preventDefault();
        addTask(currentTask);
      }}>
        <input
          className="add-task-input"
          placeholder="Новая задача..."
          value={currentTask}
          onChange={(e) => setCurrentTask(e.target.value)}
        />
        <button className="add-task-button" type="submit">
          + Добавить
        </button>
      </form>

      {tasks.length === 0 && (
        <div className="empty-tasks-message">
          ✨ Нет задач. Добавьте первую!
        </div>
      )}

      {tasks.length > 0 && (
        <ul className="tasks-list">
          {tasks.map(task => (
            <li key={task.id} className="task-item">
              <input
                type="checkbox"
                className="task-checkbox"
                checked={task.completed}
                onChange={() => onToggleTask(listId, task.id)}
              />
              <span className={`task-text ${task.completed ? 'completed' : ''}`}>
                {task.value}
              </span>
              <span className="task-time">
                {new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <button
                className="delete-task-btn"
                onClick={() => onDeleteTask(listId, task.id)}
                title="Удалить задачу"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}