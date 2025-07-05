
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  sharedWith: string[];
}

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  shareTask: (id: string, email: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load tasks from localStorage
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      // Initialize with sample tasks
      const sampleTasks: Task[] = [
        {
          id: '1',
          title: 'Complete React Todo App',
          description: 'Build a comprehensive todo application with authentication and real-time features',
          status: 'in-progress',
          priority: 'high',
          dueDate: '2025-01-10',
          createdAt: '2025-01-05T10:00:00.000Z',
          updatedAt: '2025-01-05T10:00:00.000Z',
          tags: ['React', 'Frontend'],
          sharedWith: []
        },
        {
          id: '2',
          title: 'Setup MongoDB Database',
          description: 'Configure MongoDB Atlas for production deployment',
          status: 'completed',
          priority: 'medium',
          dueDate: '2025-01-08',
          createdAt: '2025-01-04T14:30:00.000Z',
          updatedAt: '2025-01-05T09:15:00.000Z',
          tags: ['Database', 'Backend'],
          sharedWith: ['team@example.com']
        },
        {
          id: '3',
          title: 'Deploy to Production',
          description: 'Deploy frontend to Vercel and backend to Render',
          status: 'todo',
          priority: 'high',
          dueDate: '2025-01-12',
          createdAt: '2025-01-05T16:00:00.000Z',
          updatedAt: '2025-01-05T16:00:00.000Z',
          tags: ['Deployment', 'DevOps'],
          sharedWith: []
        }
      ];
      setTasks(sampleTasks);
      localStorage.setItem('tasks', JSON.stringify(sampleTasks));
    }
  }, []);

  const saveToStorage = (newTasks: Task[]) => {
    localStorage.setItem('tasks', JSON.stringify(newTasks));
  };

  const createTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const newTasks = [...tasks, newTask];
    setTasks(newTasks);
    saveToStorage(newTasks);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const newTasks = tasks.map(task =>
      task.id === id
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    );
    setTasks(newTasks);
    saveToStorage(newTasks);
  };

  const deleteTask = (id: string) => {
    const newTasks = tasks.filter(task => task.id !== id);
    setTasks(newTasks);
    saveToStorage(newTasks);
  };

  const shareTask = (id: string, email: string) => {
    const newTasks = tasks.map(task =>
      task.id === id
        ? { 
            ...task, 
            sharedWith: [...task.sharedWith, email],
            updatedAt: new Date().toISOString()
          }
        : task
    );
    setTasks(newTasks);
    saveToStorage(newTasks);
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      loading,
      createTask,
      updateTask,
      deleteTask,
      shareTask
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};
