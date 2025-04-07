import React from 'react';
import { CheckCircle, Clock, Target, Brain, Bell } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard = ({ icon: Icon, title, description, delay }: FeatureCardProps) => (
  <div 
    className="glass p-6 rounded-xl border border-white/10 hover:border-airavat-cyan/30 transition-all duration-500 hover:shadow-neon-cyan animate-slide-up"
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="w-12 h-12 rounded-lg bg-gradient-midnight flex items-center justify-center mb-4">
      <Icon className="text-airavat-cyan" size={24} />
    </div>
    <h3 className="text-xl font-semibold font-orbitron mb-3">{title}</h3>
    <p className="text-white/70">{description}</p>
  </div>
);

export const FeatureSection = () => {
  const features = [
    {
      icon: CheckCircle,
      title: "Prioritize Tasks",
      description: "AI analyzes deadlines, effort required, and your preferences to intelligently organize your tasks.",
      delay: 0.1,
    },
    {
      icon: Clock,
      title: "Time Blocks",
      description: "Get smart suggestions for productive time slots based on your past behavior and current workload.",
      delay: 0.2,
    },
    {
      icon: Target,
      title: "Personalized Learning",
      description: "The system observes patterns and improves its recommendations over time, adapting to your lifestyle.",
      delay: 0.3,
    },
    {
      icon: Brain,
      title: "Smart Assistant",
      description: "Ask 'What should I do now?' and get contextual recommendations based on your schedule and priorities.",
      delay: 0.4,
    },
    {
      icon: Bell,
      title: "Adaptive Notifications",
      description: "Notifications optimize based on your behavior, with fewer alerts but more relevance and context.",
      delay: 0.5,
    }
  ];

  return (
    <section className="py-20 px-6 lg:px-20">
      <div className="text-center mb-16">
        <h2 className="font-orbitron text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-airavat-cyan to-airavat-purple">
          Introducing AiRSpace
        </h2>
        <p className="text-white/70 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
          AiRSpace combines cutting-edge AI with beautiful design to help you organize your life effortlessly.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </section>
  );
};
