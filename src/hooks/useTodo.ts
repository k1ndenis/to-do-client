import { useState, useEffect, useCallback } from 'react';
import { todoApi } from './../api/todos';
import type { TodoListType } from './../types/types';

export const useTodo = () => {
    const [lists, setLists] = useState<TodoListType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchLists = useCallback(async (sortBy?: string, sortOrder?: 'asc' | 'desc') => {
        setLoading(true);
        try {
            const response = await todoApi.getLists(sortBy, sortOrder);
            setLists(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const createList = async (title: string) => {
        try {
            const response = await todoApi.createList(title);
            setLists(prev => [response.data, ...prev]);
            return response.data;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const deleteList = async (listId: string) => {
        try {
            await todoApi.deleteList(listId);
            setLists(prev => prev.filter(list => list.id !== listId));
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const createTask = async (listId: string, title: string) => {
        try {
            const response = await todoApi.createTask(listId, title);
            setLists(prev => prev.map(list => 
                list.id === listId 
                    ? { ...list, tasks: [response.data, ...list.tasks] }
                    : list
            ));
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const toggleTask = async (listId: string, taskId: string) => {
        try {
            const response = await todoApi.toggleTask(listId, taskId);
            setLists(prev => prev.map(list => ({
                ...list,
                tasks: list.tasks.map(task => 
                    task.id === taskId ? response.data : task
                )
            })));
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const deleteTask = async (listId: string, taskId: string) => {
        try {
            await todoApi.deleteTask(listId, taskId);
            setLists(prev => prev.map(list => ({
                ...list,
                tasks: list.tasks.filter(task => task.id !== taskId)
            })));
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const refresh = useCallback(() => {
        fetchLists();
    }, [fetchLists]);

    useEffect(() => {
        fetchLists();
    }, [fetchLists]);

    return {
        lists,
        loading,
        error,
        createList,
        deleteList,
        createTask,
        toggleTask,
        deleteTask,
        refresh
    };
};