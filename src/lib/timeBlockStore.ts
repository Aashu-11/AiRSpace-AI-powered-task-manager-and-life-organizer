
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { saveToLocalStorage, getFromLocalStorage, STORAGE_KEYS } from './localStorage';
import { toast } from '@/hooks/use-toast';

export interface TimeBlock {
  id: string;
  time: string;
  duration: string;
  title: string;
  category: string;
  completed: boolean;
  aiOptimized: boolean;
  createdAt: string;
}

interface TimeBlockState {
  timeBlocks: TimeBlock[];
  addTimeBlock: (timeBlock: Partial<TimeBlock>) => void;
  toggleTimeBlockCompletion: (id: string) => void;
  updateTimeBlock: (id: string, updates: Partial<TimeBlock>) => void;
  deleteTimeBlock: (id: string) => void;
}

// Initial demo time blocks
const initialTimeBlocks: TimeBlock[] = [
  { 
    id: uuidv4(),
    time: "08:00", 
    duration: "60min", 
    title: "Morning Routine", 
    category: "Personal",
    completed: true,
    aiOptimized: false,
    createdAt: new Date().toISOString()
  },
  { 
    id: uuidv4(),
    time: "09:00", 
    duration: "90min", 
    title: "Deep Work: Project Research", 
    category: "Work",
    completed: false,
    aiOptimized: true,
    createdAt: new Date().toISOString()
  },
  { 
    id: uuidv4(),
    time: "10:30", 
    duration: "30min", 
    title: "Coffee Break", 
    category: "Break",
    completed: false,
    aiOptimized: true,
    createdAt: new Date().toISOString()
  },
  { 
    id: uuidv4(),
    time: "11:00", 
    duration: "60min", 
    title: "Team Meeting", 
    category: "Meeting",
    completed: false,
    aiOptimized: false,
    createdAt: new Date().toISOString()
  },
  { 
    id: uuidv4(),
    time: "12:00", 
    duration: "60min", 
    title: "Lunch Break", 
    category: "Break",
    completed: false,
    aiOptimized: true,
    createdAt: new Date().toISOString()
  },
  { 
    id: uuidv4(),
    time: "13:00", 
    duration: "120min", 
    title: "Focused Development Time", 
    category: "Work",
    completed: false,
    aiOptimized: true,
    createdAt: new Date().toISOString()
  }
];

export const useTimeBlockStore = create<TimeBlockState>()((set) => ({
  timeBlocks: getFromLocalStorage(STORAGE_KEYS.TIME_BLOCKS, initialTimeBlocks),
  
  addTimeBlock: (timeBlock) => set((state) => {
    const newTimeBlocks = [
      ...state.timeBlocks,
      {
        id: uuidv4(),
        time: timeBlock.time || '08:00',
        duration: timeBlock.duration || '30min',
        title: timeBlock.title || 'New Time Block',
        category: timeBlock.category || 'Work',
        completed: timeBlock.completed || false,
        aiOptimized: timeBlock.aiOptimized || false,
        createdAt: new Date().toISOString(),
      } as TimeBlock
    ];
    
    // Save to localStorage
    saveToLocalStorage(STORAGE_KEYS.TIME_BLOCKS, newTimeBlocks);
    
    // Show success toast
    toast({
      title: "Time Block added",
      description: `"${timeBlock.title}" has been added to your schedule.`,
    });
    
    return { timeBlocks: newTimeBlocks };
  }),
  
  toggleTimeBlockCompletion: (id) => set((state) => {
    const newTimeBlocks = state.timeBlocks.map(timeBlock => 
      timeBlock.id === id ? { ...timeBlock, completed: !timeBlock.completed } : timeBlock
    );
    
    // Save to localStorage
    saveToLocalStorage(STORAGE_KEYS.TIME_BLOCKS, newTimeBlocks);
    
    // Get the time block that was toggled
    const toggledTimeBlock = newTimeBlocks.find(timeBlock => timeBlock.id === id);
    
    // Show appropriate toast
    if (toggledTimeBlock) {
      toast({
        title: toggledTimeBlock.completed ? "Time Block completed" : "Time Block reopened",
        description: `"${toggledTimeBlock.title}" marked as ${toggledTimeBlock.completed ? 'completed' : 'incomplete'}.`,
      });
    }
    
    return { timeBlocks: newTimeBlocks };
  }),
  
  updateTimeBlock: (id, updates) => set((state) => {
    const newTimeBlocks = state.timeBlocks.map(timeBlock => 
      timeBlock.id === id ? { ...timeBlock, ...updates } : timeBlock
    );
    
    // Save to localStorage
    saveToLocalStorage(STORAGE_KEYS.TIME_BLOCKS, newTimeBlocks);
    
    // Show success toast
    toast({
      title: "Time Block updated",
      description: "Your time block has been updated successfully.",
    });
    
    return { timeBlocks: newTimeBlocks };
  }),
  
  deleteTimeBlock: (id) => set((state) => {
    // Get the time block that will be deleted
    const timeBlockToDelete = state.timeBlocks.find(timeBlock => timeBlock.id === id);
    
    const newTimeBlocks = state.timeBlocks.filter(timeBlock => timeBlock.id !== id);
    
    // Save to localStorage
    saveToLocalStorage(STORAGE_KEYS.TIME_BLOCKS, newTimeBlocks);
    
    // Show success toast
    if (timeBlockToDelete) {
      toast({
        title: "Time Block deleted",
        description: `"${timeBlockToDelete.title}" has been removed.`,
      });
    }
    
    return { timeBlocks: newTimeBlocks };
  }),
}));
