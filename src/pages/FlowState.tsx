
import React, { useState } from 'react';
import { Zap, Clock, BarChart2, BrainCircuit, Activity, Loader2 } from 'lucide-react';
import { getFlowStateRecommendations } from '@/lib/gemini';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';

const moodOptions = [
  { value: "energetic", label: "Energetic" },
  { value: "focused", label: "Focused" },
  { value: "distracted", label: "Distracted" },
  { value: "tired", label: "Tired" },
  { value: "anxious", label: "Anxious" },
  { value: "creative", label: "Creative" }
];

const energyOptions = [
  { value: "very-low", label: "Very Low" },
  { value: "low", label: "Low" },
  { value: "moderate", label: "Moderate" },
  { value: "high", label: "High" },
  { value: "very-high", label: "Very High" }
];

const FlowState = () => {
  const [currentMood, setCurrentMood] = useState("");
  const [energyLevel, setEnergyLevel] = useState("");
  const [availableTime, setAvailableTime] = useState(45);
  const [recommendations, setRecommendations] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState({
    isActive: false,
    time: availableTime * 60,
    totalTime: availableTime * 60
  });

  const handleGetRecommendations = async () => {
    if (!currentMood || !energyLevel) {
      toast({
        title: "Missing information",
        description: "Please select your current mood and energy level",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await getFlowStateRecommendations(currentMood, energyLevel, availableTime);
      
      if (response.error) {
        toast({
          title: "Error getting recommendations",
          description: response.error,
          variant: "destructive"
        });
      } else {
        setRecommendations(response.text);
        setShowResults(true);
        
        toast({
          title: "Flow state recommendations ready",
          description: "Your personalized flow state plan has been generated"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get flow state recommendations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const startFlowSession = () => {
    setTimer({
      isActive: true,
      time: availableTime * 60,
      totalTime: availableTime * 60
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((timer.totalTime - timer.time) / timer.totalTime) * 100;
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-3xl font-bold font-orbitron mb-2 flex items-center">
          <Zap className="text-airavat-cyan mr-3" size={28} />
          Flow State AI
        </h1>
        <p className="text-white/70">
          Get personalized recommendations to achieve flow state based on your current mood and energy
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main flow state interaction */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div 
                key="input"
                className="glass p-6 rounded-xl mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-xl font-semibold mb-6">How are you feeling right now?</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-medium mb-3">Select your current mood</h3>
                    <RadioGroup 
                      value={currentMood} 
                      onValueChange={setCurrentMood}
                      className="grid grid-cols-2 md:grid-cols-3 gap-3"
                    >
                      {moodOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value={option.value} 
                            id={`mood-${option.value}`}
                            className="border-airavat-cyan text-airavat-cyan" 
                          />
                          <Label htmlFor={`mood-${option.value}`}>{option.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium mb-3">Your energy level</h3>
                    <RadioGroup 
                      value={energyLevel} 
                      onValueChange={setEnergyLevel}
                      className="grid grid-cols-2 md:grid-cols-3 gap-3"
                    >
                      {energyOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value={option.value} 
                            id={`energy-${option.value}`}
                            className="border-airavat-cyan text-airavat-cyan" 
                          />
                          <Label htmlFor={`energy-${option.value}`}>{option.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-md font-medium">Available time</h3>
                      <span className="text-airavat-cyan font-medium">{availableTime} minutes</span>
                    </div>
                    <Slider
                      value={[availableTime]}
                      onValueChange={(value) => setAvailableTime(value[0])}
                      max={120}
                      min={15}
                      step={5}
                      className="my-6"
                    />
                    <div className="flex justify-between text-sm text-white/60">
                      <span>15 min</span>
                      <span>30 min</span>
                      <span>60 min</span>
                      <span>90 min</span>
                      <span>120 min</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleGetRecommendations} 
                    className="btn-glow w-full mt-4"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing Optimal Flow Conditions...
                      </>
                    ) : (
                      <>
                        <BrainCircuit className="mr-2 h-4 w-4" />
                        Generate Flow State Recommendations
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="results"
                className="glass p-6 rounded-xl mb-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Your Flow State Plan</h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowResults(false)}
                  >
                    Start Over
                  </Button>
                </div>
                
                <div className="glass-dark p-4 rounded-lg mb-6 flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-airavat-cyan animate-pulse-glow mr-2"></div>
                    <p className="text-sm text-white/70">Mood: {moodOptions.find(m => m.value === currentMood)?.label || currentMood}</p>
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse-glow mr-2"></div>
                    <p className="text-sm text-white/70">Energy: {energyOptions.find(e => e.value === energyLevel)?.label || energyLevel}</p>
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse-glow mr-2"></div>
                    <p className="text-sm text-white/70">Time: {availableTime} minutes</p>
                  </div>
                </div>
                
                <div className="glass-dark p-6 rounded-lg border border-airavat-cyan/30 bg-gradient-to-br from-transparent to-airavat-cyan/5 mb-6">
                  <div className="prose prose-invert max-w-none">
                    {recommendations.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
                
                {!timer.isActive ? (
                  <Button 
                    onClick={startFlowSession} 
                    className="w-full btn-glow"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Start {availableTime}-Minute Flow Session
                  </Button>
                ) : (
                  <div className="glass-dark p-4 rounded-lg border border-airavat-cyan">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Flow Session in Progress</h3>
                      <span className="text-xl font-orbitron text-airavat-cyan">{formatTime(timer.time)}</span>
                    </div>
                    <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-airavat-cyan to-purple-500 rounded-full transition-all duration-1000 ease-linear" 
                        style={{width: `${getProgressPercentage()}%`}}
                      ></div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="glass p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">What is Flow State?</h2>
            
            <div className="prose prose-invert prose-sm max-w-none mb-4">
              <p>
                Flow state, often described as being "in the zone," is a mental state where you're completely immersed in an activity, 
                experiencing high focus, full involvement, and enjoyment in the process. During flow, people typically experience:
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[
                {
                  title: "Complete Concentration",
                  description: "Deep focus on the task at hand with minimal distractions",
                  icon: BrainCircuit,
                  color: "text-airavat-cyan"
                },
                {
                  title: "Loss of Self-Consciousness",
                  description: "Less awareness of yourself and more focus on the activity",
                  icon: Activity,
                  color: "text-purple-400"
                },
                {
                  title: "Altered Sense of Time",
                  description: "Time seems to pass differently (faster or slower)",
                  icon: Clock,
                  color: "text-amber-400"
                },
                {
                  title: "Intrinsic Reward",
                  description: "The activity becomes inherently rewarding in itself",
                  icon: Zap,
                  color: "text-green-400"
                }
              ].map((item, index) => (
                <div key={index} className="glass-dark p-4 rounded-lg flex">
                  <div className={`rounded-full bg-white/10 p-2 mr-3 ${item.color}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-white/70">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="prose prose-invert prose-sm max-w-none">
              <p>
                Our AI analyzes your current mood, energy levels, and available time to recommend the optimal
                approach to achieve flow state faster, maintain it longer, and maximize your productivity.
              </p>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Your Flow Stats</h2>
            
            <div className="space-y-4">
              <div className="relative">
                <div className="flex justify-between text-sm mb-1">
                  <span>Weekly Flow Time</span>
                  <span className="text-airavat-cyan">3.5 / 5 hours</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-airavat-cyan to-purple-500 rounded-full" style={{width: '70%'}}></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="glass-dark p-3 rounded-lg text-center">
                  <BarChart2 className="h-5 w-5 mx-auto mb-1 text-airavat-cyan" />
                  <p className="text-xs text-white/70">Longest Flow</p>
                  <p className="text-xl font-orbitron">72 min</p>
                </div>
                <div className="glass-dark p-3 rounded-lg text-center">
                  <Activity className="h-5 w-5 mx-auto mb-1 text-purple-400" />
                  <p className="text-xs text-white/70">Flow Quality</p>
                  <p className="text-xl font-orbitron">8.3/10</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Your Flow Rhythm</h2>
            
            <div className="glass-dark rounded-lg p-5 mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/70">When you reach flow easiest:</span>
              </div>
              
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                  <div key={idx} className="text-center text-xs font-medium">{day}</div>
                ))}
                
                {/* Heatmap visualization of flow state throughout the week */}
                {Array.from({ length: 24 }).map((_, hourIdx) => (
                  <React.Fragment key={hourIdx}>
                    {Array.from({ length: 7 }).map((_, dayIdx) => {
                      // Generate intensity based on some pattern
                      const intensity = Math.random();
                      let bgColor = 'bg-white/5';
                      
                      if (intensity > 0.8) bgColor = 'bg-airavat-cyan';
                      else if (intensity > 0.6) bgColor = 'bg-airavat-cyan/70';
                      else if (intensity > 0.4) bgColor = 'bg-airavat-cyan/40';
                      else if (intensity > 0.2) bgColor = 'bg-airavat-cyan/20';
                      
                      return (
                        <div 
                          key={`${hourIdx}-${dayIdx}`} 
                          className={`h-1.5 rounded-sm ${bgColor}`}
                          title={`${hourIdx}:00 - ${(hourIdx+1) % 24}:00`}
                        ></div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
              
              <div className="flex justify-between text-xs text-white/60">
                <span>Morning</span>
                <span>Afternoon</span>
                <span>Evening</span>
              </div>
            </div>
            
            <div className="glass-dark p-4 rounded-lg">
              <h3 className="text-md font-medium mb-2">Flow Enablers</h3>
              
              <div className="space-y-2">
                {[
                  { label: "Instrumental Music", percentage: 87 },
                  { label: "Pomodoro Technique", percentage: 74 },
                  { label: "Morning Hours", percentage: 92 },
                  { label: "After Exercise", percentage: 68 }
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/90">{item.label}</span>
                      <span className="text-airavat-cyan">{item.percentage}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-airavat-cyan to-purple-500 rounded-full" 
                        style={{width: `${item.percentage}%`}}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowState;
