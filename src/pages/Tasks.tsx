
import React, { useState } from 'react';
import { CheckCircle, Plus, Clock, XCircle, Filter, MoreVertical, Brain, ArrowUpCircle, ArrowRight, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { Task } from '@/lib/models';
import { askGemini } from '@/lib/gemini';
import { useTaskStore } from '@/lib/taskStore';

const Tasks = () => {
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  });
  const [filter, setFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGeneratingTask, setIsGeneratingTask] = useState(false);
  
  // Use taskStore directly to access and modify tasks
  const { 
    tasks, 
    addTask, 
    toggleTaskCompletion, 
    updateTask, 
    deleteTask, 
    filterTasks 
  } = useTaskStore();

  const filteredTasks = filterTasks(filter);

  const handleTaskToggle = (task: Task) => {
    toggleTaskCompletion(task.id);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setNewTask(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTask = () => {
    if (!newTask.title) {
      toast({
        title: "Task title required",
        description: "Please provide a title for your task",
        variant: "destructive"
      });
      return;
    }

    addTask({
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority as 'high' | 'medium' | 'low',
      dueDate: newTask.dueDate
    });

    setIsDialogOpen(false);
    
    // Reset form
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    });
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
  };

  const generateAITask = async () => {
    setIsGeneratingTask(true);
    try {
      const response = await askGemini({
        prompt: `You are an AI task generator for a productivity app. Generate a practical, specific task that would help someone be more productive. Include a title (max 7 words), a brief description (1-2 sentences), and priority (high, medium, or low). Format as JSON: {"title": "Task title", "description": "Task description", "priority": "medium"}`
      });

      if (response.error) {
        throw new Error(response.error);
      }

      // Extract the JSON object from the response
      const jsonMatch = response.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Could not parse AI response");
      }

      const taskData = JSON.parse(jsonMatch[0]);
      
      addTask({
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        dueDate: 'Tomorrow, 3:00 PM',
        aiRecommended: true
      });

      toast({
        title: "AI task generated",
        description: "A new productivity task has been created for you",
      });
    } catch (error) {
      console.error('Error generating AI task:', error);
      toast({
        title: "Generation failed",
        description: "Could not generate an AI task. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingTask(false);
    }
  };

  // Filter tasks for specific tabs
  const todayTasks = tasks.filter(task => {
    const dueDate = task.dueDate.toLowerCase();
    return dueDate.includes('today');
  });

  const upcomingTasks = tasks.filter(task => {
    const dueDate = task.dueDate.toLowerCase();
    return dueDate.includes('tomorrow') || 
           dueDate.includes('next') || 
           (!dueDate.includes('today') && !task.completed);
  });

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-3xl font-bold font-orbitron mb-2 flex items-center">
          <CheckCircle className="text-airavat-cyan mr-3" size={28} />
          Tasks
        </h1>
        <p className="text-white/70">
          Manage your tasks and stay on top of your productivity
        </p>
      </div>
      
      <div className="flex flex-col lg:flex-row justify-between mb-6 gap-4">
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-premium">
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter task title"
                    value={newTask.title}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter task description"
                    value={newTask.description}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newTask.priority} onValueChange={(value) => handleSelectChange('priority', value)}>
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      name="dueDate"
                      type="date"
                      value={newTask.dueDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddTask}>Save Task</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
        
        </div>
        
        <div className="flex gap-2 items-center">
          <Filter className="h-4 w-4 text-white/60" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter tasks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="low">Low Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="glass rounded-xl p-6">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-6">
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <Card key={task.id} className={`p-4 ${task.completed ? 'border-green-500/30 bg-green-500/5' : 'border-white/10'}`}>
                <div className="flex items-start">
                  <button 
                    className="mt-1 mr-3 flex-shrink-0"
                    onClick={() => handleTaskToggle(task)}
                  >
                    {task.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      task.priority === 'high' ? (
                        <ArrowUpCircle className="h-5 w-5 text-red-400" />
                      ) : task.priority === 'medium' ? (
                        <ArrowRight className="h-5 w-5 text-yellow-400" />
                      ) : (
                        <Circle className="h-5 w-5 text-blue-400" />
                      )
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className={`font-medium ${task.completed ? 'line-through text-white/50' : ''}`}>
                        {task.title}
                        {task.aiRecommended && (
                          <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-airavat-cyan/20 text-airavat-cyan">
                            <Brain className="h-3 w-3 mr-1" />
                            AI
                          </span>
                        )}
                      </h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleTaskToggle(task)}>
                            {task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            // Edit functionality could be added here
                          }}>Edit</DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-500"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <p className="text-sm text-white/60 mt-1">{task.description}</p>
                    
                    <div className="flex items-center mt-2 text-xs text-white/60">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Due: {task.dueDate}</span>
                      
                      <span className={`ml-3 px-2 py-0.5 rounded-full ${
                        task.priority === 'high' 
                          ? 'bg-red-500/20 text-red-400' 
                          : task.priority === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <XCircle className="mx-auto text-white/30 mb-4" size={64} />
              <h3 className="text-xl font-medium mb-2">No tasks found</h3>
              <p className="text-white/60 mb-4">Create a new task to get started</p>
              <Button onClick={() => setIsDialogOpen(true)}>Add Your First Task</Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="today" className="space-y-4">
          {todayTasks.length > 0 ? (
            todayTasks.map(task => (
              <Card key={task.id} className={`p-4 ${task.completed ? 'border-green-500/30 bg-green-500/5' : 'border-white/10'}`}>
                <div className="flex items-start">
                  <button 
                    className="mt-1 mr-3 flex-shrink-0"
                    onClick={() => handleTaskToggle(task)}
                  >
                    {task.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      task.priority === 'high' ? (
                        <ArrowUpCircle className="h-5 w-5 text-red-400" />
                      ) : task.priority === 'medium' ? (
                        <ArrowRight className="h-5 w-5 text-yellow-400" />
                      ) : (
                        <Circle className="h-5 w-5 text-blue-400" />
                      )
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className={`font-medium ${task.completed ? 'line-through text-white/50' : ''}`}>
                        {task.title}
                        {task.aiRecommended && (
                          <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-airavat-cyan/20 text-airavat-cyan">
                            <Brain className="h-3 w-3 mr-1" />
                            AI
                          </span>
                        )}
                      </h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleTaskToggle(task)}>
                            {task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                          </DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-500"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <p className="text-sm text-white/60 mt-1">{task.description}</p>
                    
                    <div className="flex items-center mt-2 text-xs text-white/60">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Due: {task.dueDate}</span>
                      
                      <span className={`ml-3 px-2 py-0.5 rounded-full ${
                        task.priority === 'high' 
                          ? 'bg-red-500/20 text-red-400' 
                          : task.priority === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <Clock className="mx-auto text-white/30 mb-4" size={64} />
              <h3 className="text-xl font-medium mb-2">Today's Focus</h3>
              <p className="text-white/60 mb-4">No tasks for today</p>
              <Button onClick={() => setIsDialogOpen(true)}>Add Task for Today</Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="upcoming" className="space-y-4">
          {upcomingTasks.length > 0 ? (
            upcomingTasks.map(task => (
              <Card key={task.id} className={`p-4 ${task.completed ? 'border-green-500/30 bg-green-500/5' : 'border-white/10'}`}>
                <div className="flex items-start">
                  <button 
                    className="mt-1 mr-3 flex-shrink-0"
                    onClick={() => handleTaskToggle(task)}
                  >
                    {task.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      task.priority === 'high' ? (
                        <ArrowUpCircle className="h-5 w-5 text-red-400" />
                      ) : task.priority === 'medium' ? (
                        <ArrowRight className="h-5 w-5 text-yellow-400" />
                      ) : (
                        <Circle className="h-5 w-5 text-blue-400" />
                      )
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className={`font-medium ${task.completed ? 'line-through text-white/50' : ''}`}>
                        {task.title}
                        {task.aiRecommended && (
                          <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-airavat-cyan/20 text-airavat-cyan">
                            <Brain className="h-3 w-3 mr-1" />
                            AI
                          </span>
                        )}
                      </h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleTaskToggle(task)}>
                            {task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                          </DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-500"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <p className="text-sm text-white/60 mt-1">{task.description}</p>
                    
                    <div className="flex items-center mt-2 text-xs text-white/60">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Due: {task.dueDate}</span>
                      
                      <span className={`ml-3 px-2 py-0.5 rounded-full ${
                        task.priority === 'high' 
                          ? 'bg-red-500/20 text-red-400' 
                          : task.priority === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <ArrowRight className="mx-auto text-white/30 mb-4" size={64} />
              <h3 className="text-xl font-medium mb-2">Plan Ahead</h3>
              <p className="text-white/60 mb-4">No upcoming tasks</p>
              <Button onClick={() => setIsDialogOpen(true)}>Add Future Task</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tasks;