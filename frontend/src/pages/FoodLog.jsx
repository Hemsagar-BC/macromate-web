import React, { useState, useEffect } from 'react';

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

// Add Food Modal Component
const AddFoodModal = ({ isOpen, onClose, onAdd, mealType }) => {
  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Food name is required';
    if (!formData.calories || formData.calories <= 0) newErrors.calories = 'Valid calories required';
    if (!formData.protein || formData.protein < 0) newErrors.protein = 'Valid protein amount required';
    if (!formData.carbs || formData.carbs < 0) newErrors.carbs = 'Valid carbs amount required';
    if (!formData.fat || formData.fat < 0) newErrors.fat = 'Valid fat amount required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onAdd({
        ...formData,
        calories: Number(formData.calories),
        protein: Number(formData.protein),
        carbs: Number(formData.carbs),
        fat: Number(formData.fat),
        mealType
      });
      setFormData({ name: '', calories: '', protein: '', carbs: '', fat: '' });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold">Add Food Item</h3>
              <p className="text-orange-100 text-sm mt-1 capitalize">{mealType}</p>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Food Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Grilled Chicken"
              className={`w-full px-4 py-3 border ${errors.name ? 'border-red-400' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Calories <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="calories"
              value={formData.calories}
              onChange={handleChange}
              placeholder="250"
              className={`w-full px-4 py-3 border ${errors.calories ? 'border-red-400' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
            />
            {errors.calories && <p className="text-red-500 text-sm mt-1">{errors.calories}</p>}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Protein (g)
              </label>
              <input
                type="number"
                name="protein"
                value={formData.protein}
                onChange={handleChange}
                placeholder="20"
                className={`w-full px-3 py-3 border ${errors.protein ? 'border-red-400' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Carbs (g)
              </label>
              <input
                type="number"
                name="carbs"
                value={formData.carbs}
                onChange={handleChange}
                placeholder="30"
                className={`w-full px-3 py-3 border ${errors.carbs ? 'border-red-400' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Fat (g)
              </label>
              <input
                type="number"
                name="fat"
                value={formData.fat}
                onChange={handleChange}
                placeholder="10"
                className={`w-full px-3 py-3 border ${errors.fat ? 'border-red-400' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
            >
              Add Food
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TargetCard = ({ item, onDelete }) => {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl shadow-md p-4 border-2 border-purple-300">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl">🎯</span>
            <h4 className="font-bold text-purple-800 text-lg">{item.name}</h4>
          </div>
          <p className="text-xs text-purple-600 font-medium">Daily Calorie & Macro Target</p>
        </div>
        <button
          onClick={() => onDelete(item.id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
          title="Remove target"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="bg-white/70 rounded-lg p-3">
        <div className="flex items-center justify-center mb-3">
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Total Target</p>
            <p className="text-3xl font-bold text-orange-600">{item.calories}</p>
            <p className="text-xs text-gray-500">calories/day</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-200">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Protein</p>
            <p className="font-bold text-blue-600">💪 {item.protein}g</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Carbs</p>
            <p className="font-bold text-yellow-600">🌾 {item.carbs}g</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Fat</p>
            <p className="font-bold text-green-600">🥑 {item.fat}g</p>
          </div>
        </div>
      </div>

      <div className="mt-3 bg-purple-100 rounded-lg p-2">
        <p className="text-xs text-purple-800 text-center">
          ✨ This is your daily target. Track your meals below to see progress!
        </p>
      </div>
    </div>
  );
};

const FoodItemCard = ({ item, onDelete }) => {
  // If it's a target, use the special TargetCard component
  if (item.isTarget) {
    return <TargetCard item={item} onDelete={onDelete} />;
  }
  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 border border-gray-100">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="font-bold text-gray-800 text-lg mb-1">{item.name}</h4>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
              🔥 {item.calories} cal
            </span>
          </div>
        </div>
        <button
          onClick={() => onDelete(item.id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
          title="Delete"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-gray-100">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Protein</p>
          <p className="font-bold text-blue-600">💪 {item.protein}g</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Carbs</p>
          <p className="font-bold text-yellow-600">🌾 {item.carbs}g</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Fat</p>
          <p className="font-bold text-green-600">🥑 {item.fat}g</p>
        </div>
      </div>
    </div>
  );
};

const MealSection = ({ title, icon, mealType, items, onAddClick, onDelete }) => {
  const totalCalories = items.reduce((sum, item) => sum + item.calories, 0);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{icon}</div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            {items.length > 0 && (
              <p className="text-sm text-gray-500">{totalCalories} calories total</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {items.map(item => (
          <FoodItemCard 
            key={item.id} 
            item={item} 
            onDelete={onDelete}
          />
        ))}
      </div>

      <button
        onClick={() => onAddClick(mealType)}
        className="w-full mt-4 py-3 border-2 border-dashed border-orange-300 hover:border-orange-400 rounded-xl text-orange-600 font-semibold hover:bg-orange-50 transition-all flex items-center justify-center space-x-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span>Add {title} Item</span>
      </button>
    </div>
  );
};

const FoodLog = ({ navigateToPage }) => {
  const [foodItems, setFoodItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMealType, setCurrentMealType] = useState('');
  const [savedGoals, setSavedGoals] = useState(null);
  const [showSetupPrompt, setShowSetupPrompt] = useState(false);

  // Load saved goals and food log from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem('macromate_progress');
    if (storedData) {
      const data = JSON.parse(storedData);
      setSavedGoals(data.profile);
    } else {
      setShowSetupPrompt(true);
    }

    // Load today's food log
    const today = new Date().toISOString().split('T')[0];
    const foodLog = localStorage.getItem(`macromate_foodlog_${today}`);
    if (foodLog) {
      setFoodItems(JSON.parse(foodLog));
    }
  }, []);

  // Save food log whenever it changes
  useEffect(() => {
    if (foodItems.length >= 0) {
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(`macromate_foodlog_${today}`, JSON.stringify(foodItems));
    }
  }, [foodItems]);

  const getCurrentDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  const handleAddClick = (mealType) => {
    setCurrentMealType(mealType);
    setIsModalOpen(true);
  };

  const handleAddFood = (foodData) => {
    const newItem = {
      id: Date.now(),
      ...foodData,
      timestamp: new Date().toISOString()
    };
    setFoodItems(prev => [...prev, newItem]);
  };

  const handleDeleteFood = (id) => {
    setFoodItems(prev => prev.filter(item => item.id !== id));
  };

  const getMealItems = (mealType) => {
  // Exclude target entries from meal items
  return foodItems.filter(item => item.mealType === mealType && !item.isTarget);
};

  const calculateTotals = () => {
  // Exclude target entries from totals calculation
  return foodItems
    .filter(item => !item.isTarget)
    .reduce((totals, item) => ({
      calories: totals.calories + item.calories,
      protein: totals.protein + item.protein,
      carbs: totals.carbs + item.carbs,
      fat: totals.fat + item.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
};

  // Calculate macros using SAME logic as Calorie Calculator
  const calculateMacrosFromCalories = (calories, weight, goalType = 'maintain') => {
    // This matches the exact logic from CalorieCalculator.jsx
    let proteinGrams, fatGrams, carbGrams;
    
    // Determine goal type from saved data or default to maintenance
    const isLossGoal = goalType && (
      goalType.includes('Loss') || 
      goalType.includes('loss') || 
      goalType === 'mildLoss' || 
      goalType === 'weightLoss' || 
      goalType === 'extremeLoss'
    );
    
    const isGainGoal = goalType && (
      goalType.includes('Gain') || 
      goalType.includes('gain') || 
      goalType === 'mildGain' || 
      goalType === 'weightGain' || 
      goalType === 'extremeGain'
    );
    
    if (isLossGoal) {
      // CUTTING: Higher protein to preserve muscle (2.1g/kg)
      proteinGrams = Math.round(weight * 2.1);
      const proteinCals = proteinGrams * 4;
      
      // Fat: 25% of calories
      const fatCals = Math.round(calories * 0.25);
      fatGrams = Math.round(fatCals / 9);
      
      // Carbs: Remaining
      const carbCals = calories - proteinCals - fatCals;
      carbGrams = Math.round(carbCals / 4);
      
    } else if (isGainGoal) {
      // BULKING: Moderate protein (1.9g/kg)
      proteinGrams = Math.round(weight * 1.9);
      const proteinCals = proteinGrams * 4;
      
      // Fat: 25% of calories
      const fatCals = Math.round(calories * 0.25);
      fatGrams = Math.round(fatCals / 9);
      
      // Carbs: Remaining (high for energy)
      const carbCals = calories - proteinCals - fatCals;
      carbGrams = Math.round(carbCals / 4);
      
    } else {
      // MAINTENANCE (1.8g/kg)
      proteinGrams = Math.round(weight * 1.8);
      const proteinCals = proteinGrams * 4;
      
      // Fat: 25% of calories
      const fatCals = Math.round(calories * 0.25);
      fatGrams = Math.round(fatCals / 9);
      
      // Carbs: Remaining
      const carbCals = calories - proteinCals - fatCals;
      carbGrams = Math.round(carbCals / 4);
    }
    
    return {
      protein: proteinGrams,
      carbs: carbGrams,
      fat: fatGrams
    };
  };

  const totals = calculateTotals();
  
  // Use saved goals or default values
  const dailyGoals = savedGoals ? {
    calories: savedGoals.dailyCalorieGoal || 2000,
    protein: calculateMacrosFromCalories(
      savedGoals.dailyCalorieGoal || 2000, 
      savedGoals.currentWeight || 70,
      savedGoals.goalType || 'maintain'
    ).protein,
    carbs: calculateMacrosFromCalories(
      savedGoals.dailyCalorieGoal || 2000, 
      savedGoals.currentWeight || 70,
      savedGoals.goalType || 'maintain'
    ).carbs,
    fat: calculateMacrosFromCalories(
      savedGoals.dailyCalorieGoal || 2000, 
      savedGoals.currentWeight || 70,
      savedGoals.goalType || 'maintain'
    ).fat
  } : {
    calories: 2000,
    protein: 126, // 70kg * 1.8g/kg (maintenance default)
    carbs: 244,
    fat: 56
  };

  const caloriePercentage = Math.min((totals.calories / dailyGoals.calories) * 100, 100);
  const proteinPercentage = Math.min((totals.protein / dailyGoals.protein) * 100, 100);
  const carbsPercentage = Math.min((totals.carbs / dailyGoals.carbs) * 100, 100);
  const fatPercentage = Math.min((totals.fat / dailyGoals.fat) * 100, 100);

  const remaining = {
    calories: Math.max(0, dailyGoals.calories - totals.calories),
    protein: Math.max(0, dailyGoals.protein - totals.protein),
    carbs: Math.max(0, dailyGoals.carbs - totals.carbs),
    fat: Math.max(0, dailyGoals.fat - totals.fat)
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
                  onClick={() => navigateToPage && navigateToPage('home')}
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

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
              Daily <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Food Log</span>
            </h1>
            <p className="text-xl text-gray-600">{getCurrentDate()}</p>
          </div>

          {/* Setup Prompt Banner */}
          {showSetupPrompt && !savedGoals && (
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-2xl p-6 shadow-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-bold text-blue-900 mb-2">🎯 Set Up Your Daily Goals First!</h3>
                  <p className="text-blue-800 mb-4">
                    To get personalized macro tracking, calculate your daily calorie and macro goals using our Calorie Calculator.
                  </p>
                  <button
                    onClick={() => navigateToPage && navigateToPage('calculate')}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Go to Calorie Calculator
                  </button>
                  <button
                    onClick={() => setShowSetupPrompt(false)}
                    className="ml-3 text-blue-700 hover:text-blue-900 font-medium"
                  >
                    Continue with defaults
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Goals Connected Banner */}
          {savedGoals && (
            <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-6 shadow-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-start flex-1">
                  <div className="flex-shrink-0">
                    <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-bold text-green-900 mb-1">✅ Goals Connected!</h3>
                    <p className="text-sm text-green-700 mb-3">
                      Your macros are calculated based on: <span className="font-bold">{savedGoals.goalType || 'Maintenance'}</span>
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div className="bg-white/50 rounded-lg p-2">
                        <p className="text-green-700 font-medium text-xs">Daily Calories</p>
                        <p className="text-green-900 font-bold text-lg">{dailyGoals.calories}</p>
                      </div>
                      <div className="bg-white/50 rounded-lg p-2">
                        <p className="text-green-700 font-medium text-xs">Protein Goal</p>
                        <p className="text-green-900 font-bold text-lg">{dailyGoals.protein}g</p>
                      </div>
                      <div className="bg-white/50 rounded-lg p-2">
                        <p className="text-green-700 font-medium text-xs">Carbs Goal</p>
                        <p className="text-green-900 font-bold text-lg">{dailyGoals.carbs}g</p>
                      </div>
                      <div className="bg-white/50 rounded-lg p-2">
                        <p className="text-green-700 font-medium text-xs">Fat Goal</p>
                        <p className="text-green-900 font-bold text-lg">{dailyGoals.fat}g</p>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-green-700 bg-green-100 rounded-lg p-2">
                      💡 <strong>Science-Based Macros:</strong> Protein calculated at{' '}
                      {savedGoals.goalType?.includes('Loss') ? '2.1g/kg' : 
                       savedGoals.goalType?.includes('Gain') ? '1.9g/kg' : '1.8g/kg'} for {savedGoals.goalType?.toLowerCase() || 'maintenance'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigateToPage && navigateToPage('calculate')}
                  className="ml-4 text-green-700 hover:text-green-900 font-medium text-sm flex items-center whitespace-nowrap"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Update
                </button>
              </div>
            </div>
          )}

{/* Saved Target from Calculator */}
          {foodItems.some(item => item.isTarget) && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                <span className="text-2xl mr-2">🎯</span>
                Your Daily Target
              </h3>
              <div className="space-y-3">
                {foodItems.filter(item => item.isTarget).map(item => (
                  <TargetCard 
                    key={item.id} 
                    item={item} 
                    onDelete={handleDeleteFood}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Daily Summary Card */}
          <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-2xl p-6 md:p-8 mb-8 border-2 border-orange-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <span className="text-3xl mr-3">📊</span>
                Today's Nutrition Summary
              </h2>
            </div>

            {/* Main Calories Progress */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-semibold text-gray-700">Total Calories</span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-orange-600">
                    {totals.calories}
                  </span>
                  <span className="text-gray-500 mx-1">/</span>
                  <span className="text-xl text-gray-700">{dailyGoals.calories}</span>
                  <span className="block text-sm text-gray-600 mt-1">{remaining.calories} remaining</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 shadow-lg ${
                    caloriePercentage > 100 ? 'bg-gradient-to-r from-red-400 to-red-600' : 'bg-gradient-to-r from-orange-400 to-orange-600'
                  }`}
                  style={{ width: `${Math.min(caloriePercentage, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-sm text-gray-500">{caloriePercentage.toFixed(0)}% of daily goal</p>
                {caloriePercentage > 100 && (
                  <p className="text-sm font-semibold text-red-600">⚠️ {(caloriePercentage - 100).toFixed(0)}% over goal</p>
                )}
              </div>
            </div>

            {/* Macros Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Protein */}
              <div className="bg-white/70 rounded-xl p-4 shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-600">💪 Protein</span>
                  <span className="text-lg font-bold text-blue-600">{totals.protein}g / {dailyGoals.protein}g</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      proteinPercentage > 100 ? 'bg-gradient-to-r from-red-400 to-red-600' : 'bg-gradient-to-r from-blue-400 to-blue-600'
                    }`}
                    style={{ width: `${Math.min(proteinPercentage, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{remaining.protein}g remaining</p>
              </div>

              {/* Carbs */}
              <div className="bg-white/70 rounded-xl p-4 shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-600">🌾 Carbs</span>
                  <span className="text-lg font-bold text-yellow-600">{totals.carbs}g / {dailyGoals.carbs}g</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      carbsPercentage > 100 ? 'bg-gradient-to-r from-red-400 to-red-600' : 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                    }`}
                    style={{ width: `${Math.min(carbsPercentage, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{remaining.carbs}g remaining</p>
              </div>

              {/* Fat */}
              <div className="bg-white/70 rounded-xl p-4 shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-600">🥑 Fat</span>
                  <span className="text-lg font-bold text-green-600">{totals.fat}g / {dailyGoals.fat}g</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      fatPercentage > 100 ? 'bg-gradient-to-r from-red-400 to-red-600' : 'bg-gradient-to-r from-green-400 to-green-600'
                    }`}
                    style={{ width: `${Math.min(fatPercentage, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{remaining.fat}g remaining</p>
              </div>
            </div>
          </div>

          {/* Meal Sections */}
          <div className="space-y-6">
            <MealSection 
              title="Breakfast"
              icon="🌅"
              mealType="breakfast"
              items={getMealItems('breakfast')}
              onAddClick={handleAddClick}
              onDelete={handleDeleteFood}
            />

            <MealSection 
              title="Lunch"
              icon="🌞"
              mealType="lunch"
              items={getMealItems('lunch')}
              onAddClick={handleAddClick}
              onDelete={handleDeleteFood}
            />

            <MealSection 
              title="Dinner"
              icon="🌙"
              mealType="dinner"
              items={getMealItems('dinner')}
              onAddClick={handleAddClick}
              onDelete={handleDeleteFood}
            />

            <MealSection 
              title="Snacks"
              icon="🍪"
              mealType="snacks"
              items={getMealItems('snacks')}
              onAddClick={handleAddClick}
              onDelete={handleDeleteFood}
            />
          </div>

          {/* Tips Section */}
          <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-blue-200">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💡</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Pro Tips</h3>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    <span>Log your meals immediately after eating for better accuracy</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    <span>Your daily goals are automatically synced from your Calorie Calculator setup</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    <span>Use our AI Photo Analysis to quickly log meals by taking a picture</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    <span>Your food log resets daily - check back tomorrow for a fresh start!</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigateToPage && navigateToPage('food')}
              className="flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Photo Analysis</span>
            </button>

            <button
              onClick={() => {
                const confirmed = window.confirm('Are you sure you want to clear today\'s food log?');
                if (confirmed) {
                  setFoodItems([]);
                }
              }}
              className="flex items-center justify-center space-x-3 bg-white hover:bg-gray-50 text-gray-700 px-6 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl border-2 border-gray-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Clear Log</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center justify-center space-x-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Print Log</span>
            </button>
          </div>
        </div>
      </div>

      <AddFoodModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddFood}
        mealType={currentMealType}
      />
    </>
  );
};

export default FoodLog;