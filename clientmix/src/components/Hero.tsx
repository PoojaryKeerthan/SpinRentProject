"use client";
import React, { useEffect, useState } from 'react';

const Hero = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('home.png')`
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/80 bg-opacity-30"></div>
      </div>

      {/* Bottom Gradient Dissolved Effect */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-white via-gray-100/90 via-gray-300/60 via-gray-500/30 via-gray-700/10 to-transparent z-5"></div> */}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
          Spin the Night Right<br />
          <span className="text-yellow-400">with Top DJ Gadgets</span> 
        </h1>

        {/* Subtext */}
        <p className="text-lg md:text-xl text-white max-w-2xl mb-12 leading-relaxed">
          From casual jams to full-on parties,<br />
          SpinRent has the equipment you need.
        </p>

        {/* Navigation Dots */}
        <div className="flex space-x-3">
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-white bg-opacity-50"></div>
          <div className="w-3 h-3 rounded-full bg-white bg-opacity-50"></div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-20 left-10 w-16 h-16 rounded-full bg-white bg-opacity-20 blur-sm"></div>
      <div className="absolute top-32 right-20 w-12 h-12 rounded-full bg-yellow-400 bg-opacity-30 blur-sm"></div>
      <div className="absolute bottom-40 right-32 w-8 h-8 rounded-full bg-white bg-opacity-40 blur-sm"></div>
      <div className="absolute top-48 left-32 w-6 h-6 rounded-full bg-yellow-400 bg-opacity-40 blur-sm"></div>
    </div>
  );
};

export default Hero;