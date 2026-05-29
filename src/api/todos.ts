import apiClient from "./client";
import type { TodoListType, TodoElementType } from "../types/types";

export const todoApi = {
    getLists: (sortBy?: string, sortOrder?: 'asc' | 'desc') => 
        apiClient.get<TodoListType[]>('/api/lists', { 
            params: { sortBy, sortOrder } 
        }),
    
    createList: (title: string) => 
        apiClient.post<TodoListType>('/api/lists', { title }),
    
    deleteList: (listId: string) => 
        apiClient.delete(`/api/lists/${listId}`),
    
    createTask: (listId: string, title: string) => 
        apiClient.post<TodoElementType>(`/api/lists/${listId}/tasks`, { title }),
    
    deleteTask: (listId: string, taskId: string) => 
        apiClient.delete(`/api/lists/${listId}/tasks/${taskId}`),
    
    toggleTask: (listId: string, taskId: string) => 
        apiClient.patch<TodoElementType>(`/api/lists/${listId}/tasks/${taskId}/toggle`)
};