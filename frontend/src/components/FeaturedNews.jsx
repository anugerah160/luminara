import React from 'react';
import dummyHero from '../assets/dummy-hero.jpg';

export default function FeaturedNews() {
  return (
    <div className="relative h-[350px] md:h-[450px] bg-gray-100 overflow-hidden mx-6 rounded-xl shadow-md">
      <img src={dummyHero} alt="featured" className="w-full h-full object-cover" />
      <div className="absolute bottom-4 left-4 text-white">
        <p className="text-sm font-light">Featured</p>
        <h2 className="text-2xl font-bold">China vs Russia</h2>
        <p className="text-sm mt-1">Jul 27, 2025 | Politics</p>
      </div>
    </div>
  );
}
