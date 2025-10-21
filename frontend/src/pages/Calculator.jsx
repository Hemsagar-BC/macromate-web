// pages/Calculate.jsx - With Particle Background
import React, { useState, useEffect } from 'react';
import { calculateCards } from '../constants';
import ProgressDashboard from '../components/ProgressDashboard.jsx';
import CalorieCalculator from '../components/CalorieCalculator';
import BodyFatCalculator from '../components/BodyFatCalculator';

// Particle Background Component
const ParticleBackground = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const particleArray = [];
    for (let i = 0; i < 30; i++) {
      particleArray.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
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
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-orange-300 rounded-full animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            boxShadow: '0 0 6px rgba(251, 146, 60, 0.5)'
          }}
        />
      ))}
    </div>
  );
};

const CalculatorCard = ({ card, onClick }) => {
  return (
    <div 
      onClick={() => onClick(card.id)}
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 overflow-hidden"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-200 via-orange-300 to-orange-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
      <div className="absolute inset-[2px] rounded-2xl bg-white"></div>
      
      <div className="relative z-10 p-8">
        <div className="relative mb-6">
          <div className={`w-20 h-20 bg-gradient-to-r ${card.color} rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
            {card.icon}
          </div>
          <div className={`absolute top-0 left-0 w-20 h-20 bg-gradient-to-r ${card.color} rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-xl`}></div>
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors duration-300">
          {card.title}
        </h3>

        <p className="text-gray-600 mb-6 leading-relaxed">
          {card.description}
        </p>

        <ul className="space-y-3 mb-6">
          {card.features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-orange-400 rounded-full mr-3 group-hover:bg-orange-500 transition-colors duration-300"></div>
              {feature}
            </li>
          ))}
        </ul>

        <button className={`w-full py-3 px-6 bg-gradient-to-r ${card.color} text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300`}>
          Calculate Now
        </button>

        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="w-2 h-2 bg-orange-300 rounded-full animate-ping"></div>
        </div>
        <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="w-1 h-1 bg-orange-400 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
        </div>
        <div className="absolute top-12 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-900">
          <div className="w-1 h-1 bg-orange-500 rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
        </div>
      </div>
    </div>
  );
};

// CHANGE 1: Update component signature to accept progressData and onProgressDataChange
const Calculate = ({ navigateToPage, progressData, onProgressDataChange }) => {
  const [activeCalculator, setActiveCalculator] = useState(null);

  const handleCardClick = (cardId) => {
    setActiveCalculator(cardId);
  };

  const handleBackToCalculators = () => {
    setActiveCalculator(null);
  };

  const handleBackToHero = () => {
    navigateToPage('home');
  };

  // CHANGE 2: Update ProgressDashboard to include the new props
  if (activeCalculator === 'bmi') {
    return <ProgressDashboard 
      onBack={handleBackToCalculators} 
      navigateToCalculator={(calcId) => setActiveCalculator(calcId)}
      initialData={progressData}
      onDataChange={onProgressDataChange}
    />;
  }

  if (activeCalculator === 'calories') {
    return <CalorieCalculator onBack={handleBackToCalculators} handleBackToHero={handleBackToHero} />;
  }

  if (activeCalculator === 'bodyfat') {
    return <BodyFatCalculator onBack={handleBackToCalculators} handleBackToHero={handleBackToHero} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 relative overflow-hidden">
      <ParticleBackground />
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleBackToHero}
                className="flex items-center text-gray-600 hover:text-orange-600 transition-colors duration-200 group"
              >
                <svg className="w-6 h-6 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="font-medium">Back to Home</span>
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold text-gray-800">MacroMate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Back to Home Button */}
        <div className="mb-8">
          <button 
            onClick={handleBackToHero}
            className="flex items-center text-gray-600 hover:text-orange-600 transition-all duration-200 group"
          >
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Back to Home</span>
          </button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Choose Your <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Calculator</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select the calculator that fits your health and fitness goals. Each tool provides personalized insights to help you make informed decisions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {calculateCards.map((card, index) => (
            <CalculatorCard 
              key={card.id} 
              card={card} 
              onClick={handleCardClick}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Need Help Choosing?
            </h3>
            <p className="text-gray-600 mb-6">
              Not sure which calculator to use first? We recommend starting with the BMI calculator to understand your current health status, then moving to calorie planning for your goals.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">1️⃣</div>
                <div className="font-semibold text-gray-800">Start with BMI</div>
                <div className="text-sm text-gray-600">Know your baseline</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">2️⃣</div>
                <div className="font-semibold text-gray-800">Plan Calories</div>
                <div className="text-sm text-gray-600">Set your daily goals</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">3️⃣</div>
                <div className="font-semibold text-gray-800">Optimize Macros</div>
                <div className="text-sm text-gray-600">Fine-tune nutrition</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculate;