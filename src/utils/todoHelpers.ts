import type { TodoListType, TodoElementType } from './../types/types';

export const getIncompleteTasks = (list: TodoListType): TodoElementType[] => {
    return list.tasks.filter((task: TodoElementType) => !task.completed);
};

export const getCompletedTasks = (list: TodoListType): TodoElementType[] => {
    return list.tasks.filter((task: TodoElementType) => task.completed);
};

export const getListStats = (list: TodoListType) => {
    const total = list.tasks.length;
    const completed = list.tasks.filter((t: TodoElementType) => t.completed).length;
    const incomplete = total - completed;
    const progress = total === 0 ? 0 : (completed / total) * 100;
    
    return { total, completed, incomplete, progress };
};

export const sortTasksByDate = (tasks: TodoElementType[], ascending = true): TodoElementType[] => {
    return [...tasks].sort((a, b) => 
        ascending ? a.createdAt - b.createdAt : b.createdAt - a.createdAt
    );
};