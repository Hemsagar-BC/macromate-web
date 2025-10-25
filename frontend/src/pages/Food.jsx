// pages/Food.jsx - UPDATED with FoodLog Integration
import React, { useState, useEffect, useRef } from 'react';
import { foodCards } from '../constants';
import FoodLog from './FoodLog'; // Import FoodLog component
import { API_BASE } from '../api'; 

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
            {card.id === 'foodlog' && 'Open Food Log'}
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
  const [showFoodLog, setShowFoodLog] = useState(false); // New state for FoodLog

  const handleCardClick = (cardId) => {
    // If foodlog card is clicked, show FoodLog component
    if (cardId === 'foodlog') {
      setShowFoodLog(true);
    } else {
      setActiveModal(cardId);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  // If FoodLog is active, render it instead
  if (showFoodLog) {
    return <FoodLog navigateToPage={navigateToPage} onBack={() => setShowFoodLog(false)} />;
  }

  // Curated Food Database - 18 Common Foods
const foodDatabase = [
  // Fruits
  { name: 'Apple', category: 'Fruits', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, serving: '1 medium (182g)' },
  { name: 'Banana', category: 'Fruits', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, serving: '1 medium (118g)' },
  { name: 'Orange', category: 'Fruits', calories: 62, protein: 1.2, carbs: 15, fat: 0.2, serving: '1 medium (131g)' },
  
  // Vegetables
  { name: 'Broccoli', category: 'Vegetables', calories: 55, protein: 4, carbs: 11, fat: 0.6, serving: '1 cup (156g)' },
  { name: 'Carrot', category: 'Vegetables', calories: 25, protein: 0.6, carbs: 6, fat: 0.1, serving: '1 medium (61g)' },
  { name: 'Potato', category: 'Vegetables', calories: 163, protein: 4.3, carbs: 37, fat: 0.2, serving: '1 medium (173g)' },
  
  // Proteins
  { name: 'Chicken Breast', category: 'Proteins', calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: '100g cooked' },
  { name: 'Egg', category: 'Proteins', calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, serving: '1 large (50g)' },
  { name: 'Salmon', category: 'Proteins', calories: 206, protein: 22, carbs: 0, fat: 13, serving: '100g cooked' },
  
  // Grains
  { name: 'White Rice', category: 'Grains', calories: 205, protein: 4.3, carbs: 45, fat: 0.4, serving: '1 cup cooked (158g)' },
  { name: 'Brown Rice', category: 'Grains', calories: 216, protein: 5, carbs: 45, fat: 1.8, serving: '1 cup cooked (195g)' },
  { name: 'Oats', category: 'Grains', calories: 166, protein: 5.9, carbs: 28, fat: 3.6, serving: '1 cup cooked (234g)' },
  { name: 'Whole Wheat Bread', category: 'Grains', calories: 81, protein: 4, carbs: 14, fat: 1.1, serving: '1 slice (28g)' },
  
  // Dairy
  { name: 'Milk', category: 'Dairy', calories: 149, protein: 8, carbs: 12, fat: 8, serving: '1 cup (244ml)' },
  { name: 'Greek Yogurt', category: 'Dairy', calories: 100, protein: 17, carbs: 6, fat: 0.7, serving: '170g container' },
  { name: 'Cheese', category: 'Dairy', calories: 113, protein: 7, carbs: 1, fat: 9, serving: '1 slice (28g)' },
  
  // Nuts
  { name: 'Almonds', category: 'Nuts', calories: 164, protein: 6, carbs: 6, fat: 14, serving: '1 oz (28g)' },
  { name: 'Peanut Butter', category: 'Nuts', calories: 188, protein: 8, carbs: 7, fat: 16, serving: '2 tbsp (32g)' },
];

const MockFoodSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFood, setSelectedFood] = useState(null);

  const categories = ['All', 'Fruits', 'Vegetables', 'Proteins', 'Grains', 'Dairy', 'Nuts'];

  const filteredResults = foodDatabase.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold">Food Search</h3>
              <p className="text-orange-100 text-sm mt-1">{foodDatabase.length} Common Foods Database</p>
            </div>
            <button 
              onClick={closeModal}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search & Filter Section */}
        <div className="p-6 border-b border-gray-200 space-y-4">
          <input
            type="text"
            placeholder="Search for food items (e.g., apple, chicken, rice)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          />
          
          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Section */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedFood ? (
            <div className="space-y-6">
              <button
                onClick={() => setSelectedFood(null)}
                className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to results
              </button>

              {/* Food Details Card */}
              <div className="bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 rounded-xl p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl">
                      {selectedFood.category === 'Fruits' && '🍎'}
                      {selectedFood.category === 'Vegetables' && '🥦'}
                      {selectedFood.category === 'Proteins' && '🍗'}
                      {selectedFood.category === 'Grains' && '🌾'}
                      {selectedFood.category === 'Dairy' && '🥛'}
                      {selectedFood.category === 'Nuts' && '🥜'}
                    </span>
                    <div>
                      <h4 className="text-3xl font-bold text-gray-800">{selectedFood.name}</h4>
                      <p className="text-orange-600 font-medium">{selectedFood.serving}</p>
                    </div>
                  </div>
                  <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                    {selectedFood.category}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-5 text-center shadow-sm border-2 border-orange-200">
                    <div className="text-4xl mb-2">🔥</div>
                    <div className="text-3xl font-bold text-orange-600 mb-1">
                      {selectedFood.calories}
                    </div>
                    <div className="text-sm font-semibold text-gray-700">Calories</div>
                    <div className="text-xs text-gray-500 mt-1">kcal</div>
                  </div>

                  <div className="bg-white rounded-lg p-5 text-center shadow-sm border-2 border-blue-200">
                    <div className="text-4xl mb-2">💪</div>
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {selectedFood.protein}g
                    </div>
                    <div className="text-sm font-semibold text-gray-700">Protein</div>
                    <div className="text-xs text-gray-500 mt-1">grams</div>
                  </div>

                  <div className="bg-white rounded-lg p-5 text-center shadow-sm border-2 border-yellow-200">
                    <div className="text-4xl mb-2">🌾</div>
                    <div className="text-3xl font-bold text-yellow-600 mb-1">
                      {selectedFood.carbs}g
                    </div>
                    <div className="text-sm font-semibold text-gray-700">Carbs</div>
                    <div className="text-xs text-gray-500 mt-1">grams</div>
                  </div>

                  <div className="bg-white rounded-lg p-5 text-center shadow-sm border-2 border-green-200">
                    <div className="text-4xl mb-2">🥑</div>
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      {selectedFood.fat}g
                    </div>
                    <div className="text-sm font-semibold text-gray-700">Fat</div>
                    <div className="text-xs text-gray-500 mt-1">grams</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {filteredResults.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">😕</div>
                  <p className="text-gray-600 text-lg mb-2">No results found</p>
                  <p className="text-gray-500 text-sm">Try a different search term or category</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {filteredResults.map((food, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedFood(food)}
                      className="bg-gray-50 hover:bg-orange-50 rounded-xl p-5 cursor-pointer transition-all hover:shadow-lg border-2 border-transparent hover:border-orange-200 group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">
                            {food.category === 'Fruits' && '🍎'}
                            {food.category === 'Vegetables' && '🥦'}
                            {food.category === 'Proteins' && '🍗'}
                            {food.category === 'Grains' && '🌾'}
                            {food.category === 'Dairy' && '🥛'}
                            {food.category === 'Nuts' && '🥜'}
                          </span>
                          <div>
                            <h4 className="font-bold text-gray-800 text-lg group-hover:text-orange-600 transition-colors">
                              {food.name}
                            </h4>
                            <p className="text-xs text-gray-500">{food.category}</p>
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Cal</div>
                          <div className="font-bold text-orange-600">{food.calories}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Pro</div>
                          <div className="font-bold text-blue-600">{food.protein}g</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Carbs</div>
                          <div className="font-bold text-yellow-600">{food.carbs}g</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Fat</div>
                          <div className="font-bold text-green-600">{food.fat}g</div>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-500 mt-3 text-center">{food.serving}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

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
        if (!file.type.startsWith('image/')) {
          setError('Please select a valid image file');
          return;
        }

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
        const response = await fetch(`${API_BASE}/api/predict/food`, {
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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 rounded-t-2xl z-10">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">AI Food Analysis</h3>
                <p className="text-orange-100 text-sm mt-1">Powered by Deep Learning</p>
              </div>
              <button 
                onClick={closeModal} 
                className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Info Banner - Only show initially */}
            {!previewUrl && !result && (
              <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">Specialized for South Indian Cuisine</h4>
                    <p className="text-sm text-blue-800">
                      Our AI model is trained to recognize <strong>20+ popular Typical South Indian dishes</strong>
                    </p>
                  </div>
                </div>
              </div>
            )}

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
                  className="group border-2 border-dashed border-orange-300 hover:border-orange-400 rounded-xl p-16 text-center transition-all cursor-pointer block bg-gradient-to-br from-orange-50/50 to-white hover:from-orange-50 hover:to-orange-100/30"
                >
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">📸</div>
                  <p className="text-gray-700 font-semibold text-lg mb-2">Click to upload your food photo</p>
                  <p className="text-sm text-gray-500">Supports: JPG, JPEG, PNG (max 5MB)</p>
                  <div className="mt-4 inline-flex items-center px-4 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium group-hover:bg-orange-200 transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Select Image
                  </div>
                </label>
              </div>
            )}

            {/* Preview & Analyze Section */}
            {previewUrl && !result && (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden shadow-lg">
                  <img 
                    src={previewUrl} 
                    alt="Food preview" 
                    className="w-full h-80 object-cover"
                  />
                  <button
                    onClick={handleReset}
                    className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-full shadow-lg transition-all hover:scale-110"
                    title="Remove image"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {isAnalyzing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-6 w-6 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing your food...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                      Analyze Food
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Success Results Section */}
            {result && result.status === 'recognized' && (
              <div className="space-y-6">
                {/* Image with Badge */}
                <div className="relative rounded-xl overflow-hidden shadow-xl">
                  <img 
                    src={previewUrl} 
                    alt="Analyzed food" 
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center animate-pulse">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {result.confidence}% Match
                  </div>
                </div>

                {/* Food Name Card */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 shadow-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium mb-1">Identified Dish</p>
                      <h4 className="text-3xl font-bold capitalize">
                        {result.food.replace(/_/g, ' ')}
                      </h4>
                      <p className="text-orange-100 mt-2 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                        </svg>
                        {result.macros.serving}
                      </p>
                    </div>
                    <div className="text-6xl opacity-90">🍽️</div>
                  </div>
                </div>

                {/* Nutritional Information Grid */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-5">
                    <h5 className="text-xl font-bold text-gray-800 flex items-center">
                      <svg className="w-6 h-6 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Nutritional Information
                    </h5>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 text-center border-2 border-orange-200 hover:shadow-md transition-shadow">
                      <div className="text-4xl mb-2">🔥</div>
                      <div className="text-3xl font-bold text-orange-600 mb-1">{result.macros.calories}</div>
                      <div className="text-sm font-semibold text-orange-800">Calories</div>
                      <div className="text-xs text-orange-600 mt-1">kcal</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 text-center border-2 border-blue-200 hover:shadow-md transition-shadow">
                      <div className="text-4xl mb-2">💪</div>
                      <div className="text-3xl font-bold text-blue-600 mb-1">{result.macros.protein}g</div>
                      <div className="text-sm font-semibold text-blue-800">Protein</div>
                      <div className="text-xs text-blue-600 mt-1">grams</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-5 text-center border-2 border-yellow-200 hover:shadow-md transition-shadow">
                      <div className="text-4xl mb-2">🌾</div>
                      <div className="text-3xl font-bold text-yellow-600 mb-1">{result.macros.carbs}g</div>
                      <div className="text-sm font-semibold text-yellow-800">Carbs</div>
                      <div className="text-xs text-yellow-600 mt-1">grams</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 text-center border-2 border-green-200 hover:shadow-md transition-shadow">
                      <div className="text-4xl mb-2">🥑</div>
                      <div className="text-3xl font-bold text-green-600 mb-1">{result.macros.fat}g</div>
                      <div className="text-sm font-semibold text-green-800">Fat</div>
                      <div className="text-xs text-green-600 mt-1">grams</div>
                    </div>
                  </div>

                  {/* Important Notes */}
                  <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-lg p-4">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div className="text-sm text-blue-900">
                        <p className="font-semibold mb-2">Important Notes:</p>
                        <ul className="space-y-1.5 text-blue-800">
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>These values are based on typical Indian restaurant/homemade preparations</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Macros can vary based on cooking methods, oil used, and ingredient proportions</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Serving sizes are standard portions commonly consumed</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>All values are approximate and rounded to whole numbers for practical use</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleReset}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3.5 rounded-xl font-semibold transition-all shadow hover:shadow-md flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Analyze Another
                  </button>
                  <button
                    onClick={closeModal}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Done
                  </button>
                </div>
              </div>
            )}

            {/* Unknown Food Result */}
            {result && result.status === 'unknown' && (
              <div className="space-y-6">
                <div className="relative rounded-xl overflow-hidden shadow-lg">
                  <img 
                    src={previewUrl} 
                    alt="Analyzed food" 
                    className="w-full h-64 object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-6 shadow-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-2xl">
                        ⚠️
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="text-xl font-bold text-gray-900 mb-3">
                        Unable to Identify This Dish
                      </h4>
                      <ul className="space-y-2 mb-4">
                        <li className="flex items-start text-gray-700">
                          <span className="text-orange-500 mr-2 font-bold">•</span>
                          <span>The dish is not in my training dataset of 20+ South Indian dishes</span>
                        </li>
                        <li className="flex items-start text-gray-700">
                          <span className="text-orange-500 mr-2 font-bold">•</span>
                          <span>The image quality or lighting needs improvement</span>
                        </li>
                        <li className="flex items-start text-gray-700">
                          <span className="text-orange-500 mr-2 font-bold">•</span>
                          <span>The food presentation differs from my training examples</span>
                        </li>
                      </ul>
                      <div className="bg-white/70 rounded-lg p-4 border border-yellow-200">
                        <p className="text-sm text-gray-800 font-medium mb-1">💡 Suggestion:</p>
                        <p className="text-sm text-gray-700">
                          Try taking a clearer photo with better lighting, or ensure the dish is one of the popular South Indian items I'm trained to recognize.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Try Another Photo
                </button>
              </div>
            )}
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
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'search' && <MockFoodSearch />}
      {activeModal === 'upload' && <RealPhotoUpload />}
    </>
  );
};

export default Food;