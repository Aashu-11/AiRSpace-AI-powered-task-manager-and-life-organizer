
// Gemini API utility functions
import { getFromLocalStorage, saveToLocalStorage } from './localStorage';

export type GeminiResponse = {
  text: string;
  error?: string;
};

export type GeminiRequest = {
  prompt: string;
  temperature?: number;
  maxOutputTokens?: number;
  topK?: number;
  topP?: number;
  cacheKey?: string; // Optional cache key for storing responses
};

// Cache for storing responses
const CACHE_KEY = 'gemini_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface CacheEntry {
  response: GeminiResponse;
  timestamp: number;
}

interface CacheStore {
  [key: string]: CacheEntry;
}

// Get cache from localStorage
const getCache = (): CacheStore => {
  return getFromLocalStorage<CacheStore>(CACHE_KEY, {});
};

// Save cache to localStorage
const saveCache = (cache: CacheStore): void => {
  saveToLocalStorage(CACHE_KEY, cache);
};

// Check if a cached response is valid (not expired)
const isCacheValid = (entry: CacheEntry): boolean => {
  return Date.now() - entry.timestamp < CACHE_DURATION;
};

export async function askGemini(request: GeminiRequest): Promise<GeminiResponse> {
  const { prompt, temperature = 0.7, maxOutputTokens = 1000, topK = 40, topP = 0.95, cacheKey } = request;
  
  // If cacheKey is provided, check if we have a valid cached response
  if (cacheKey) {
    const cache = getCache();
    const cacheEntry = cache[cacheKey];
    
    if (cacheEntry && isCacheValid(cacheEntry)) {
      console.log('Using cached response for:', cacheKey);
      return cacheEntry.response;
    }
  }
  
  try {
    const API_KEY = "AIzaSyAA7anyauDrMwxg4Mu6i7KWlp97qUk7j70";
    const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
    
    // Show user we're making an API call in a non-blocking way
    console.log('Calling Gemini API...');
    
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature,
          topK,
          topP,
          maxOutputTokens,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.error) {
      console.error("Gemini API error:", data.error);
      return { 
        text: "I'm sorry, I couldn't process your request at the moment.", 
        error: data.error.message 
      };
    }

    // Handle potential response structure issues
    if (!data.candidates || !data.candidates[0]?.content?.parts?.length) {
      throw new Error("Unexpected response structure from Gemini API");
    }

    const result = { 
      text: data.candidates[0].content.parts[0].text 
    };
    
    // Cache the response if cacheKey is provided
    if (cacheKey) {
      const cache = getCache();
      cache[cacheKey] = {
        response: result,
        timestamp: Date.now()
      };
      saveCache(cache);
    }
    
    return result;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    
    // For network-related errors, provide a more specific message
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return { 
        text: "I'm having trouble connecting to my AI services. Please check your internet connection and try again.",
        error: error instanceof Error ? error.message : String(error)
      };
    }
    
    return { 
      text: "I'm having trouble connecting to my AI services. Please try again later.",
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// AI Coach specific prompts
export async function getCoachingAdvice(topic: string, currentLevel: string): Promise<GeminiResponse> {
  const cacheKey = `coaching_${topic}_${currentLevel}`;
  
  return askGemini({
    prompt: `
      Act as an expert AI productivity coach. Provide personalized advice for someone who describes their current situation as:
      
      Topic: ${topic}
      Current Level: ${currentLevel}
      
      Give 3-5 specific, actionable tips they can implement today to improve. Format your response in a motivational tone with bullet points.Do not inlcude any kind of special characters like * , # etc.This is a strict warning i should not see nay kind of special characters in between or annywhere in the text response.
    `,
    temperature: 0.3,
    cacheKey
  });
}

// Flow State prompts
export async function getFlowStateRecommendations(
  currentMood: string, 
  energyLevel: string,
  availableTime: number
): Promise<GeminiResponse> {
  const cacheKey = `flow_${currentMood}_${energyLevel}_${availableTime}`;
  
  return askGemini({
    prompt: `
      Act as an expert in flow state psychology and productivity. Based on the following information:
      
      Current Mood: ${currentMood}
      Energy Level: ${energyLevel}
      Available Time: ${availableTime} minutes
      
      Recommend the ideal type of task to work on right now to achieve flow state. Include specific recommendations for:
      1. Task complexity level
      2. Environment optimization (noise level, lighting, etc.)
      3. How to eliminate distractions
      4. A specific technique to help enter flow state quickly
      
      Format your response in short, clear paragraphs with helpful tips.Do not inlcude any kind of special characters like * , # etc.This is a strict warning i should not see nay kind of special characters in between.
    `,
    temperature: 0.2,
    cacheKey
  });
}

// Idea Generator prompts
export async function generateIdeas(topic: string, constraints: string, count: number): Promise<GeminiResponse> {
  const cacheKey = `ideas_${topic}_${constraints}_${count}`;
  
  return askGemini({
    prompt: `
      Act as an innovative idea generator expert. Generate ${count} unique and creative ideas related to:
      
      Topic: ${topic}
      Constraints/Requirements: ${constraints}
      
      For each idea provide:
      1. A catchy name/title
      2. A short description (2-3 sentences)
      3. One key advantage or benefit
      
      Format each idea as a separate numbered item with clear headings.Do not inlcude any kind of special characters like * , # etc.This is a strict warning i should not see nay kind of special characters in between.
    `,
    temperature: 0.9,
    maxOutputTokens: 1500,
    cacheKey
  });
}

// Productivity AI
export async function analyzeProductivityData(
  productiveHours: string[], 
  commonDistractions: string[], 
  completedTasks: number,
  totalWorkTime: number
): Promise<GeminiResponse> {
  const cacheKey = `productivity_${productiveHours.join('_')}_${commonDistractions.join('_')}_${completedTasks}_${totalWorkTime}`;
  
  return askGemini({
    prompt: `
      Act as an AI productivity analyst. Based on the following user data:
      
      Most Productive Hours: ${productiveHours.join(', ')}
      Common Distractions: ${commonDistractions.join(', ')}
      Completed Tasks: ${completedTasks}
      Total Work Time: ${totalWorkTime} hours
      
      Provide the following analysis:
      1. Productivity patterns and insights
      2. Specific recommendations to optimize their schedule
      3. Actionable tips to minimize their specific distractions
      4. A suggested daily schedule based on their most productive hours
      
      Format your response in clear sections with concise, actionable advice.Do not inlcude any kind of special characters like * , # etc.This is a strict warning i should not see nay kind of special characters in between.
    `,
    temperature: 0.3,
    cacheKey
  });
}

// AI Feedback
export async function getAIFeedback(
  workSample: string,
  feedbackType: string,
  specificConcerns: string
): Promise<GeminiResponse> {
  // Don't cache feedback as it's likely to be unique each time
  return askGemini({
    prompt: `
      Act as an expert mentor providing constructive feedback. Review the following work:
      
      "${workSample}"
      
      Feedback Type Requested: ${feedbackType}
      Specific Concerns: ${specificConcerns}
      
      Provide detailed, constructive feedback including:
      1. Overall assessment (strengths and areas for improvement)
      2. Specific examples of what works well
      3. Concrete suggestions for improvement
      4. Priority areas to focus on next
      
      Be honest but supportive, with actionable advice the person can implement.Do not inlcude any kind of special characters like * , # etc.This is a strict warning i should not see nay kind of special characters in between.
    `,
    temperature: 0.4
  });
}

// Habit Builder
export async function getHabitFormationPlan(
  habitGoal: string,
  currentObstacles: string,
  motivationLevel: string
): Promise<GeminiResponse> {
  const cacheKey = `habit_${habitGoal}_${currentObstacles}_${motivationLevel}`;
  
  return askGemini({
    prompt: `
      Act as an expert in habit formation and behavior change. Help create a personalized plan for:
      
      Habit Goal: ${habitGoal}
      Current Obstacles: ${currentObstacles}
      Motivation Level: ${motivationLevel}
      
      Provide a comprehensive 30-day habit building plan including:
      1. A specific implementation intention (when-where-how plan)
      2. How to track progress (specific metrics)
      3. Environmental changes to support the habit
      4. Techniques to overcome the specific obstacles mentioned
      5. How to maintain motivation, especially for their stated motivation level
      6. A contingency plan for setbacks
      
      Format as a clear, step-by-step plan with daily/weekly milestones.Do not inlcude any kind of special characters like * , # etc.This is a strict warning i should not see nay kind of special characters in between.
    `,
    temperature: 0.4,
    cacheKey
  });
}
