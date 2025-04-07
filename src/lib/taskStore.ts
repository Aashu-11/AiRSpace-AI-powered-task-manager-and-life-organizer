
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Task } from './models';
import { saveToLocalStorage, getFromLocalStorage, STORAGE_KEYS } from './localStorage';
import { toast } from '@/hooks/use-toast';

interface TaskState {
  tasks: Task[];
  addTask: (task: Partial<Task>) => void;
  toggleTaskCompletion: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  filterTasks: (filter: string) => Task[];
}

// Initial demo tasks
const initialTasks: Task[] = [
  {
    id: uuidv4(),
    title: "Complete Project Proposal",
    description: "Finalize the project scope and deliverables for client review",
    priority: "high",
    dueDate: "Today, 5:00 PM",
    completed: false,
    aiRecommended: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: "Review Analytics Dashboard",
    description: "Analyze weekly performance metrics and prepare report",
    priority: "medium",
    dueDate: "Today, 3:00 PM",
    completed: false,
    aiRecommended: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: "Team Standup Meeting",
    description: "Daily team sync to discuss progress and blockers",
    priority: "high",
    dueDate: "Today, 10:00 AM",
    completed: true,
    aiRecommended: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: "Client Presentation",
    description: "Present the project progress to the client",
    priority: "high",
    dueDate: "Tomorrow, 2:00 PM",
    completed: false,
    aiRecommended: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: "Research New Technologies",
    description: "Research and document emerging technologies for next sprint",
    priority: "low",
    dueDate: "Wednesday, 12:00 PM",
    completed: false,
    aiRecommended: true,
    createdAt: new Date().toISOString(),
  }
];

export const useTaskStore = create<TaskState>()((set, get) => ({
  tasks: getFromLocalStorage(STORAGE_KEYS.TASKS, initialTasks),
  
  addTask: (task) => set((state) => {
    const newTasks = [
      ...state.tasks,
      {
        id: uuidv4(),
        title: task.title || 'New Task',
        description: task.description || '',
        priority: task.priority || 'medium',
        dueDate: task.dueDate || 'Today',
        completed: task.completed || false,
        aiRecommended: task.aiRecommended || false,
        createdAt: new Date().toISOString(),
      } as Task
    ];
    
    // Save to localStorage
    saveToLocalStorage(STORAGE_KEYS.TASKS, newTasks);
    
    // Show success toast
    toast({
      title: "Task added",
      description: `"${task.title}" has been added to your tasks.`,
    });
    
    return { tasks: newTasks };
  }),
  
  toggleTaskCompletion: (id) => set((state) => {
    const newTasks = state.tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    
    // Save to localStorage
    saveToLocalStorage(STORAGE_KEYS.TASKS, newTasks);
    
    // Get the task that was toggled
    const toggledTask = newTasks.find(task => task.id === id);
    
    // Show appropriate toast
    if (toggledTask) {
      toast({
        title: toggledTask.completed ? "Task completed" : "Task reopened",
        description: `"${toggledTask.title}" marked as ${toggledTask.completed ? 'completed' : 'incomplete'}.`,
      });
    }
    
    return { tasks: newTasks };
  }),
  
  updateTask: (id, updates) => set((state) => {
    const newTasks = state.tasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    );
    
    // Save to localStorage
    saveToLocalStorage(STORAGE_KEYS.TASKS, newTasks);
    
    // Show success toast
    toast({
      title: "Task updated",
      description: "Your task has been updated successfully.",
    });
    
    return { tasks: newTasks };
  }),
  
  deleteTask: (id) => set((state) => {
    // Get the task that will be deleted
    const taskToDelete = state.tasks.find(task => task.id === id);
    
    const newTasks = state.tasks.filter(task => task.id !== id);
    
    // Save to localStorage
    saveToLocalStorage(STORAGE_KEYS.TASKS, newTasks);
    
    // Show success toast
    if (taskToDelete) {
      toast({
        title: "Task deleted",
        description: `"${taskToDelete.title}" has been removed.`,
      });
    }
    
    return { tasks: newTasks };
  }),
  
  filterTasks: (filter) => {
    const { tasks } = get();
    
    return tasks.filter(task => {
      if (filter === 'all') return true;
      if (filter === 'completed') return task.completed;
      if (filter === 'pending') return !task.completed;
      if (filter === 'high') return task.priority === 'high';
      if (filter === 'medium') return task.priority === 'medium';
      if (filter === 'low') return task.priority === 'low';
      return true;
    });
  },
}));