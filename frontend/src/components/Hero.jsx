import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ParticleBackground = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const particleArray = [];
    for (let i = 0; i < 50; i++) {
      particleArray.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
    setParticles(particleArray);

    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + particle.speedX + 100) % 100,
        y: (particle.y + particle.speedY + 100) % 100
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-orange-300 rounded-full"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: particle.opacity,
            scale: 1
          }}
          transition={{ duration: 0.5, delay: particle.id * 0.01 }}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            boxShadow: '0 0 6px rgba(251, 146, 60, 0.5)'
          }}
        />
      ))}
    </div>
  );
};

const Hero = ({ navigateToPage }) => {
  return (
    <section 
      id="home" 
      className="min-h-screen relative bg-gradient-to-br from-gray-50 to-orange-50 flex items-center justify-center overflow-hidden pt-16 px-4"
    >
      <ParticleBackground />
      
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          {/* Main Title - Responsive sizing with animation */}
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-800 mb-4 sm:mb-6 leading-tight"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
              MacroMate
            </span>
          </motion.h1>
          
          {/* Subtitle - Responsive sizing and spacing with animation */}
          <motion.p 
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Transform your health journey with AI-powered nutrition tracking. 
            Calculate calories, analyze food photos, and master your macros with precision.
          </motion.p>

          {/* Action Buttons - Responsive layout with staggered animation */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <motion.button
              onClick={() => navigateToPage('calculate')}
              className="w-full sm:w-auto group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Calculate</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.button>
            
            <motion.button
              onClick={() => navigateToPage('food')}
              className="w-full sm:w-auto group relative px-6 sm:px-8 py-3 sm:py-4 bg-white text-orange-600 font-semibold rounded-xl border-2 border-orange-500 hover:bg-orange-500 hover:text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Analyze Food</span>
            </motion.button>
          </motion.div>

          {/* Feature Stats - Responsive grid with staggered animation */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            {[
              { value: "10K+", label: "Foods Database" },
              { value: "AI", label: "Powered Analysis" },
              { value: "24/7", label: "Tracking Support" },
              { value: "100%", label: "Free to Use" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 + (index * 0.1) }}
                whileHover={{ scale: 1.1 }}
              >
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-600 mb-1 sm:mb-2">{stat.value}</div>
                <div className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator - Hidden on small screens with animation */}
      <motion.div 
        className="hidden md:block absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.8, 
          delay: 1,
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 0.5
        }}
      >
        <div className="w-6 h-10 border-2 border-orange-400 rounded-full flex justify-center">
          <motion.div 
            className="w-1 h-3 bg-orange-400 rounded-full mt-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;