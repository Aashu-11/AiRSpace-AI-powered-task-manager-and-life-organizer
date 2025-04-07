
import React from 'react';
import { Hero } from '@/components/home/Hero';
import { FeatureSection } from '@/components/home/FeatureSection';

const Index = () => {
  return (
    <div className="overflow-x-hidden bg-black text-white min-h-screen">
      <Hero />
      <FeatureSection />
    </div>
  );
};

export default Index;
