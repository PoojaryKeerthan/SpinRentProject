"use client";

import { SignUp } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';

const SignupPage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="h-screen w-full relative overflow-hidden  inset-0">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/path/to/your/background-image.jpg')",
        }}
      >
        {/* Overlay for better contrast */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Floating particles animation */}
      {isClient && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-1 h-1 bg-orange-300/30 rounded-full animate-bounce"></div>
          <div className="absolute bottom-32 left-20 w-3 h-3 bg-white/10 rounded-full animate-pulse delay-300"></div>
          <div className="absolute top-60 left-1/3 w-1 h-1 bg-orange-200/40 rounded-full animate-bounce delay-700"></div>
          <div className="absolute bottom-40 right-10 w-2 h-2 bg-white/15 rounded-full animate-pulse delay-500"></div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 h-full flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-sm sm:max-w-md">
          {/* Header Section - Outside the card */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Welcome to
            </h1>
            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-3">
              SpinRent
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              Transform your space with minimalist modern furniture
            </p>
          </div>

          {/* Glassmorphism Container - Compact for Clerk component */}
          <div className="relative">
            {/* Background blur effect */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-xl"></div>
            
            {/* Subtle gradient border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-400/10 via-transparent to-white/5 p-px">
              <div className="h-full w-full rounded-2xl bg-black/10 backdrop-blur-sm"></div>
            </div>
            
            {/* Content Container - Minimal padding to fit Clerk component */}
            <div className="relative  sm:p-6">
              {/* Clerk Signup Component Container */}
              <div className="w-full">
                {/* This is where your Clerk SignUp component will go */}
                {/* Remove this placeholder div and replace with <SignUp /> */}
                
                  <SignUp
                  forceRedirectUrl={"/auth/sync"}
                  signInUrl="/auth/signin"
                  />
                
              </div>
            </div>

            {/* Decorative elements - smaller and positioned better */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-orange-400/30 to-orange-600/30 rounded-full blur-lg"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-white/20 to-orange-300/20 rounded-full blur-md"></div>
          </div>

          {/* Bottom text - Outside the card */}
          <div className="mt-6 text-center">
            <p className="text-white/50 text-xs">
              Join thousands who've transformed their spaces
            </p>
            <div className="flex items-center justify-center mt-3 space-x-1.5">
              {isClient ? (
                <>
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse delay-300"></div>
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse delay-700"></div>
                </>
              ) : (
                <>
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-white/40 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default SignupPage;