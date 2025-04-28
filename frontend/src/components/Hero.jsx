import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";


const Hero = () => {
  const [animateText, setAnimateText] = useState(false);
  const [animateIcons, setAnimateIcons] = useState(false);
  const [animateButton, setAnimateButton] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimateText(true), 300);
    setTimeout(() => setAnimateIcons(true), 1000);
    setTimeout(() => setAnimateButton(true), 1700);
  }, []);

  return (
    <section className="relative w-full h-screen bg-[#121212] overflow-hidden">
      {/* Abstract background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
          {Array(144).fill(0).map((_, i) => (
            <div key={i} className="border border-gray-700"></div>
          ))}
        </div>
      </div>

      {/* Animated gradient orb */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-indigo-700 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-700 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      
      {/* Main content */}
      <div className="relative flex flex-col items-center justify-center w-full h-full text-center text-white z-10 px-6 md:px-12">
        <div className={`transition-all duration-700 ${animateText ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4">
            Elevate Your <span className="text-indigo-400">Web Analytics</span>
          </h1>
          <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto text-gray-300">
            Automate analysis and get AI-powered suggestions to fix code errors in your web applications
          </p>
        </div>

        {/* Animated icons */}
        <div className={`flex justify-center gap-8 mb-8 transition-all duration-700 ${animateIcons ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
          <div className="flex flex-col items-center">
           
            <span className="text-sm text-gray-400">Auto Analytics</span>
          </div>
          <div className="flex flex-col items-center">
           
            <span className="text-sm text-gray-400">Error Detection</span>
          </div>
          <div className="flex flex-col items-center">
            
            <span className="text-sm text-gray-400">AI Suggestions</span>
          </div>
        </div>

        {/* URL input and button */}
        <div className={`flex justify-center flex-col sm:flex-row gap-4 w-full max-w-xl transition-all duration-700 ${animateButton ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
          
          <Link to="/home" className="flex-shrink-0 justify-center">
            <button className= "bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg text-lg font-semibold transition duration-300 flex items-center gap-2 w-full sm:w-auto">
              Analyze Now
            </button>
          </Link>
        </div>
        
        {/* Featured users */}
        <div className={`mt-10 transition-all duration-700 delay-100 ${animateButton ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
          <p className="text-sm text-gray-500 mb-2">Trusted by developers worldwide</p>
          <div className="flex justify-center gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;