
import React, { useState } from 'react';
import { Flame, Brain, Target, Activity, Loader2, Check, XCircle, Trophy, ChevronDown, CalendarCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { HabitPlan } from '@/lib/models';
import { getHabitFormationPlan } from '@/lib/gemini';
import { toast } from '@/hooks/use-toast';

const HabitBuilder = () => {
  const [loading, setLoading] = useState(false);
  const [activeHabit, setActiveHabit] = useState<HabitPlan | null>(null);
  const [formData, setFormData] = useState({
    goal: '',
    obstacles: '',
    motivationLevel: 'medium'
  });
  const [myHabits, setMyHabits] = useState<HabitPlan[]>([
    {
      id: '1',
      goal: 'Daily meditation practice',
      obstacles: 'Busy schedule, Distractions',
      motivationLevel: 'high',
      plan: 'Start with 5 minutes each morning, gradually increase to 20 minutes. Use a quiet space and timer app. Track consistency on calendar.',
      startDate: new Date(Date.now() - 12*24*60*60*1000).toISOString(),
      currentStreak: 12,
      createdAt: new Date(Date.now() - 12*24*60*60*1000).toISOString()
    },
    {
      id: '2',
      goal: 'Reading 30 minutes daily',
      obstacles: 'Digital distractions, Tiredness',
      motivationLevel: 'medium',
      plan: 'Read before bed instead of screen time. Keep book visible on nightstand. Join online book club for accountability.',
      startDate: new Date(Date.now() - 5*24*60*60*1000).toISOString(),
      currentStreak: 5,
      createdAt: new Date(Date.now() - 5*24*60*60*1000).toISOString()
    }
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMotivationChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      motivationLevel: value
    }));
  };

  const generatePlan = async () => {
    if (!formData.goal || !formData.obstacles) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields to generate a habit plan.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await getHabitFormationPlan(
        formData.goal,
        formData.obstacles,
        formData.motivationLevel
      );

      if (response.error) {
        throw new Error(response.error);
      }

      const newHabit: HabitPlan = {
        id: `hab-${Date.now()}`,
        goal: formData.goal,
        obstacles: formData.obstacles,
        motivationLevel: formData.motivationLevel,
        plan: response.text,
        startDate: new Date().toISOString(),
        currentStreak: 0,
        createdAt: new Date().toISOString()
      };

      setMyHabits(prev => [newHabit, ...prev]);
      setActiveHabit(newHabit);
      
      toast({
        title: "Habit plan created!",
        description: "Your personalized habit formation plan is ready",
        variant: "default" 
      });
      
      // Reset form
      setFormData({
        goal: '',
        obstacles: '',
        motivationLevel: 'medium'
      });
    } catch (error) {
      console.error('Error generating habit plan:', error);
      toast({
        title: "Failed to generate plan",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const completeToday = (habitId: string) => {
    setMyHabits(prev => prev.map(habit => 
      habit.id === habitId 
        ? { ...habit, currentStreak: habit.currentStreak + 1 } 
        : habit
    ));
    
    toast({
      title: "Streak updated!",
      description: "Great job maintaining your habit consistency",
      variant: "default"
    });
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-3xl font-bold font-orbitron mb-2 flex items-center">
          <Flame className="text-airavat-cyan mr-3" size={28} />
          AI Habit Builder
        </h1>
        <p className="text-white/70">
          Create, track, and maintain productive habits with AI-powered guidance
        </p>
      </div>
      
      <Tabs defaultValue="myHabits" className="glass rounded-xl p-6">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="myHabits">My Habits</TabsTrigger>
          <TabsTrigger value="create">Create New Habit</TabsTrigger>
        </TabsList>
        
        <TabsContent value="myHabits" className="space-y-6">
          {myHabits.length === 0 ? (
            <div className="text-center py-12">
              <Brain className="mx-auto text-white/30 mb-4" size={64} />
              <h3 className="text-xl font-medium mb-2">No habits yet</h3>
              <p className="text-white/60 mb-4">Create your first habit to start building better routines</p>
              <Button variant="outline" onClick={() => document.querySelector('[value="create"]')?.dispatchEvent(new Event('click'))}>
                Create Your First Habit
              </Button>
            </div>
          ) : (
            <>
              {activeHabit && (
                <Card className="glass-dark p-6 mb-6 border-airavat-cyan/30">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{activeHabit.goal}</h3>
                      <div className="flex items-center gap-2 text-sm text-white/60 mb-4">
                        <CalendarCheck size={14} />
                        <span>Started {new Date(activeHabit.startDate).toLocaleDateString()}</span>
                        <span className="inline-flex items-center gap-1 bg-airavat-cyan/20 text-airavat-cyan px-2 py-0.5 rounded-full text-xs">
                          <Trophy size={12} /> {activeHabit.currentStreak} day streak
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-green-400 border-green-400/30 hover:bg-green-400/10"
                      onClick={() => completeToday(activeHabit.id)}
                    >
                      <Check size={16} className="mr-1" /> Complete Today
                    </Button>
                  </div>
                  
                  <Progress value={(activeHabit.currentStreak / 30) * 100} className="h-2 mb-4" />
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="plan" className="border-white/10">
                      <AccordionTrigger className="text-sm font-medium py-2">View AI Generated Plan</AccordionTrigger>
                      <AccordionContent className="text-sm whitespace-pre-line bg-black/20 p-4 rounded-lg">
                        {activeHabit.plan}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </Card>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myHabits.map(habit => (
                  <Card 
                    key={habit.id} 
                    className={`p-4 hover:bg-white/5 transition-colors cursor-pointer border-white/10 ${activeHabit?.id === habit.id ? 'bg-white/5 border-airavat-cyan/30' : ''}`}
                    onClick={() => setActiveHabit(habit)}
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium mb-1 truncate">{habit.goal}</h3>
                        <div className="flex items-center text-xs text-white/60">
                          <CalendarCheck size={12} className="mr-1" />
                          <span className="mr-2">Day {habit.currentStreak}</span>
                          <Activity size={12} className="mr-1" />
                          <span>{habit.motivationLevel} motivation</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-airavat-cyan/30 to-airavat-purple/30 text-white font-bold">
                          {habit.currentStreak}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="create" className="space-y-6">
          <Card className="glass-dark p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Brain className="text-airavat-cyan mr-2" size={18} />
              AI Habit Formation Plan
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="goal">What habit do you want to build?</Label>
                <Input 
                  id="goal" 
                  name="goal" 
                  placeholder="E.g., Daily meditation, Regular exercise, Reading books..." 
                  value={formData.goal}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="obstacles">What obstacles might prevent you?</Label>
                <Textarea 
                  id="obstacles" 
                  name="obstacles" 
                  placeholder="E.g., Lack of time, Distractions, Forgetfulness..." 
                  value={formData.obstacles}
                  onChange={handleInputChange}
                  className="mt-1"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="motivationLevel">Your current motivation level</Label>
                <Select 
                  value={formData.motivationLevel} 
                  onValueChange={handleMotivationChange}
                >
                  <SelectTrigger id="motivationLevel" className="mt-1">
                    <SelectValue placeholder="Select your motivation level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - I need extra help staying motivated</SelectItem>
                    <SelectItem value="medium">Medium - I'm reasonably motivated</SelectItem>
                    <SelectItem value="high">High - I'm very determined</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={generatePlan} 
                disabled={loading}
                className="w-full mt-2 btn-glow"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating your plan...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Generate Personalized Habit Plan
                  </>
                )}
              </Button>
            </div>
          </Card>
          
          <Card className="p-6 border-white/10 bg-white/5">
            <h3 className="text-lg font-bold mb-4">How AI Builds Better Habits</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black/20 p-4 rounded-lg">
                <div className="size-10 rounded-full bg-gradient-to-br from-airavat-cyan/20 to-airavat-purple/20 flex items-center justify-center mb-3">
                  <Brain className="h-5 w-5 text-airavat-cyan" />
                </div>
                <h4 className="text-sm font-medium mb-1">Neural Pathway Analysis</h4>
                <p className="text-xs text-white/60">Maps your brain's habit formation pathways for optimal reinforcement</p>
              </div>
              
              <div className="bg-black/20 p-4 rounded-lg">
                <div className="size-10 rounded-full bg-gradient-to-br from-airavat-cyan/20 to-airavat-purple/20 flex items-center justify-center mb-3">
                  <Activity className="h-5 w-5 text-purple-400" />
                </div>
                <h4 className="text-sm font-medium mb-1">Behavioral Adjustment</h4>
                <p className="text-xs text-white/60">Adaptive techniques based on your specific motivation patterns</p>
              </div>
              
              <div className="bg-black/20 p-4 rounded-lg">
                <div className="size-10 rounded-full bg-gradient-to-br from-airavat-cyan/20 to-airavat-purple/20 flex items-center justify-center mb-3">
                  <Target className="h-5 w-5 text-green-400" />
                </div>
                <h4 className="text-sm font-medium mb-1">Implementation Intentions</h4>
                <p className="text-xs text-white/60">Creates precise when-where-how plans proven to increase success rates</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HabitBuilder;
