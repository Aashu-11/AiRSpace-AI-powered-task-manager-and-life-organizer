
import React from 'react';
import { 
  BarChart3, TrendingUp, Clock, Calendar, Target, Zap, 
  Bell, Brain, Users, ArrowUpRight, ChevronRight 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Legend 
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const mockChartData = [
  { day: 'Mon', productivity: 65, focus: 70, energy: 60 },
  { day: 'Tue', productivity: 80, focus: 75, energy: 85 },
  { day: 'Wed', productivity: 45, focus: 60, energy: 50 },
  { day: 'Thu', productivity: 90, focus: 95, energy: 85 },
  { day: 'Fri', productivity: 75, focus: 80, energy: 70 },
  { day: 'Sat', productivity: 50, focus: 55, energy: 65 },
  { day: 'Sun', productivity: 30, focus: 40, energy: 45 },
];

const notificationData = [
  {
    id: 1,
    title: "Team Meeting in 30 Minutes",
    description: "Virtual conference room - Agenda: Project updates",
    type: "reminder",
    time: "10:00 AM"
  },
  {
    id: 2,
    title: "Project Deadline Extended",
    description: "The dashboard project deadline has been extended by 2 days",
    type: "update",
    time: "Yesterday"
  },
  {
    id: 3,
    title: "New Task Assigned to You",
    description: "Research new AI technologies for next sprint planning",
    type: "task",
    time: "2 days ago"
  }
];

const Dashboard = () => {
  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-3xl font-bold font-orbitron mb-2">Productivity Dashboard</h1>
        <p className="text-white/70">
          Track your progress and gain insights from your productivity patterns
        </p>
      </div>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { 
            icon: TrendingUp, 
            label: "Productivity", 
            value: "87%", 
            subtext: "+12% from last week",
            color: "text-airavat-cyan" 
          },
          { 
            icon: Clock, 
            label: "Focus Time", 
            value: "4.5 hrs", 
            subtext: "Today's deep work",
            color: "text-purple-400" 
          },
          { 
            icon: Target, 
            label: "Tasks Completed", 
            value: "18/23", 
            subtext: "This week",
            color: "text-green-400" 
          },
          { 
            icon: Zap, 
            label: "Streak", 
            value: "12 days", 
            subtext: "Keep it up!",
            color: "text-amber-400" 
          }
        ].map((stat, index) => (
          <div 
            key={index} 
            className="glass p-5 rounded-xl animate-slide-up"
            style={{ animationDelay: `${0.1 * (index + 1)}s` }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-white/60 mb-1">{stat.label}</p>
                <h3 className="text-2xl font-orbitron font-bold">{stat.value}</h3>
                <p className="text-xs text-white/60 mt-1">{stat.subtext}</p>
              </div>
              <div className={`p-2 rounded-lg bg-white/10 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Productivity Chart - Takes 2/3 of the width on large screens */}
        <div className="lg:col-span-2">
          <div className="glass p-6 rounded-xl mb-6 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <BarChart3 className="text-airavat-cyan mr-2" size={20} />
                <h2 className="text-xl font-semibold">Weekly Productivity</h2>
              </div>
              <div className="flex gap-2">
                <button className="text-sm px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  This Week
                </button>
                <button className="text-sm px-3 py-1 rounded-full text-white/60 hover:bg-white/10 transition-colors">
                  Last Week
                </button>
              </div>
            </div>
            
            <div className="h-64">
              <ChartContainer 
                className="h-full" 
                config={{
                  productivity: { 
                    color: '#00E4FF',
                    label: 'Productivity' 
                  }, 
                  focus: { 
                    color: '#C700FF',
                    label: 'Focus'
                  },
                  energy: {
                    color: '#FF5500',
                    label: 'Energy'
                  }
                }}
              >
                <AreaChart
                  data={mockChartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="productivityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00E4FF" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00E4FF" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C700FF" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#C700FF" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF5500" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#FF5500" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" />
                  <YAxis stroke="rgba(255,255,255,0.4)" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="productivity" 
                    stroke="#00E4FF" 
                    fillOpacity={1} 
                    fill="url(#productivityGradient)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="focus" 
                    stroke="#C700FF" 
                    fillOpacity={1} 
                    fill="url(#focusGradient)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="energy" 
                    stroke="#FF5500" 
                    fillOpacity={1} 
                    fill="url(#energyGradient)" 
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </div>

          {/* Upcoming Schedule */}
          <div className="glass p-6 rounded-xl animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Calendar className="text-airavat-cyan mr-2" size={20} />
                <h2 className="text-xl font-semibold">Today's Schedule</h2>
              </div>
              <button className="text-xs px-3 py-1.5 rounded-full glass-dark border border-white/10 hover:border-airavat-cyan transition-colors">
                Full Calendar <ChevronRight size={14} className="inline ml-1" />
              </button>
            </div>
            
            <div className="space-y-4">
              {[
                { 
                  time: "10:00 AM - 11:30 AM", 
                  title: "Project Planning Session", 
                  tags: ["Meeting", "High Priority"] 
                },
                { 
                  time: "12:00 PM - 1:00 PM", 
                  title: "Lunch Break", 
                  tags: ["Break", "Recommended"] 
                },
                { 
                  time: "1:30 PM - 3:30 PM", 
                  title: "Focus Time: Project Implementation", 
                  tags: ["Deep Work", "AI Optimized"] 
                },
                { 
                  time: "4:00 PM - 5:00 PM", 
                  title: "Team Standup Meeting", 
                  tags: ["Meeting", "Recurring"] 
                }
              ].map((event, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-32 shrink-0 text-sm text-white/70">{event.time}</div>
                  <div className="flex-1 glass-dark p-3 rounded-lg border-l-2 border-airavat-cyan">
                    <h4 className="font-medium">{event.title}</h4>
                    <div className="flex gap-2 mt-2">
                      {event.tags.map((tag, idx) => (
                        <span 
                          key={idx} 
                          className="text-xs px-2 py-0.5 rounded-full bg-white/10 border border-white/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Side Column */}
        <div className="space-y-6">
          {/* Notifications */}
          <div className="glass p-6 rounded-xl animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Bell className="text-airavat-cyan mr-2" size={20} />
                <h2 className="text-xl font-semibold">Notifications</h2>
              </div>
              <span className="bg-airavat-cyan/20 text-airavat-cyan text-xs px-2 py-0.5 rounded-full">
                3 New
              </span>
            </div>
            
            <div className="space-y-3">
              {notificationData.map((notification) => (
                <div key={notification.id} className="glass-dark p-3 rounded-lg border-l-2 border-airavat-cyan hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    <span className="text-xs text-white/50">{notification.time}</span>
                  </div>
                  <p className="text-xs text-white/60 mt-1">{notification.description}</p>
                </div>
              ))}
            </div>
            
            <button className="w-full text-center text-sm text-white/60 hover:text-white mt-3 py-2">
              View All Notifications
            </button>
          </div>
          
          {/* AI Insights */}
          <div className="glass p-6 rounded-xl animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <div className="flex items-center mb-4">
              <Brain className="text-airavat-cyan mr-2" size={20} />
              <h2 className="text-xl font-semibold">AI Insights</h2>
            </div>
            
            <div className="space-y-4">
              <div className="glass-dark p-4 rounded-lg border border-airavat-cyan/30">
                <h4 className="font-medium text-airavat-cyan">
                  <span className="inline-flex items-center">
                    <Zap size={14} className="mr-1" /> Energy Optimization
                  </span>
                </h4>
                <p className="text-sm text-white/70 mt-2">
                  Your energy peaks between 9AM-11AM. I've scheduled your most demanding tasks during this window.
                </p>
              </div>
              
              <div className="glass-dark p-4 rounded-lg border border-white/10">
                <h4 className="font-medium">
                  <span className="inline-flex items-center">
                    <TrendingUp size={14} className="mr-1" /> Productivity Pattern
                  </span>
                </h4>
                <p className="text-sm text-white/70 mt-2">
                  You're 27% more productive on Thursdays. Consider scheduling important meetings and deep work sessions on this day.
                </p>
              </div>
              
              <div className="glass-dark p-4 rounded-lg border border-white/10">
                <h4 className="font-medium">
                  <span className="inline-flex items-center">
                    <Users size={14} className="mr-1" /> Collaboration Impact
                  </span>
                </h4>
                <p className="text-sm text-white/70 mt-2">
                  Your focused work is interrupted every 32 minutes on average. Consider blocking notification-free time periods.
                </p>
              </div>
            </div>
            
            <button className="btn-glow w-full mt-6">
              <Brain size={16} className="mr-2" />
              Get More Insights
            </button>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <div className="glass p-4 rounded-xl">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-white/60">Task Completion</p>
                  <h3 className="text-xl font-bold mt-1">78%</h3>
                </div>
                <div className="p-2 rounded-full bg-green-500/20 text-green-400">
                  <ArrowUpRight size={16} />
                </div>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full mt-2">
                <div className="h-full bg-gradient-to-r from-green-400 to-green-300 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            
            <div className="glass p-4 rounded-xl">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-white/60">Focus Score</p>
                  <h3 className="text-xl font-bold mt-1">8.4</h3>
                </div>
                <div className="p-2 rounded-full bg-airavat-cyan/20 text-airavat-cyan">
                  <ArrowUpRight size={16} />
                </div>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full mt-2">
                <div className="h-full bg-gradient-to-r from-airavat-cyan to-airavat-blue rounded-full" style={{ width: '84%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
