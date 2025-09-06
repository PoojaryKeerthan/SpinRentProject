"use client";

import React from 'react';

const About = () => {
  const features = [
    {
      title: "Hassle-Free Rentals",
      description: "Easily rent DJ gadgets, speakers, and lights with just a few clicks — no complicated process, everything is smooth and fast."
    },
    {
      title: "Affordable Pricing", 
      description: "We ensure competitive rental rates so you can enjoy high-quality equipment without breaking your budget."
    },
    {
      title: "Wide Range of Products",
      description: "From professional DJ sets to event essentials, choose from a wide variety of products that fit your needs."
    },
    {
      title: "Reliable Service",
      description: "Our team ensures that the equipment is delivered on time and in excellent condition, so you can focus on your event."
    }
  ];

  // Duplicate the features array to create seamless infinite loop
  const duplicatedFeatures = [...features, ...features];

  return (
    <div className="bg-gray-50 py-16 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Main Heading */}
        <div className="mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 md:text-5xl lg:text-6xl text-center">
            Why Choosing Us
          </h1>
        </div>

        {/* Infinite Scrolling Container */}
        <div className="relative overflow-hidden">
          <div className="flex animate-infinite-scroll">
            {duplicatedFeatures.map((feature, index) => (
              <div 
                key={index}
                className="flex-shrink-0 w-80 mx-4"
              >
                <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 h-64 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  {/* <div className="flex items-center text-orange-500 cursor-pointer mt-6 hover:text-orange-600 transition-colors duration-200">
                    <span className="text-sm font-medium mr-2">More Info</span>
                    <span className="text-lg">→</span>
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Optional: Pause on hover hint */}
        
      </div>

      <style jsx>{`
        @keyframes infinite-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-infinite-scroll {
          animation: infinite-scroll 20s linear infinite;
        }

        .animate-infinite-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default About;