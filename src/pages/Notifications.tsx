import React, { useState } from 'react';
import { Bell, CheckCircle, Clock, Calendar, Zap, Brain, X, Eye } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { Notification } from '@/lib/models';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Sample notification data
const notificationsData: Notification[] = [
  {
    id: 1,
    title: "High Priority Task Due Soon",
    description: "Complete Project Proposal is due in 2 hours",
    type: "task_reminder",
    time: new Date().toISOString(),
    read: false
  },
  {
    id: 2,
    title: "Flow State Recommendation",
    description: "Your energy levels are optimal for deep work. Consider allocating 90 minutes for your Research Task now.",
    type: "ai_recommendation",
    time: new Date().toISOString(),
    read: false
  },
  {
    id: 3,
    title: "Meeting in 30 Minutes",
    description: "Team Standup Meeting will start at 10:00 AM",
    type: "meeting_reminder",
    time: new Date().toISOString(),
    read: true
  },
  {
    id: 4,
    title: "Productivity Insight",
    description: "You completed 12 tasks yesterday - that's 40% above your daily average!",
    type: "insight",
    time: new Date(Date.now() - 86400000).toISOString(),
    read: true
  },
  {
    id: 5,
    title: "New AI Coach Session Available",
    description: "Your weekly productivity coaching session is ready. Focus area: Time Management",
    type: "feature_update",
    time: new Date(Date.now() - 86400000).toISOString(),
    read: false
  },
  {
    id: 6,
    title: "Task Automatically Rescheduled",
    description: "Review Analytics Dashboard was rescheduled to tomorrow due to your current workload",
    type: "ai_action",
    time: new Date(Date.now() - 172800000).toISOString(),
    read: true
  },
  {
    id: 7,
    title: "Energy Dip Detected",
    description: "Your productivity metrics indicate a possible energy dip. Consider taking a 15-minute break or switching to a lighter task.",
    type: "ai_recommendation",
    time: new Date(Date.now() - 172800000).toISOString(),
    read: true
  }
];

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(notificationsData);
  
  // Add state for toggling notification settings
  const [settings, setSettings] = useState({
    taskReminders: true,
    aiInsights: true,
    meetingAlerts: true,
    flowStateAlerts: true,
    systemUpdates: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };
  
  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task_reminder':
        return <CheckCircle size={18} className="text-blue-400" />;
      case 'meeting_reminder':
        return <Calendar size={18} className="text-amber-400" />;
      case 'ai_recommendation':
        return <Brain size={18} className="text-airavat-cyan" />;
      case 'insight':
        return <Zap size={18} className="text-purple-400" />;
      case 'feature_update':
        return <Bell size={18} className="text-green-400" />;
      case 'ai_action':
        return <Brain size={18} className="text-red-400" />;
      default:
        return <Bell size={18} className="text-gray-400" />;
    }
  };
  
  const formatNotificationTime = (timeString: string) => {
    const date = new Date(timeString);
    
    if (isToday(date)) {
      return format(date, "'Today at' h:mm a");
    } else if (isYesterday(date)) {
      return format(date, "'Yesterday at' h:mm a");
    } else {
      return format(date, "MMM d, yyyy 'at' h:mm a");
    }
  };
  
  const getGroupedNotifications = () => {
    const today = notifications.filter(n => isToday(new Date(n.time)));
    const yesterday = notifications.filter(n => isYesterday(new Date(n.time)));
    const older = notifications.filter(n => !isToday(new Date(n.time)) && !isYesterday(new Date(n.time)));
    
    return { today, yesterday, older };
  };

  const { today, yesterday, older } = getGroupedNotifications();

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-3xl font-bold font-orbitron mb-2 flex items-center">
          <Bell className="text-airavat-cyan mr-3" size={28} />
          Notifications
        </h1>
        <p className="text-white/70">
          Stay updated with task reminders, AI insights, and important updates
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <span className="text-lg font-medium">All Notifications</span>
              {unreadCount > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-airavat-cyan text-black font-medium">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={markAllAsRead}
                  className="text-sm"
                >
                  <Eye className="mr-1 h-4 w-4" />
                  Mark all as read
                </Button>
              )}
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="glass mb-4">
              <TabsTrigger value="all" className="flex-1">
                All
              </TabsTrigger>
              <TabsTrigger value="unread" className="flex-1">
                Unread
                {unreadCount > 0 && (
                  <span className="ml-1.5 size-5 inline-flex items-center justify-center rounded-full bg-airavat-cyan text-black text-xs font-medium">
                    {unreadCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex-1">AI Insights</TabsTrigger>
              <TabsTrigger value="tasks" className="flex-1">Tasks</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="m-0">
              <div className="space-y-6">
                {today.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-white/70 mb-2">Today</h3>
                    <div className="space-y-3">
                      {today.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`glass-dark p-4 rounded-lg border-l-2 transition-all ${notification.read ? 'border-white/20' : 'border-airavat-cyan'}`}
                        >
                          <div className="flex justify-between">
                            <div className="flex gap-3">
                              <div className="mt-1">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div>
                                <h4 className={`font-medium ${notification.read ? 'text-white/80' : 'text-white'}`}>
                                  {notification.title}
                                </h4>
                                <p className="text-sm text-white/60 mt-1">{notification.description}</p>
                                <span className="text-xs text-white/50 block mt-2">
                                  {formatNotificationTime(notification.time)}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-1">
                              {!notification.read && (
                                <button 
                                  onClick={() => markAsRead(notification.id)}
                                  className="p-1 rounded-full hover:bg-white/10"
                                  title="Mark as read"
                                >
                                  <Eye size={14} className="text-white/60 hover:text-white" />
                                </button>
                              )}
                              <button 
                                onClick={() => deleteNotification(notification.id)}
                                className="p-1 rounded-full hover:bg-white/10"
                                title="Delete"
                              >
                                <X size={14} className="text-white/60 hover:text-white" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {yesterday.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-white/70 mb-2">Yesterday</h3>
                    <div className="space-y-3">
                      {yesterday.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`glass-dark p-4 rounded-lg border-l-2 transition-all ${notification.read ? 'border-white/20' : 'border-airavat-cyan'}`}
                        >
                          <div className="flex justify-between">
                            <div className="flex gap-3">
                              <div className="mt-1">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div>
                                <h4 className={`font-medium ${notification.read ? 'text-white/80' : 'text-white'}`}>
                                  {notification.title}
                                </h4>
                                <p className="text-sm text-white/60 mt-1">{notification.description}</p>
                                <span className="text-xs text-white/50 block mt-2">
                                  {formatNotificationTime(notification.time)}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-1">
                              {!notification.read && (
                                <button 
                                  onClick={() => markAsRead(notification.id)}
                                  className="p-1 rounded-full hover:bg-white/10"
                                  title="Mark as read"
                                >
                                  <Eye size={14} className="text-white/60 hover:text-white" />
                                </button>
                              )}
                              <button 
                                onClick={() => deleteNotification(notification.id)}
                                className="p-1 rounded-full hover:bg-white/10"
                                title="Delete"
                              >
                                <X size={14} className="text-white/60 hover:text-white" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {older.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-white/70 mb-2">Older</h3>
                    <div className="space-y-3">
                      {older.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`glass-dark p-4 rounded-lg border-l-2 transition-all ${notification.read ? 'border-white/20' : 'border-airavat-cyan'}`}
                        >
                          <div className="flex justify-between">
                            <div className="flex gap-3">
                              <div className="mt-1">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div>
                                <h4 className={`font-medium ${notification.read ? 'text-white/80' : 'text-white'}`}>
                                  {notification.title}
                                </h4>
                                <p className="text-sm text-white/60 mt-1">{notification.description}</p>
                                <span className="text-xs text-white/50 block mt-2">
                                  {formatNotificationTime(notification.time)}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-1">
                              {!notification.read && (
                                <button 
                                  onClick={() => markAsRead(notification.id)}
                                  className="p-1 rounded-full hover:bg-white/10"
                                  title="Mark as read"
                                >
                                  <Eye size={14} className="text-white/60 hover:text-white" />
                                </button>
                              )}
                              <button 
                                onClick={() => deleteNotification(notification.id)}
                                className="p-1 rounded-full hover:bg-white/10"
                                title="Delete"
                              >
                                <X size={14} className="text-white/60 hover:text-white" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {notifications.length === 0 && (
                  <div className="text-center py-12">
                    <Bell className="h-12 w-12 text-white/30 mx-auto mb-3" />
                    <h3 className="text-lg font-medium">No notifications</h3>
                    <p className="text-white/60 mt-1">
                      You're all caught up!
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="unread" className="m-0">
              <div className="space-y-3">
                {notifications.filter(n => !n.read).length > 0 ? (
                  notifications.filter(n => !n.read).map((notification) => (
                    <div 
                      key={notification.id} 
                      className="glass-dark p-4 rounded-lg border-l-2 border-airavat-cyan"
                    >
                      <div className="flex justify-between">
                        <div className="flex gap-3">
                          <div className="mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div>
                            <h4 className="font-medium">{notification.title}</h4>
                            <p className="text-sm text-white/60 mt-1">{notification.description}</p>
                            <span className="text-xs text-white/50 block mt-2">
                              {formatNotificationTime(notification.time)}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <button 
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 rounded-full hover:bg-white/10"
                            title="Mark as read"
                          >
                            <Eye size={14} className="text-white/60 hover:text-white" />
                          </button>
                          <button 
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 rounded-full hover:bg-white/10"
                            title="Delete"
                          >
                            <X size={14} className="text-white/60 hover:text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Eye className="h-12 w-12 text-white/30 mx-auto mb-3" />
                    <h3 className="text-lg font-medium">No unread notifications</h3>
                    <p className="text-white/60 mt-1">
                      You've read all your notifications
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="ai" className="m-0">
              <div className="space-y-3">
                {notifications.filter(n => ['ai_recommendation', 'ai_action', 'insight'].includes(n.type)).length > 0 ? (
                  notifications.filter(n => ['ai_recommendation', 'ai_action', 'insight'].includes(n.type)).map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`glass-dark p-4 rounded-lg border-l-2 transition-all ${notification.read ? 'border-white/20' : 'border-airavat-cyan'}`}
                    >
                      <div className="flex justify-between">
                        <div className="flex gap-3">
                          <div className="mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div>
                            <h4 className={`font-medium ${notification.read ? 'text-white/80' : 'text-white'}`}>
                              {notification.title}
                            </h4>
                            <p className="text-sm text-white/60 mt-1">{notification.description}</p>
                            <span className="text-xs text-white/50 block mt-2">
                              {formatNotificationTime(notification.time)}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          {!notification.read && (
                            <button 
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 rounded-full hover:bg-white/10"
                              title="Mark as read"
                            >
                              <Eye size={14} className="text-white/60 hover:text-white" />
                            </button>
                          )}
                          <button 
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 rounded-full hover:bg-white/10"
                            title="Delete"
                          >
                            <X size={14} className="text-white/60 hover:text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Brain className="h-12 w-12 text-white/30 mx-auto mb-3" />
                    <h3 className="text-lg font-medium">No AI insights</h3>
                    <p className="text-white/60 mt-1">
                      Your AI insights will appear here
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="tasks" className="m-0">
              <div className="space-y-3">
                {notifications.filter(n => ['task_reminder', 'meeting_reminder'].includes(n.type)).length > 0 ? (
                  notifications.filter(n => ['task_reminder', 'meeting_reminder'].includes(n.type)).map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`glass-dark p-4 rounded-lg border-l-2 transition-all ${notification.read ? 'border-white/20' : 'border-airavat-cyan'}`}
                    >
                      <div className="flex justify-between">
                        <div className="flex gap-3">
                          <div className="mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div>
                            <h4 className={`font-medium ${notification.read ? 'text-white/80' : 'text-white'}`}>
                              {notification.title}
                            </h4>
                            <p className="text-sm text-white/60 mt-1">{notification.description}</p>
                            <span className="text-xs text-white/50 block mt-2">
                              {formatNotificationTime(notification.time)}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          {!notification.read && (
                            <button 
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 rounded-full hover:bg-white/10"
                              title="Mark as read"
                            >
                              <Eye size={14} className="text-white/60 hover:text-white" />
                            </button>
                          )}
                          <button 
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 rounded-full hover:bg-white/10"
                            title="Delete"
                          >
                            <X size={14} className="text-white/60 hover:text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 text-white/30 mx-auto mb-3" />
                    <h3 className="text-lg font-medium">No task notifications</h3>
                    <p className="text-white/60 mt-1">
                      Task reminders will appear here
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <div className="glass p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Task Reminders</h3>
                  <p className="text-xs text-white/60">Due dates and deadlines</p>
                </div>
                <div 
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${settings.taskReminders ? 'bg-airavat-cyan/30' : 'bg-white/20'} cursor-pointer`}
                  onClick={() => toggleSetting('taskReminders')}
                >
                  <span className={`absolute inset-0 h-full w-full rounded-full ${settings.taskReminders ? 'bg-airavat-cyan' : ''}`}></span>
                  <span className={`absolute ${settings.taskReminders ? 'right-1' : 'left-1'} h-4 w-4 rounded-full bg-white transition-all`}></span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">AI Insights</h3>
                  <p className="text-xs text-white/60">Productivity analysis and tips</p>
                </div>
                <div 
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${settings.aiInsights ? 'bg-airavat-cyan/30' : 'bg-white/20'} cursor-pointer`}
                  onClick={() => toggleSetting('aiInsights')}
                >
                  <span className={`absolute inset-0 h-full w-full rounded-full ${settings.aiInsights ? 'bg-airavat-cyan' : ''}`}></span>
                  <span className={`absolute ${settings.aiInsights ? 'right-1' : 'left-1'} h-4 w-4 rounded-full bg-white transition-all`}></span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Meeting Alerts</h3>
                  <p className="text-xs text-white/60">Upcoming meetings and events</p>
                </div>
                <div 
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${settings.meetingAlerts ? 'bg-airavat-cyan/30' : 'bg-white/20'} cursor-pointer`}
                  onClick={() => toggleSetting('meetingAlerts')}
                >
                  <span className={`absolute inset-0 h-full w-full rounded-full ${settings.meetingAlerts ? 'bg-airavat-cyan' : ''}`}></span>
                  <span className={`absolute ${settings.meetingAlerts ? 'right-1' : 'left-1'} h-4 w-4 rounded-full bg-white transition-all`}></span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Flow State Alerts</h3>
                  <p className="text-xs text-white/60">Optimal focus time suggestions</p>
                </div>
                <div 
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${settings.flowStateAlerts ? 'bg-airavat-cyan/30' : 'bg-white/20'} cursor-pointer`}
                  onClick={() => toggleSetting('flowStateAlerts')}
                >
                  <span className={`absolute inset-0 h-full w-full rounded-full ${settings.flowStateAlerts ? 'bg-airavat-cyan' : ''}`}></span>
                  <span className={`absolute ${settings.flowStateAlerts ? 'right-1' : 'left-1'} h-4 w-4 rounded-full bg-white transition-all`}></span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">System Updates</h3>
                  <p className="text-xs text-white/60">New features and improvements</p>
                </div>
                <div 
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${settings.systemUpdates ? 'bg-airavat-cyan/30' : 'bg-white/20'} cursor-pointer`}
                  onClick={() => toggleSetting('systemUpdates')}
                >
                  <span className={`absolute inset-0 h-full w-full rounded-full ${settings.systemUpdates ? 'bg-airavat-cyan' : ''}`}></span>
                  <span className={`absolute ${settings.systemUpdates ? 'right-1' : 'left-1'} h-4 w-4 rounded-full bg-white transition-all`}></span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/10">
              <h3 className="font-medium mb-3">Notification Time</h3>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm">Quiet Hours</p>
                  <p className="text-xs text-white/60">No notifications during this time</p>
                </div>
                <div className="text-sm text-airavat-cyan">
                  10:00 PM - 7:00 AM
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Smart Notifications</h2>
            
            <div className="glass-dark p-4 rounded-lg border border-airavat-cyan/30 mb-4">
              <div className="flex items-center mb-2">
                <Brain className="h-5 w-5 text-airavat-cyan mr-2" />
                <h3 className="font-medium">AI Notification Optimization</h3>
              </div>
              <p className="text-sm text-white/70">
                Airavat's AI will learn your response patterns and optimize notification timing and frequency.
              </p>
              <div className="mt-3 relative inline-flex h-6 w-11 items-center rounded-full bg-airavat-cyan/30">
                <span className="absolute inset-0 h-full w-full rounded-full bg-airavat-cyan"></span>
                <span className="absolute right-1 h-4 w-4 rounded-full bg-white transition-all"></span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Learning Progress</span>
                <span className="text-airavat-cyan">67%</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-airavat-cyan to-purple-500 rounded-full" style={{width: '67%'}}></div>
              </div>
              <p className="text-xs text-white/60 mt-1">
                AI is learning your preferences to deliver more relevant notifications
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
