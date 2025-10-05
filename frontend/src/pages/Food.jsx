// pages/Food.jsx - Complete Version
import React, { useState, useEffect, useRef } from 'react';
import { foodCards } from '../constants';

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

const FoodCard = ({ card, onClick }) => {
  return (
    <div 
      onClick={() => onClick(card.id)}
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 overflow-hidden"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-200 via-orange-300 to-orange-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
      </div>
      <div className="absolute inset-[2px] rounded-2xl bg-white"></div>
      
      <div className="relative z-10 p-8">
        <div className="relative mb-6">
          <div className={`w-20 h-20 bg-gradient-to-r ${card.color} rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg group-hover:shadow-2xl transition-all duration-300`}>
            {card.icon}
          </div>
          <div className={`absolute top-0 left-0 w-20 h-20 bg-gradient-to-r ${card.color} rounded-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 blur-xl animate-pulse`}></div>
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-orange-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
          {card.title}
        </h3>

        <p className="text-gray-600 mb-6 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
          {card.description}
        </p>

        <ul className="space-y-3 mb-6">
          {card.features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
              <div className="w-2 h-2 bg-orange-400 rounded-full mr-3 group-hover:bg-orange-500 transition-all duration-300"></div>
              {feature}
            </li>
          ))}
        </ul>

        <button className={`relative w-full py-3 px-6 bg-gradient-to-r ${card.color} text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 overflow-hidden`}>
          <span className="relative z-10">
            {card.id === 'search' && 'Start Searching'}
            {card.id === 'upload' && 'Upload Photo'}
            {card.id === 'converter' && 'Convert Now'}
          </span>
        </button>

        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="w-2 h-2 bg-orange-300 rounded-full animate-bounce"></div>
        </div>
        <div className="absolute top-10 right-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="w-1 h-1 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
        <div className="absolute top-14 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-900">
          <div className="w-1 h-1 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
        </div>
      </div>
    </div>
  );
};

const Food = ({ navigateToPage }) => {
  const [activeModal, setActiveModal] = useState(null);

  const handleCardClick = (cardId) => {
    setActiveModal(cardId);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const MockFoodSearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [results] = useState([
      { name: 'Apple (Medium)', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
      { name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
      { name: 'Rice (1 cup cooked)', calories: 205, protein: 4.3, carbs: 45, fat: 0.4 }
    ]);

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Food Search</h3>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search for food items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-4">
            {results.map((food, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                <h4 className="font-semibold text-gray-800 mb-2">{food.name}</h4>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Calories:</span>
                    <div className="font-semibold text-orange-600">{food.calories}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Protein:</span>
                    <div className="font-semibold">{food.protein}g</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Carbs:</span>
                    <div className="font-semibold">{food.carbs}g</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Fat:</span>
                    <div className="font-semibold">{food.fat}g</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const MockPhotoUpload = () => {
    const [analysis] = useState({
      food: 'Grilled Chicken Salad',
      confidence: 94,
      calories: 320,
      protein: 28,
      carbs: 12,
      fat: 18
    });

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-2xl w-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Photo Analysis</h3>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors">
              <div className="text-4xl mb-4">📷</div>
              <p className="text-gray-600 mb-4">Drag and drop your food photo here, or click to browse</p>
              <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                Choose Photo
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Analysis Complete ({analysis.confidence}% confidence)
            </h4>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-gray-800 mb-3">Identified Food:</h5>
                <p className="text-lg font-semibold text-orange-600">{analysis.food}</p>
              </div>
              <div>
                <h5 className="font-medium text-gray-800 mb-3">Nutritional Breakdown:</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Calories:</span>
                    <span className="font-semibold text-orange-600">{analysis.calories}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Protein:</span>
                    <span className="font-semibold">{analysis.protein}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carbs:</span>
                    <span className="font-semibold">{analysis.carbs}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fat:</span>
                    <span className="font-semibold">{analysis.fat}g</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const FitnessChatbot = () => {
    const [messages, setMessages] = useState([
      { role: 'bot', content: 'Hi! I\'m your AI fitness coach. Ask me about workouts, nutrition, or fitness goals!' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
      scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
      if (!input.trim()) return;

      const userMessage = input.trim();
      setInput('');
      setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
      setLoading(true);

      try {
        const response = await fetch('http://localhost:5000/api/chatbot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: userMessage })
        });

        const data = await response.json();

        if (data.success) {
          setMessages(prev => [...prev, { 
            role: 'bot', 
            content: data.data.response,
            type: data.data.type 
          }]);
        } else {
          setMessages(prev => [...prev, { 
            role: 'bot', 
            content: 'Sorry, I encountered an error. Please try again.' 
          }]);
        }
      } catch (error) {
        setMessages(prev => [...prev, { 
          role: 'bot', 
          content: 'Connection error. Make sure the backend server is running.' 
        }]);
      } finally {
        setLoading(false);
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    };

    const quickQuestions = [
      'Give me beginner workout',
      'Give some protein rich foods for muscle growth',
      'How can I lose weight safely?',
      'Tell me some best cardio exercises',
      'How to recover faster from muscle soreness(DOMS)?',
      'Give some insights about supplements'
      

    ];

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-3xl h-[600px] flex flex-col">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">🤖</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Fitness AI Coach</h3>
                <p className="text-xs text-gray-500">Powered by local AI</p>
              </div>
            </div>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  {msg.type && (
                    <p className="text-xs mt-2 opacity-70">
                      {msg.type === 'structured' ? '📚 Pre-defined answer' : '🤖 AI generated'}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="px-6 pb-4">
              <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(q)}
                    className="text-left text-xs p-2 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-200"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-6 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about workouts, nutrition, or fitness goals..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-orange-500 to-orange-600 sm:mx-6 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 relative overflow-hidden">
        <ParticleBackground />
        
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => navigateToPage('home')}
                  className="flex items-center text-gray-600 hover:text-orange-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back
                </button>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">M</span>
                  </div>
                  <span className="text-xl font-bold text-gray-800">MacroMate</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Food <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Analysis Tools</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the nutritional content of your meals using our advanced AI technology and comprehensive food database.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {foodCards.map((card) => (
              <FoodCard 
                key={card.id} 
                card={card} 
                onClick={handleCardClick}
              />
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Why Use Our Food Analysis?
              </h3>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl mb-3">🎯</div>
                  <h4 className="font-semibold text-gray-800 mb-2">Accurate Results</h4>
                  <p className="text-gray-600 text-sm">AI-powered recognition with 94% accuracy for instant nutritional analysis</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-3">⚡</div>
                  <h4 className="font-semibold text-gray-800 mb-2">Lightning Fast</h4>
                  <p className="text-gray-600 text-sm">Get nutritional information in seconds, not minutes</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-3">📊</div>
                  <h4 className="font-semibold text-gray-800 mb-2">Detailed Breakdown</h4>
                  <p className="text-gray-600 text-sm">Complete macro and micronutrient information for better tracking</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'search' && <MockFoodSearch />}
      {activeModal === 'upload' && <MockPhotoUpload />}
      {activeModal === 'converter' && <FitnessChatbot/>}
    </>
  );
};

export default Food;