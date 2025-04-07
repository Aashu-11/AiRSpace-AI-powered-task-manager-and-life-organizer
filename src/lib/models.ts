
// Data models for the application

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  completed: boolean;
  aiRecommended: boolean;
  createdAt: string;
}

export interface TimeBlock {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  duration: string;
  category: string;
  completed: boolean;
  aiOptimized: boolean;
}

export interface Notification {
  id: number;
  title: string;
  description: string;
  type: string;
  time: string;
  read: boolean;
}

export interface CoachingSession {
  id: string;
  topic: string;
  currentLevel: string;
  advice: string;
  createdAt: string;
}

export interface FlowStateSession {
  id: string;
  mood: string;
  energyLevel: string;
  duration: number;
  recommendations: string;
  createdAt: string;
}

export interface GeneratedIdea {
  id: string;
  title: string;
  description: string;
  benefit: string;
  topic: string;
  createdAt: string;
}

export interface ProductivityInsight {
  id: string;
  productiveHours: string[];
  commonDistractions: string[];
  completedTasks: number;
  totalWorkTime: number;
  analysis: string;
  createdAt: string;
}

export interface FeedbackRequest {
  id: string;
  content: string;
  feedbackType: string;
  concerns: string;
  feedback: string;
  createdAt: string;
}

export interface HabitPlan {
  id: string;
  goal: string;
  obstacles: string;
  motivationLevel: string;
  plan: string;
  startDate: string;
  currentStreak: number;
  createdAt: string;
}
