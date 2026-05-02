export interface TodoElementType {
  id: string;
  value: string;
  completed: boolean;
  createdAt: number;
}

export interface TodoListType {
  id: string;
  name: string;
  tasks: TodoElementType[];
  createdAt: number;
}