export interface TodoElementType {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

export interface TodoListType {
  id: string;
  title: string;
  tasks: TodoElementType[];
  createdAt: number;
}