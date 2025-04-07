
import React, { useState, useMemo } from 'react';
import { Calendar, Clock, CheckCircle2, Brain, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTimeBlockStore, TimeBlock } from '@/lib/timeBlockStore';
import { AddTimeBlock } from '@/components/time-blocks/AddTimeBlock';

const TimeBlocks = () => {
  const isMobile = useIsMobile();
  const { timeBlocks, toggleTimeBlockCompletion, deleteTimeBlock } = useTimeBlockStore();
  const [selectedDay, setSelectedDay] = useState('Today');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Filter time blocks based on selected day and category
  const filteredTimeBlocks = useMemo(() => {
    return timeBlocks.filter(block => {
      const categoryMatch = selectedCategory === 'All' || block.category === selectedCategory;
      // In a real app, we would filter by actual dates
      // For now, we'll just return all blocks since we don't have real date data
      return categoryMatch;
    });
  }, [timeBlocks, selectedDay, selectedCategory]);

  return (
    <div className="p-4 md:p-6 lg:p-10">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-2xl md:text-3xl font-bold font-orbitron mb-2">Time Blocks</h1>
        <p className="text-white/70">
          Optimize your day with AI-suggested time blocks for maximum productivity
        </p>
      </div>
      
      <div className="glass p-4 rounded-xl mb-6 flex flex-col md:flex-row justify-between items-center gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <AddTimeBlock />
          
          <Select value={selectedDay} onValueChange={setSelectedDay}>
            <SelectTrigger className="glass-dark w-auto md:w-[120px]">
              <Calendar size={18} className="mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Today">Today</SelectItem>
              <SelectItem value="Tomorrow">Tomorrow</SelectItem>
              <SelectItem value="Next Week">Next Week</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="glass-dark w-auto md:w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              <SelectItem value="Work">Work</SelectItem>
              <SelectItem value="Meeting">Meeting</SelectItem>
              <SelectItem value="Break">Break</SelectItem>
              <SelectItem value="Personal">Personal</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="glass-dark px-3 py-2 rounded-lg flex items-center w-full md:w-auto">
          <div className="w-2 h-2 rounded-full bg-airavat-cyan animate-pulse-glow mr-2"></div>
          <span className="text-xs md:text-sm text-white/70 mr-1">AI optimizing your schedule based on energy levels</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2">
          <div className="glass rounded-xl p-4 md:p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center mb-6">
              <Clock className="text-airavat-cyan mr-2" size={20} />
              <h2 className="text-xl font-semibold">Today's Schedule</h2>
            </div>
            
            <div className="relative">
              <div className="absolute top-0 bottom-0 left-3 md:left-6 border-l border-dashed border-white/20"></div>
              
              {filteredTimeBlocks.length > 0 ? (
                filteredTimeBlocks.map((block, index) => (
                  <div key={block.id} className="flex mb-6 relative">
                    <div className="w-8 md:w-12 text-xs md:text-sm text-white/60 pt-2">{block.time}</div>
                    
                    <div className="absolute left-3 md:left-6 top-3 w-3 h-3 rounded-full bg-white/20 z-10 transform -translate-x-1.5"></div>
                    
                    <div className={`ml-3 md:ml-6 flex-1 p-3 rounded-lg border transition-all
                      ${block.completed 
                        ? 'bg-white/5 border-white/10 opacity-60' 
                        : block.aiOptimized 
                          ? 'glass-dark border-airavat-cyan/40' 
                          : 'glass-dark border-white/10'}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className={`font-medium ${block.completed ? 'line-through text-white/50' : ''}`}>
                            {block.title}
                          </h4>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 border border-white/20 flex items-center">
                              <Clock size={10} className="mr-1" />
                              {block.duration}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 border border-white/20">
                              {block.category}
                            </span>
                            {block.aiOptimized && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-airavat-cyan/10 border border-airavat-cyan/30 text-airavat-cyan flex items-center">
                                <Brain size={10} className="mr-1" />
                                AI Optimized
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button 
                            className="p-1 rounded-full hover:bg-white/10 transition-colors"
                            onClick={() => toggleTimeBlockCompletion(block.id)}
                            aria-label={block.completed ? "Mark as incomplete" : "Mark as complete"}
                          >
                            {block.completed ? (
                              <CheckCircle2 className="text-airavat-cyan" size={20} />
                            ) : (
                              <div className="w-5 h-5 rounded-full border border-white/40 hover:border-airavat-cyan transition-colors"></div>
                            )}
                          </button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1 rounded-full hover:bg-white/10 transition-colors" aria-label="More options">
                                <MoreVertical className="text-white/60" size={18} />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => toggleTimeBlockCompletion(block.id)}>
                                {block.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => deleteTimeBlock(block.id)} className="text-red-500">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-white/60">No time blocks found. Add your first time block to get started!</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <div className="glass rounded-xl p-4 md:p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center mb-6">
              <Brain className="text-airavat-cyan mr-2" size={20} />
              <h2 className="text-xl font-semibold">AI Insights</h2>
            </div>
            
            <div className="space-y-4">
              <div className="glass-dark p-4 rounded-lg border border-airavat-cyan/30">
                <h4 className="font-medium text-airavat-cyan">Energy Optimization</h4>
                <p className="text-sm text-white/70 mt-2">
                  Your energy peaks between 9AM-11AM. I've scheduled your most demanding tasks during this window.
                </p>
              </div>
              
              <div className="glass-dark p-4 rounded-lg border border-white/10">
                <h4 className="font-medium">Break Suggestions</h4>
                <p className="text-sm text-white/70 mt-2">
                  Based on your patterns, you perform better with 30min breaks every 90min of deep work.
                </p>
              </div>
              
              <div className="glass-dark p-4 rounded-lg border border-white/10">
                <h4 className="font-medium">Upcoming Challenge</h4>
                <p className="text-sm text-white/70 mt-2">
                  You have a project deadline on Friday. I've allocated focused time blocks to help you complete it.
                </p>
              </div>
            </div>
            
            <Button className="btn-glow w-full mt-6" onClick={() => {
              toast({
                title: "AI Analysis Complete",
                description: "New insights have been added to your dashboard",
              });
            }}>
              <Brain size={16} className="mr-2" />
              Get More Insights
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeBlocks;