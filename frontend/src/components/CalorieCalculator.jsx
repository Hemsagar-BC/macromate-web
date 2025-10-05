// components/CalorieCalculator.jsx
import React, { useState } from 'react';

const CalorieCalculator = ({ onBack }) => {
  const [formData, setFormData] = useState({
    age: '',
    height: '',
    weight: '',
    gender: 'male',
    activityLevel: 'sedentary'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const activityLevels = {
    sedentary: { 
      multiplier: 1.2, 
      label: 'Sedentary', 
      description: 'Little to no exercise'
    },
    lightly_active: { 
      multiplier: 1.375, 
      label: 'Lightly Active', 
      description: 'Light exercise 1-3 days/week'
    },
    moderately_active: { 
      multiplier: 1.55, 
      label: 'Moderately Active', 
      description: 'Moderate exercise 3-5 days/week'
    },
    very_active: { 
      multiplier: 1.725, 
      label: 'Very Active', 
      description: 'Hard exercise 6-7 days/week'
    },
    extremely_active: { 
      multiplier: 1.9, 
      label: 'Extremely Active', 
      description: 'Very hard exercise, physical job'
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateCalories = () => {
    if (!formData.age || !formData.height || !formData.weight) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      const age = parseInt(formData.age);
      const height = parseFloat(formData.height);
      const weight = parseFloat(formData.weight);
      const gender = formData.gender;
      const activityMultiplier = activityLevels[formData.activityLevel].multiplier;

      let bmr;
      if (gender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
      } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
      }

      const tdee = bmr * activityMultiplier;
      
      const maintainCalories = Math.round(tdee);
      const mildWeightLoss = Math.round(tdee - 250);
      const weightLoss = Math.round(tdee - 500);
      const extremeWeightLoss = Math.round(tdee - 750);
      const weightGain = Math.round(tdee + 300);
      const fastWeightGain = Math.round(tdee + 500);

      const heightM = height / 100;
      const bmi = weight / (heightM * heightM);
      
      let recommendation, recommendationColor;
      if (bmi < 18.5) {
        recommendation = "You probably need to gain weight! Focus on nutrient-dense, calorie-rich foods and consider strength training.";
        recommendationColor = "text-blue-600 bg-blue-50 border-blue-200";
      } else if (bmi >= 18.5 && bmi < 25) {
        recommendation = "Your weight appears to be in a healthy range. Focus on maintaining your current weight with balanced nutrition and regular exercise.";
        recommendationColor = "text-green-600 bg-green-50 border-green-200";
      } else {
        recommendation = "You probably need to lose weight. Consider creating a moderate calorie deficit combined with regular physical activity.";
        recommendationColor = "text-orange-600 bg-orange-50 border-orange-200";
      }

      const proteinCals = Math.round(maintainCalories * 0.25);
      const carbCals = Math.round(maintainCalories * 0.45);
      const fatCals = Math.round(maintainCalories * 0.30);

      const proteinGrams = Math.round(proteinCals / 4);
      const carbGrams = Math.round(carbCals / 4);
      const fatGrams = Math.round(fatCals / 9);

      setResult({
        bmr: Math.round(bmr),
        tdee: maintainCalories,
        activityLevel: activityLevels[formData.activityLevel].label,
        goals: {
          maintain: maintainCalories,
          mildLoss: mildWeightLoss,
          weightLoss: weightLoss,
          extremeLoss: extremeWeightLoss,
          weightGain: weightGain,
          fastGain: fastWeightGain
        },
        recommendation,
        recommendationColor,
        macros: {
          protein: { grams: proteinGrams, calories: proteinCals, percentage: 25 },
          carbs: { grams: carbGrams, calories: carbCals, percentage: 45 },
          fat: { grams: fatGrams, calories: fatCals, percentage: 30 }
        },
        userInfo: {
          age,
          height,
          weight,
          gender,
          bmi: bmi.toFixed(1)
        }
      });
      
      setLoading(false);
    }, 1000);
  };

  const resetCalculator = () => {
    setFormData({
      age: '',
      height: '',
      weight: '',
      gender: 'male',
      activityLevel: 'sedentary'
    });
    setResult(null);
  };

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-orange-600 transition-colors duration-200"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Calculators
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Calorie Results</h1>
          </div>

          <div className={`mb-8 p-6 rounded-2xl border-2 ${result.recommendationColor}`}>
            <h2 className="text-xl font-bold mb-2">Health Recommendation</h2>
            <p className="text-lg">{result.recommendation}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="text-center">
                <div className="text-4xl mb-4">🔥</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Basal Metabolic Rate</h3>
                <div className="text-3xl font-bold text-orange-600 mb-2">{result.bmr}</div>
                <div className="text-sm text-gray-600">calories/day at rest</div>
                <div className="mt-4 text-xs text-gray-500">
                  Calories your body burns just to stay alive
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Daily Energy</h3>
                <div className="text-3xl font-bold text-orange-600 mb-2">{result.tdee}</div>
                <div className="text-sm text-gray-600">calories/day total</div>
                <div className="mt-4 text-xs text-gray-500">
                  With {result.activityLevel} lifestyle
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="text-center">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Your BMI</h3>
                <div className="text-3xl font-bold text-orange-600 mb-2">{result.userInfo.bmi}</div>
                <div className="text-sm text-gray-600">Body Mass Index</div>
                <div className="mt-4 text-xs text-gray-500">
                  {result.userInfo.weight}kg, {result.userInfo.height}cm
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Daily Calorie Goals</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-green-50 rounded-xl border-2 border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Maintain Weight</h4>
                <div className="text-2xl font-bold text-green-600 mb-1">{result.goals.maintain}</div>
                <div className="text-sm text-green-600">calories/day</div>
                <div className="text-xs text-gray-500 mt-2">100%</div>
              </div>
              
              <div className="text-center p-6 bg-yellow-50 rounded-xl border-2 border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2">Mild Weight Loss</h4>
                <div className="text-2xl font-bold text-yellow-600 mb-1">{result.goals.mildLoss}</div>
                <div className="text-sm text-yellow-600">calories/day</div>
                <div className="text-xs text-gray-500 mt-2">0.25 kg/week</div>
              </div>
              
              <div className="text-center p-6 bg-orange-50 rounded-xl border-2 border-orange-200">
                <h4 className="font-semibold text-orange-800 mb-2">Weight Loss</h4>
                <div className="text-2xl font-bold text-orange-600 mb-1">{result.goals.weightLoss}</div>
                <div className="text-sm text-orange-600">calories/day</div>
                <div className="text-xs text-gray-500 mt-2">0.5 kg/week</div>
              </div>
              
              <div className="text-center p-6 bg-red-50 rounded-xl border-2 border-red-200">
                <h4 className="font-semibold text-red-800 mb-2">Extreme Weight Loss</h4>
                <div className="text-2xl font-bold text-red-600 mb-1">{result.goals.extremeLoss}</div>
                <div className="text-sm text-red-600">calories/day</div>
                <div className="text-xs text-gray-500 mt-2">0.75 kg/week</div>
              </div>
              
              <div className="text-center p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Weight Gain</h4>
                <div className="text-2xl font-bold text-blue-600 mb-1">{result.goals.weightGain}</div>
                <div className="text-sm text-blue-600">calories/day</div>
                <div className="text-xs text-gray-500 mt-2">Lean muscle gain</div>
              </div>
              
              <div className="text-center p-6 bg-purple-50 rounded-xl border-2 border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">Fast Weight Gain</h4>
                <div className="text-2xl font-bold text-purple-600 mb-1">{result.goals.fastGain}</div>
                <div className="text-sm text-purple-600">calories/day</div>
                <div className="text-xs text-gray-500 mt-2">Rapid weight gain</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Recommended Macros (for {result.goals.maintain} calories)
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
                <div className="text-3xl mb-3">🥩</div>
                <h4 className="font-semibold text-red-800 mb-2">Protein</h4>
                <div className="text-2xl font-bold text-red-600 mb-1">{result.macros.protein.grams}g</div>
                <div className="text-sm text-red-600 mb-2">{result.macros.protein.calories} calories</div>
                <div className="text-xs text-gray-600">{result.macros.protein.percentage}% of total</div>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
                <div className="text-3xl mb-3">🍞</div>
                <h4 className="font-semibold text-yellow-800 mb-2">Carbohydrates</h4>
                <div className="text-2xl font-bold text-yellow-600 mb-1">{result.macros.carbs.grams}g</div>
                <div className="text-sm text-yellow-600 mb-2">{result.macros.carbs.calories} calories</div>
                <div className="text-xs text-gray-600">{result.macros.carbs.percentage}% of total</div>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <div className="text-3xl mb-3">🥑</div>
                <h4 className="font-semibold text-green-800 mb-2">Fats</h4>
                <div className="text-2xl font-bold text-green-600 mb-1">{result.macros.fat.grams}g</div>
                <div className="text-sm text-green-600 mb-2">{result.macros.fat.calories} calories</div>
                <div className="text-xs text-gray-600">{result.macros.fat.percentage}% of total</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Calculation Method</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Mifflin-St Jeor Equation (BMR):</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div><strong>Men:</strong> BMR = (10 × weight) + (6.25 × height) - (5 × age) + 5</div>
                  <div><strong>Women:</strong> BMR = (10 × weight) + (6.25 × height) - (5 × age) - 161</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Total Daily Energy Expenditure:</h4>
                <div className="text-sm text-gray-600">
                  <div><strong>TDEE = BMR × Activity Factor</strong></div>
                  <div className="mt-2">Your calculation: {result.bmr} × {activityLevels[formData.activityLevel].multiplier} = {result.tdee} calories</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={resetCalculator}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Calculate Again
            </button>
            <button
              onClick={() => window.print()}
              className="px-8 py-3 bg-white text-orange-600 font-semibold rounded-xl border-2 border-orange-500 hover:bg-orange-50 transition-all duration-300 shadow-lg"
            >
              Print Results
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 pt-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-orange-600 transition-colors duration-200"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Calculators
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Calorie Calculator</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🔥</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Calculate Your Daily Calories</h2>
            <p className="text-gray-600">Get personalized calorie goals based on your lifestyle and goals</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age (years)</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="e.g., 25"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Gender</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={handleInputChange}
                    className="text-orange-600 focus:ring-orange-500"
                  />
                  <span className="ml-2">Male</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={handleInputChange}
                    className="text-orange-600 focus:ring-orange-500"
                  />
                  <span className="ml-2">Female</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                placeholder="e.g., 170"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="e.g., 65"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Activity Level</label>
              <div className="space-y-3">
                {Object.entries(activityLevels).map(([key, level]) => (
                  <label key={key} className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="activityLevel"
                      value={key}
                      checked={formData.activityLevel === key}
                      onChange={handleInputChange}
                      className="text-orange-600 focus:ring-orange-500 mt-1"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-800">{level.label}</div>
                      <div className="text-sm text-gray-600">{level.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={calculateCalories}
            disabled={loading}
            className="w-full mt-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Calculating...
              </div>
            ) : (
              'Calculate Calories'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalorieCalculator;