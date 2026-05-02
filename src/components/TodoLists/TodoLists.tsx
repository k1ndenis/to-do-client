import { useState, useEffect } from "react"
import { TodoList } from "../TodoList/TodoList";
import type { TodoListType, TodoElementType } from "../../types/types";
import {
  DndContext,
  closestCenter,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableTodoCard({ todo, children }: { todo: TodoListType; children: React.ReactNode }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="todo-list-card">
      {/* Отдельный блок для захвата мышкой (ручка перетаскивания) */}
      <div {...attributes} {...listeners} className="drag-handle">
        ⋮⋮
      </div>
      {children}
    </div>
  );
}

export const TodoLists = () => {
  const [todos, setTodos] = useState<TodoListType[]>(() => {
    const savedTodos = localStorage.getItem('todo-lists');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  const [sortConfig, setSortConfig] = useState<{ [key: string]: string }>(() => {
    const savedSortConfig = localStorage.getItem('todo-sort-config');
    return savedSortConfig ? JSON.parse(savedSortConfig) : {};
  });

  const [currentTodoName, setCurrentTodoName] = useState<string>("");

  useEffect(() => {
    localStorage.setItem('todo-lists', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('todo-sort-config', JSON.stringify(sortConfig));
  }, [sortConfig]);

  const createTodo = (name: string) => {
    if (!name.trim()) return;
    const todoList: TodoListType = {
      id: crypto.randomUUID(),
      name: name,
      tasks: [],
      createdAt: +new Date()
    };
    setTodos(prev => [todoList, ...prev]);
    setCurrentTodoName("");
  }

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(list => list.id !== id));
    setSortConfig(prev => {
      const newConfig = { ...prev };
      delete newConfig[id];
      return newConfig;
    });
  }

  const addTaskToList = (listId: string, taskValue: string) => {
    if (!taskValue.trim()) return;
    const newTask: TodoElementType = {
      id: crypto.randomUUID(),
      value: taskValue,
      completed: false,
      createdAt: +new Date()
    };
    setTodos(prev => prev.map(list =>
      list.id === listId
        ? { ...list, tasks: [newTask, ...list.tasks] }
        : list
    ));
  }

  const toggleTaskInList = (listId: string, taskId: string) => {
    setTodos(prev => prev.map(list =>
      list.id === listId
        ? {
            ...list,
            tasks: list.tasks.map(task =>
              task.id === taskId
                ? { ...task, completed: !task.completed }
                : task
            )
          }
        : list
    ));
  }

  const deleteTaskFromList = (listId: string, taskId: string) => {
    setTodos(prev => prev.map(list =>
      list.id === listId
        ? { ...list, tasks: list.tasks.filter(task => task.id !== taskId) }
        : list
    ));
  }

  const sortTodo = (listId: string) => {
    const currentSort = sortConfig[listId];
    let nextSort = 'date-desc';
    
    if (currentSort === 'date-desc') nextSort = 'date-asc';
    else if (currentSort === 'date-asc') nextSort = 'status';
    else if (currentSort === 'status') nextSort = 'alpha-asc';
    else if (currentSort === 'alpha-asc') nextSort = 'alpha-desc';
    else nextSort = 'date-desc';
    
    setSortConfig(prev => ({ ...prev, [listId]: nextSort }));
    
    setTodos(prev => prev.map(list => {
      if (list.id !== listId) return list;
      
      const sortedTasks = [...list.tasks];
      
      switch (nextSort) {
        case 'date-desc':
          sortedTasks.sort((a, b) => b.createdAt - a.createdAt);
          break;
        case 'date-asc':
          sortedTasks.sort((a, b) => a.createdAt - b.createdAt);
          break;
        case 'status':
          sortedTasks.sort((a, b) => Number(a.completed) - Number(b.completed));
          break;
        case 'alpha-asc':
          sortedTasks.sort((a, b) => a.value.localeCompare(b.value));
          break;
        case 'alpha-desc':
          sortedTasks.sort((a, b) => b.value.localeCompare(a.value));
          break;
      }
      
      return { ...list, tasks: sortedTasks };
    }));
  }

  const getSortIcon = (listId: string) => {
    const currentSort = sortConfig[listId];
    switch (currentSort) {
      case 'date-desc': return '📅 ↓';
      case 'date-asc': return '📅 ↑';
      case 'status': return '✓';
      case 'alpha-asc': return 'A→Z';
      case 'alpha-desc': return 'Z→A';
      default: return '⇅';
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = todos.findIndex(t => t.id === active.id);
    const newIndex = todos.findIndex(t => t.id === over.id);
    const newTodos = arrayMove(todos, oldIndex, newIndex);
    setTodos(newTodos);
  };

  return (
    <div className="todo-lists-section">
      <form className="create-list-form" onSubmit={(e) => {
        e.preventDefault();
        createTodo(currentTodoName);
      }}>
        <input
          className="create-list-input"
          placeholder="Введите название списка..."
          value={currentTodoName}
          onChange={(e) => setCurrentTodoName(e.target.value)}
        />
        <button className="create-list-button" type="submit">
          + Создать список
        </button>
      </form>

      {todos.length === 0 && (
        <div className="empty-message">
          ✨ Создайте свой первый список задач
        </div>
      )}

      {todos.length > 0 && (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={todos.map(t => t.id)}>
            <div className="todo-lists-grid">
              {todos.map(todo => (
                <SortableTodoCard key={todo.id} todo={todo}>
                  <div className="todo-list-header">
                    <h3 className="todo-list-title">{todo.name}</h3>
                    <div className="todo-list-buttons">
                      <button 
                        className="sort-list-btn"
                        onClick={() => sortTodo(todo.id)}
                        title="Сортировать задачи"
                      >
                        {getSortIcon(todo.id)}
                      </button>
                      <button 
                        className="delete-list-btn"
                        onClick={() => deleteTodo(todo.id)}
                        title="Удалить список"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="todo-list-body">
                    <TodoList
                      listId={todo.id}
                      tasks={todo.tasks}
                      onAddTask={addTaskToList}
                      onToggleTask={toggleTaskInList}
                      onDeleteTask={deleteTaskFromList}
                    />
                  </div>
                </SortableTodoCard>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}