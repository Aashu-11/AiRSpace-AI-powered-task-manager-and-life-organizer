import React from 'react';
import Spline from '@splinetool/react-spline';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Hero = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col justify-center items-center px-6 lg:px-20">
      {/* Background elements */}
      <div className="absolute -top-10 -right-20 w-64 h-64 bg-airavat-blue/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-10 -left-20 w-80 h-80 bg-airavat-purple/10 rounded-full blur-3xl"></div>
      
      {/* Hero content */}
      <div className="relative z-10 max-w-3xl text-center mt-10">
        <div className="inline-block mb-4 px-6 py-3 rounded-full bg-gradient-to-r from-airavat-blue to-airavat-green shadow-lg animate-bounce-slow">
          <p className="text-base font-orbitron font-semibold text-white animate-pulse-glow">
            Introducing AiRSpace
          </p>
        </div>
        
        <h1 className="font-orbitron text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-slide-up">
          Your <span className="text-gradient-blue-purple">AI-Powered</span>{' '}
          Task Manager
        </h1>
        
        <p className="text-lg md:text-xl text-white/70 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Prioritize tasks intelligently, optimize your schedule, and get personalized 
          recommendations that adapt to your lifestyle.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <button 
            className="btn-premium py-3 px-6 font-orbitron"
            onClick={handleGetStarted}
          >
            Get Started
            <ChevronRight className="inline ml-1" size={18} />
          </button>
          <button className="btn-glow py-3 px-6 font-orbitron">
            Learn More
          </button>
        </div>
      </div>
      
      {/* Spline Viewer */}
      <div className="relative w-full h-[500px] mt-10">
        <Spline 
          scene="https://prod.spline.design/9thVqlT1unSS4n2v/scene.splinecode" 
          className="w-full h-full rounded-lg shadow-lg"
        />
        {/* Black rectangle to cover watermark */}
        <div className="absolute bottom-0 right-6 w-40 h-20 bg-black"></div>
      </div>
      
      {/* Floating elements */}
      <div>
        <div className="absolute top-1/4 left-10 w-20 h-20 glass rounded-xl rotate-12 opacity-60 animate-float"></div>
        <div className="absolute bottom-1/4 right-10 w-16 h-16 glass rounded-xl -rotate-12 opacity-60 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-3/4 left-1/3 w-12 h-12 glass rounded-xl rotate-45 opacity-40 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
};