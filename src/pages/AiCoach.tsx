
import React, { useState } from 'react';
import { Brain, Sparkles, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { getCoachingAdvice } from '@/lib/gemini';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';

const topicAreas = [
  "Time Management",
  "Focus & Concentration",
  "Goal Setting",
  "Procrastination",
  "Work-Life Balance",
  "Study Efficiency",
  "Project Management",
  "Deep Work",
  "Prioritization",
  "Energy Management"
];

const experienceLevels = [
  "Complete Beginner",
  "Some Knowledge",
  "Intermediate",
  "Advanced But Struggling",
  "Expert Seeking Optimization"
];

const AiCoach = () => {
  const [topic, setTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [level, setLevel] = useState('');
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAdvice, setShowAdvice] = useState(false);
  const [sessionHistory, setSessionHistory] = useState<{date: string, topic: string}[]>([
    {date: "2 days ago", topic: "Overcoming Procrastination"},
    {date: "Last week", topic: "Study Efficiency Techniques"},
  ]);

  const handleGetAdvice = async () => {
    const finalTopic = topic === 'custom' ? customTopic : topic;
    
    if (!finalTopic || !level) {
      toast({
        title: "Missing information",
        description: "Please select both a topic and your current level",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await getCoachingAdvice(finalTopic, level);
      
      if (response.error) {
        toast({
          title: "Error getting advice",
          description: response.error,
          variant: "destructive"
        });
      } else {
        setAdvice(response.text);
        setShowAdvice(true);
        
        // Add to session history
        setSessionHistory([
          {date: "Just now", topic: finalTopic},
          ...sessionHistory
        ]);
        
        toast({
          title: "Coaching advice ready",
          description: "Your personalized advice has been generated"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get coaching advice. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-3xl font-bold font-orbitron mb-2 flex items-center">
          <Sparkles className="text-airavat-cyan mr-3" size={28} />
          AI Productivity Coach
        </h1>
        <p className="text-white/70">
          Get personalized coaching and advice tailored to your specific productivity challenges
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main coaching interaction */}
        <div className="lg:col-span-2 space-y-6">
          {!showAdvice ? (
            <motion.div 
              className="glass p-6 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold mb-4">What would you like coaching on today?</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-white/70 mb-2 block">Select a productivity area</label>
                  <Select value={topic} onValueChange={setTopic}>
                    <SelectTrigger className="glass-dark w-full">
                      <SelectValue placeholder="Choose a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {topicAreas.map((area) => (
                        <SelectItem key={area} value={area}>{area}</SelectItem>
                      ))}
                      <SelectItem value="custom">Custom Topic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {topic === 'custom' && (
                  <div>
                    <label className="text-sm text-white/70 mb-2 block">Describe your custom topic</label>
                    <Textarea 
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                      placeholder="Describe what you need coaching on..."
                      className="glass-dark w-full"
                    />
                  </div>
                )}
                
                <div>
                  <label className="text-sm text-white/70 mb-2 block">Your current level</label>
                  <Select value={level} onValueChange={setLevel}>
                    <SelectTrigger className="glass-dark w-full">
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevels.map((level) => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={handleGetAdvice} 
                  className="btn-glow w-full mt-4"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Advice...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Get Personalized Coaching
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              className="glass p-6 rounded-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Your Personalized Coaching</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowAdvice(false)}
                >
                  New Session
                </Button>
              </div>
              
              <div className="glass-dark p-4 rounded-lg mb-4">
                <div className="flex items-center mb-2">
                  <div className="h-2 w-2 rounded-full bg-airavat-cyan animate-pulse-glow mr-2"></div>
                  <p className="text-sm text-white/70">Topic: {topic === 'custom' ? customTopic : topic}</p>
                </div>
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse-glow mr-2"></div>
                  <p className="text-sm text-white/70">Level: {level}</p>
                </div>
              </div>
              
              <div className="glass-dark p-6 rounded-lg border border-airavat-cyan/30 bg-gradient-to-br from-transparent to-airavat-cyan/5">
                <div className="prose prose-invert max-w-none">
                  {advice.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={() => setShowAdvice(false)}>
                  New Coaching Session
                </Button>
                <Button className="btn-glow">
                  Save To My Notes <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
          
          <div className="glass p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Recommended Learning Paths</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "Deep Work Mastery",
                  level: "Intermediate",
                  duration: "4 weeks",
                  modules: 5,
                  color: "from-blue-500/20 to-airavat-cyan/20"
                },
                {
                  title: "Overcoming Procrastination",
                  level: "Beginner",
                  duration: "2 weeks",
                  modules: 3,
                  color: "from-purple-500/20 to-pink-500/20"
                },
                {
                  title: "Strategic Time Management",
                  level: "Advanced",
                  duration: "6 weeks",
                  modules: 8,
                  color: "from-amber-500/20 to-red-500/20"
                },
                {
                  title: "Flow State Techniques",
                  level: "Intermediate",
                  duration: "3 weeks",
                  modules: 4,
                  color: "from-emerald-500/20 to-cyan-500/20"
                }
              ].map((path, index) => (
                <div 
                  key={index}
                  className={`glass-dark rounded-lg p-4 border border-white/10 bg-gradient-to-br ${path.color} hover:border-airavat-cyan/50 transition-all duration-300 cursor-pointer`}
                >
                  <h3 className="font-medium">{path.title}</h3>
                  <div className="flex justify-between text-sm text-white/60 mt-2">
                    <span>{path.level}</span>
                    <span>{path.duration}</span>
                  </div>
                  <div className="flex items-center mt-3">
                    <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-airavat-cyan to-purple-500 rounded-full" style={{width: '0%'}}></div>
                    </div>
                    <span className="text-xs text-white/60 ml-2">{path.modules} modules</span>
                  </div>
                </div>
              ))}
            </div>
            
            <Button className="w-full mt-4 bg-white/5 hover:bg-white/10 border border-white/10">
              Explore All Learning Paths
            </Button>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Your Coaching History</h2>
            
            <div className="space-y-3">
              {sessionHistory.map((session, index) => (
                <div key={index} className="glass-dark p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                  <h4 className="font-medium">{session.topic}</h4>
                  <p className="text-xs text-white/60 mt-1">{session.date}</p>
                </div>
              ))}
            </div>
            
            {sessionHistory.length > 2 && (
              <button className="w-full text-center text-sm text-white/60 hover:text-white mt-3 py-2">
                View All Sessions
              </button>
            )}
          </div>
          
          <div className="glass p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Progress & Achievements</h2>
            
            <div className="space-y-4">
              <div className="relative">
                <div className="flex justify-between text-sm mb-1">
                  <span>Weekly Coaching Goal</span>
                  <span className="text-airavat-cyan">2/3</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-airavat-cyan to-purple-500 rounded-full" style={{width: '66%'}}></div>
                </div>
              </div>
              
              <div className="glass-dark p-3 rounded-lg">
                <div className="flex items-center">
                  <div className="rounded-full bg-airavat-cyan/20 p-2 mr-3">
                    <CheckCircle className="text-airavat-cyan h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Consistency Champion</h4>
                    <p className="text-xs text-white/60">3 weeks of regular coaching</p>
                  </div>
                </div>
              </div>
              
              <div className="glass-dark p-3 rounded-lg">
                <div className="flex items-center">
                  <div className="rounded-full bg-purple-500/20 p-2 mr-3">
                    <Sparkles className="text-purple-400 h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Focus Explorer</h4>
                    <p className="text-xs text-white/60">Completed 5 deep work sessions</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Button className="w-full mt-4 bg-white/5 hover:bg-white/10 border border-white/10">
              View All Achievements
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiCoach;
