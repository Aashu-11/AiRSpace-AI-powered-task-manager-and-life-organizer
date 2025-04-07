
// Utility functions for managing data in localStorage

/**
 * Generic function to save data to localStorage
 */
export function saveToLocalStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving data to localStorage for key "${key}":`, error);
  }
}

/**
 * Generic function to get data from localStorage
 */
export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : defaultValue;
  } catch (error) {
    console.error(`Error getting data from localStorage for key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Generic function to remove data from localStorage
 */
export function removeFromLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing data from localStorage for key "${key}":`, error);
  }
}

// Constants for localStorage keys
export const STORAGE_KEYS = {
  MESSAGES: 'airavat_messages',
  TASKS: 'airavat_tasks',
  TIME_BLOCKS: 'airavat_time_blocks',
  COACHING_SESSIONS: 'airavat_coaching_sessions',
  FLOW_STATE_SESSIONS: 'airavat_flow_state_sessions',
  GENERATED_IDEAS: 'airavat_generated_ideas',
  PRODUCTIVITY_INSIGHTS: 'airavat_productivity_insights',
  FEEDBACK_REQUESTS: 'airavat_feedback_requests',
  HABIT_PLANS: 'airavat_habit_plans',
  USER_PREFERENCES: 'airavat_user_preferences',
  NOTIFICATIONS: 'airavat_notifications'
};
