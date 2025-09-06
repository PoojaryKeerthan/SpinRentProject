"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const GetStartedPage = () => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSignup = (role: "PROVIDER" | "BORROWER") => {
    localStorage.setItem("role", role);
    router.push(`/auth/signup`);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        
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
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 pt-24 md:pt-8">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left">
              {/* Main Header */}
              <div className="mb-8 lg:mb-12">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 lg:mb-6">
                  Let's Get Started!!
                </h1>
                <p className="text-lg sm:text-xl lg:text-2xl text-white/80 leading-relaxed">
                  Choose how you want to use the platform:
                </p>
              </div>

              {/* Glassmorphism Container for Buttons */}
              <div className="relative w-full max-w-md lg:max-w-lg">
                {/* Background blur effect */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 shadow-2xl"></div>
                
                {/* Gradient border effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-400/20 via-transparent to-white/10 p-0.5">
                  <div className="h-full w-full rounded-3xl bg-black/10 backdrop-blur-sm"></div>
                </div>
                
                {/* Buttons Container */}
                <div className="relative p-6 sm:p-8 lg:p-10 space-y-6">
                  {/* Provider Button */}
                  <button
                    onClick={() => handleSignup("PROVIDER")}
                    className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white  py-4 px-6 rounded-2xl border border-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-lg group hover:cursor-pointer"
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <span>Sign up as Provider</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                      </svg>
                    </div>
                    
                  </button>

                  {/* Divider */}
                  <div className="flex items-center justify-center">
                    <div className="flex-1 border-t border-white/20"></div>
                    <span className="px-4 text-white/60 text-sm font-medium">or</span>
                    <div className="flex-1 border-t border-white/20"></div>
                  </div>

                  {/* Borrower Button */}
                  <button
                    onClick={() => handleSignup("BORROWER")}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-lg group hover:cursor-pointer"
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <span>Sign up as Borrower</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                      </svg>
                    </div>
                  </button>
                  <div className="lg:mt-6 text-white/60 text-sm text-center">
                  already have an account?<span onClick={()=>router.push('auth/signin')} className="hover:cursor-pointer "><u> Login</u></span>
                </div>
                </div>

                

                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-orange-400/30 to-orange-600/30 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-white/20 to-orange-300/20 rounded-full blur-lg"></div>
              </div>

              {/* Bottom decorative text */}
              <div className="mt-8 text-center lg:text-left">
                <p className="text-white/60 text-sm mb-4">
                  Join our community of dj enthusiasts
                </p>
                <div className="flex items-center justify-center lg:justify-start space-x-2">
                  {isClient ? (
                    <>
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse delay-300"></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-700"></div>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side - DJ Character */}
            <div className="order-1 lg:order-2 flex items-center justify-center">
              <div className="relative">
                {/* Glowing background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-orange-600/20 rounded-full blur-3xl scale-150"></div>
                
                {/* Character Image */}
                <div className="relative z-10">
                  <img
                    src="/djboy.png"
                    alt="3D DJ Character"
                    className="w-64 h-64 sm:w-80 sm:h-80 lg:w-110 lg:h-110 object-contain filter drop-shadow-2xl"
                    onError={(e) => {
                      // Fallback if image doesn't load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `
                        <div class="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-orange-400/20 to-orange-600/20 rounded-full backdrop-blur-sm border border-white/10 flex items-center justify-center">
                          <div class="text-6xl">🎧</div>
                        </div>
                      `;
                    }}
                  />
                </div>

                {/* Floating elements around character */}
                {isClient && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-10 right-10 w-4 h-4 bg-orange-400/40 rounded-full animate-bounce delay-200"></div>
                    <div className="absolute bottom-20 left-10 w-3 h-3 bg-white/30 rounded-full animate-pulse delay-500"></div>
                    <div className="absolute top-1/2 right-5 w-2 h-2 bg-orange-300/50 rounded-full animate-bounce delay-1000"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default GetStartedPage;