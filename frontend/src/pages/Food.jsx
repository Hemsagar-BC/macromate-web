// pages/Food.jsx - UPDATED with Real API Integration
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

  // ============================================
  // REAL PHOTO UPLOAD WITH API INTEGRATION
  // ============================================
  const RealPhotoUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileSelect = (event) => {
      const file = event.target.files[0];
      if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          setError('Please select a valid image file');
          return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setError('Image size should be less than 5MB');
          return;
        }

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setError(null);
        setResult(null);
      }
    };

    const handleAnalyze = async () => {
      if (!selectedFile) {
        setError('Please select an image first');
        return;
      }

      setIsAnalyzing(true);
      setError(null);

      const formData = new FormData();
      formData.append('image', selectedFile);

      try {
        const response = await fetch('http://localhost:5000/api/predict/food', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          setResult(data);
        } else {
          setError(data.error || 'Prediction failed');
        }
      } catch (err) {
        setError('Failed to connect to server. Make sure backend is running.');
        console.error('Error:', err);
      } finally {
        setIsAnalyzing(false);
      }
    };

    const handleReset = () => {
      setSelectedFile(null);
      setPreviewUrl(null);
      setResult(null);
      setError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">AI Food Analysis</h3>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Upload Section */}
          {!previewUrl && (
            <div className="mb-6">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="food-upload"
              />
              <label
                htmlFor="food-upload"
                className="border-2 border-dashed border-orange-300 rounded-lg p-12 text-center hover:border-orange-400 transition-colors cursor-pointer block"
              >
                <div className="text-5xl mb-4">📷</div>
                <p className="text-gray-600 mb-4">Click to upload your food photo</p>
                <p className="text-sm text-gray-500">Supports: JPG, JPEG, PNG (max 5MB)</p>
              </label>
            </div>
          )}

          {/* Preview Section */}
          {previewUrl && !result && (
            <div className="mb-6">
              <div className="relative">
                <img 
                  src={previewUrl} 
                  alt="Food preview" 
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  onClick={handleReset}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full mt-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  '🔍 Analyze Food'
                )}
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            </div>
          )}

          {/* Results Section */}
          {result && result.status === 'recognized' && (
            <div className="space-y-6">
              {/* Preview Image */}
              <div className="relative">
                <img 
                  src={previewUrl} 
                  alt="Analyzed food" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                  <span className="mr-1">✓</span>
                  {result.confidence}% confident
                </div>
              </div>

              {/* Food Name */}
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
                <h4 className="text-2xl font-bold text-gray-800 mb-2 capitalize">
                  {result.food.replace(/_/g, ' ')}
                </h4>
                <p className="text-sm text-gray-600">Serving: {result.macros.serving}</p>
              </div>

              {/* Nutritional Information */}
              <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
                <h5 className="font-semibold text-gray-800 mb-4 text-lg">Nutritional Information</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-3xl mb-2">🔥</div>
                    <div className="text-2xl font-bold text-orange-600">{result.macros.calories}</div>
                    <div className="text-sm text-gray-600">Calories</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl mb-2">💪</div>
                    <div className="text-2xl font-bold text-blue-600">{result.macros.protein}g</div>
                    <div className="text-sm text-gray-600">Protein</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-3xl mb-2">🌾</div>
                    <div className="text-2xl font-bold text-yellow-600">{result.macros.carbs}g</div>
                    <div className="text-sm text-gray-600">Carbs</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl mb-2">🥑</div>
                    <div className="text-2xl font-bold text-green-600">{result.macros.fat}g</div>
                    <div className="text-sm text-gray-600">Fat</div>
                  </div>
                </div>
              </div>

              {/* Top 3 Predictions */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-semibold text-gray-800 mb-3">Top 3 Predictions:</h5>
                <div className="space-y-2">
                  {result.top_3.map((pred, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-700 capitalize">{index + 1}. {pred.name.replace(/_/g, ' ')}</span>
                      <span className="text-gray-600 font-medium">{(pred.confidence * 100).toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Analyze Another
                </button>
                <button
                  onClick={closeModal}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* Unknown Food Result */}
          {result && result.status === 'unknown' && (
            <div className="space-y-6">
              <div className="relative">
                <img 
                  src={previewUrl} 
                  alt="Analyzed food" 
                  className="w-full h-48 object-cover rounded-lg opacity-50"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h4 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
                  <span className="text-2xl mr-2">⚠️</span>
                  Food Not Recognized
                </h4>
                <p className="text-gray-700 mb-4">{result.message}</p>
                <p className="text-sm text-gray-600">
                  <strong>Best guess:</strong> {result.best_guess.replace(/_/g, ' ')} ({result.confidence}% confident)
                </p>
                <p className="text-sm text-gray-600 mt-2">{result.suggestion}</p>
              </div>

              {/* Top 3 for unknown */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-semibold text-gray-800 mb-3">Possible matches:</h5>
                <div className="space-y-2">
                  {result.top_3.map((pred, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-700 capitalize">{index + 1}. {pred.name.replace(/_/g, ' ')}</span>
                      <span className="text-gray-600 font-medium">{(pred.confidence * 100).toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all"
              >
                Try Another Photo
              </button>
            </div>
          )}
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
          <div className="mb-8">
            <button 
              onClick={() => navigateToPage('home')}
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
                  <p className="text-gray-600 text-sm">AI-powered recognition with high accuracy for instant nutritional analysis</p>
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
      {activeModal === 'upload' && <RealPhotoUpload />}
    </>
  );
};

export default Food;