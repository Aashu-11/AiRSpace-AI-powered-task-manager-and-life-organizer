
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-airavat-space p-6">
      <div className="glass p-8 rounded-xl max-w-md text-center animate-slide-up">
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="text-airavat-cyan" size={32} />
        </div>
        
        <h1 className="text-4xl font-orbitron font-bold mb-4 text-gradient-blue-purple">404</h1>
        <p className="text-xl mb-2">Page Not Found</p>
        <p className="text-white/60 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        
        <Link to="/" className="btn-premium inline-flex items-center">
          <Home size={18} className="mr-2" />
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
