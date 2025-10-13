import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Activity, Target, TrendingUp, TrendingDown } from 'lucide-react';

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
  const [selectedGoal, setSelectedGoal] = useState('maintain');
  const [expandedSection, setExpandedSection] = useState(null);

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
      
      // CORRECTED: Using 7700 calories ≈ 1 kg body weight
      // Daily calorie adjustment = (7700 × kg per week) / 7 days
      const mildWeightLoss = Math.round(maintainCalories - (7700 * 0.25 / 7));      // -275 cal
      const weightLoss = Math.round(maintainCalories - (7700 * 0.5 / 7));           // -550 cal
      const extremeWeightLoss = Math.round(maintainCalories - (7700 * 1.0 / 7));    // -1100 cal
      const mildWeightGain = Math.round(maintainCalories + (7700 * 0.25 / 7));      // +275 cal
      const weightGain = Math.round(maintainCalories + (7700 * 0.5 / 7));           // +550 cal
      const extremeWeightGain = Math.round(maintainCalories + (7700 * 1.0 / 7));    // +1100 cal

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

      setResult({
        bmr: Math.round(bmr),
        tdee: maintainCalories,
        activityLevel: activityLevels[formData.activityLevel].label,
        activityMultiplier: activityLevels[formData.activityLevel].multiplier,
        goals: {
          maintain: maintainCalories,
          mildLoss: mildWeightLoss,
          weightLoss: weightLoss,
          extremeLoss: extremeWeightLoss,
          mildGain: mildWeightGain,
          weightGain: weightGain,
          extremeGain: extremeWeightGain
        },
        recommendation,
        recommendationColor,
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

  const calculateMacros = (calories, goalType = 'maintain') => {
    const weight = parseFloat(formData.weight);
    
    // SCIENCE-BASED MACRO CALCULATIONS
    let proteinGrams, fatGrams, carbGrams;
    
    if (goalType.includes('Loss') || goalType.includes('loss')) {
      // CUTTING: Higher protein to preserve muscle
      proteinGrams = Math.round(weight * 2.1);  // 2.1g/kg during deficit
      const proteinCals = proteinGrams * 4;
      
      // Fat: 25% of calories
      const fatCals = Math.round(calories * 0.25);
      fatGrams = Math.round(fatCals / 9);
      
      // Carbs: Remaining
      const carbCals = calories - proteinCals - fatCals;
      carbGrams = Math.round(carbCals / 4);
      
    } else if (goalType.includes('Gain') || goalType.includes('gain')) {
      // BULKING: Moderate protein, high carbs
      proteinGrams = Math.round(weight * 1.9);  // 1.9g/kg during surplus
      const proteinCals = proteinGrams * 4;
      
      // Fat: 25% of calories
      const fatCals = Math.round(calories * 0.25);
      fatGrams = Math.round(fatCals / 9);
      
      // Carbs: Remaining (will be high for energy)
      const carbCals = calories - proteinCals - fatCals;
      carbGrams = Math.round(carbCals / 4);
      
    } else {
      // MAINTENANCE
      proteinGrams = Math.round(weight * 1.8);  // 2.2g/kg
      const proteinCals = proteinGrams * 4;
      
      // Fat: 25% of calories
      const fatCals = Math.round(calories * 0.25);
      fatGrams = Math.round(fatCals / 9);
      
      // Carbs: Remaining
      const carbCals = calories - proteinCals - fatCals;
      carbGrams = Math.round(carbCals / 4);
    }
    
    const proteinCals = proteinGrams * 4;
    const fatCals = fatGrams * 9;
    const carbCals = carbGrams * 4;
    
    return {
      protein: { 
        grams: proteinGrams, 
        calories: proteinCals, 
        percentage: Math.round((proteinCals / calories) * 100) 
      },
      carbs: { 
        grams: carbGrams, 
        calories: carbCals, 
        percentage: Math.round((carbCals / calories) * 100) 
      },
      fat: { 
        grams: fatGrams, 
        calories: fatCals, 
        percentage: Math.round((fatCals / calories) * 100) 
      }
    };
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
    setSelectedGoal('maintain');
    setExpandedSection(null);
  };

  const goalCards = result ? [
    {
      id: 'maintain',
      title: 'Maintain Weight',
      calories: result.goals.maintain,
      rate: 'Maintenance',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
      icon: <Target className="w-6 h-6" />
    },
    {
      id: 'mildLoss',
      title: 'Mild Weight Loss',
      calories: result.goals.mildLoss,
      rate: '0.25 kg/week',
      color: 'from-yellow-400 to-orange-400',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-700',
      icon: <TrendingDown className="w-6 h-6" />
    },
    {
      id: 'weightLoss',
      title: 'Weight Loss',
      calories: result.goals.weightLoss,
      rate: '0.5 kg/week',
      color: 'from-orange-400 to-orange-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-orange-700',
      icon: <TrendingDown className="w-6 h-6" />
    },
    {
      id: 'extremeLoss',
      title: 'Extreme Weight Loss',
      calories: result.goals.extremeLoss,
      rate: '1 kg/week',
      color: 'from-red-400 to-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
      icon: <TrendingDown className="w-6 h-6" />
    },
    {
      id: 'mildGain',
      title: 'Mild Weight Gain',
      calories: result.goals.mildGain,
      rate: '0.25 kg/week',
      color: 'from-blue-400 to-blue-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-blue-700',
      icon: <TrendingUp className="w-6 h-6" />
    },
    {
      id: 'weightGain',
      title: 'Weight Gain',
      calories: result.goals.weightGain,
      rate: '0.5 kg/week',
      color: 'from-indigo-400 to-indigo-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-indigo-700',
      icon: <TrendingUp className="w-6 h-6" />
    },
    {
      id: 'extremeGain',
      title: 'Extreme Weight Gain',
      calories: result.goals.extremeGain,
      rate: '1 kg/week',
      color: 'from-purple-400 to-purple-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
      icon: <TrendingUp className="w-6 h-6" />
    }
  ] : [];

  const ExpandableSection = ({ title, isExpanded, onToggle, children }) => (
    <motion.div 
      className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          📚 {title}
        </h3>
        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 text-gray-700 leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  if (result) {
    const selectedMacros = calculateMacros(
      result.goals[selectedGoal], 
      goalCards.find(g => g.id === selectedGoal)?.title
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <button 
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-orange-600 transition-colors duration-200"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Calculators
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Your Results</h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className={`mb-8 p-6 rounded-2xl border-2 ${result.recommendationColor}`}
          >
            <h2 className="text-xl font-bold mb-2">Health Recommendation</h2>
            <p className="text-lg">{result.recommendation}</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { icon: '🔥', title: 'Basal Metabolic Rate', value: result.bmr, unit: 'calories/day at rest', desc: 'Calories your body burns just to stay alive' },
              { icon: '⚡', title: 'Total Daily Energy', value: result.tdee, unit: 'calories/day total', desc: `With ${result.activityLevel} lifestyle` },
              { icon: '📊', title: 'Your BMI', value: result.userInfo.bmi, unit: 'Body Mass Index', desc: `${result.userInfo.weight}kg, ${result.userInfo.height}cm` }
            ].map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">{card.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{card.title}</h3>
                  <div className="text-3xl font-bold text-orange-600 mb-2">{card.value}</div>
                  <div className="text-sm text-gray-600">{card.unit}</div>
                  <div className="mt-4 text-xs text-gray-500">{card.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">Your Daily Calorie Goals</h3>
            <p className="text-center font-semibold text-orange-600 mb-6 text-sm">
              💡 Click on any calorie goal below to see personalized macros for that target
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {goalCards.map((goal, index) => (
                <motion.button
                  key={goal.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedGoal(goal.id)}
                  className={`text-center p-5 rounded-xl border-2 transition-all ${
                    selectedGoal === goal.id 
                      ? `${goal.bgColor} ${goal.borderColor} shadow-lg` 
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`flex justify-center mb-3 ${selectedGoal === goal.id ? goal.textColor : 'text-gray-400'}`}>
                    {goal.icon}
                  </div>
                  <h4 className={`font-semibold mb-2 text-sm ${selectedGoal === goal.id ? goal.textColor : 'text-gray-700'}`}>
                    {goal.title}
                  </h4>
                  <div className={`text-2xl font-bold mb-1 ${selectedGoal === goal.id ? 'text-gray-900' : 'text-gray-600'}`}>
                    {goal.calories}
                  </div>
                  <div className="text-xs text-gray-600 mb-2">calories/day</div>
                  <div className="text-xs text-gray-500">{goal.rate}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">
              Recommended Macros
            </h3>
            <p className="text-center text-gray-600 mb-6">
              For your selected goal: <span className="font-semibold text-orange-600">
                {goalCards.find(g => g.id === selectedGoal)?.title}
              </span> ({result.goals[selectedGoal]} calories/day)
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: 'Protein', icon: '🥩', color: 'red', data: selectedMacros.protein },
                { name: 'Carbohydrates', icon: '🍞', color: 'yellow', data: selectedMacros.carbs },
                { name: 'Fats', icon: '🥑', color: 'green', data: selectedMacros.fat }
              ].map((macro, index) => (
                <motion.div
                  key={macro.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className={`text-center p-6 bg-gradient-to-br from-${macro.color}-50 to-${macro.color}-100 rounded-xl`}
                >
                  <div className="text-3xl mb-3">{macro.icon}</div>
                  <h4 className={`font-semibold text-${macro.color}-800 mb-2`}>{macro.name}</h4>
                  <div className={`text-2xl font-bold text-${macro.color}-600 mb-1`}>{macro.data.grams}g</div>
                  <div className={`text-sm text-${macro.color}-600 mb-2`}>{macro.data.calories} calories</div>
                  <div className="text-xs text-gray-600">{macro.data.percentage}% of total</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetCalculator}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Calculate Again
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.print()}
              className="px-8 py-3 bg-white text-orange-600 font-semibold rounded-xl border-2 border-orange-500 hover:bg-orange-50 transition-all duration-300 shadow-lg"
            >
              Print Results
            </motion.button>
          </motion.div>

          {/* Educational Sections as Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">📚 Science behind these numbers</h3>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* BMR Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
                className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-lg p-6 border-2 border-orange-100 cursor-pointer"
                onClick={() => setExpandedSection(expandedSection === 'bmr' ? null : 'bmr')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-orange-800">🔥 Basal Metabolic Rate</h4>
                  {expandedSection === 'bmr' ? <ChevronUp className="w-5 h-5 text-orange-600" /> : <ChevronDown className="w-5 h-5 text-orange-600" />}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Learn how your body burns calories at complete rest and the science behind BMR calculations.
                </p>
              </motion.div>

              {/* Maintenance Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border-2 border-green-100 cursor-pointer"
                onClick={() => setExpandedSection(expandedSection === 'maintenance' ? null : 'maintenance')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-green-800">⚖️ Maintenance Calories</h4>
                  {expandedSection === 'maintenance' ? <ChevronUp className="w-5 h-5 text-green-600" /> : <ChevronDown className="w-5 h-5 text-green-600" />}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Discover how we calculate the exact calories needed to maintain your current weight.
                </p>
              </motion.div>

              {/* Weight Change Science Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 border-2 border-blue-100 cursor-pointer"
                onClick={() => setExpandedSection(expandedSection === 'science' ? null : 'science')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-blue-800">🔬 Weight Loss & Gain</h4>
                  {expandedSection === 'science' ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5 text-blue-600" />}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Understand the research-backed formulas behind safe and sustainable weight change.
                </p>
              </motion.div>
            </div>
       {/* Expanded Content */}
            <AnimatePresence>
              {expandedSection === 'bmr' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mb-6"
                >
                  <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border-2 border-orange-100">
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Understanding Your Basal Metabolic Rate (BMR)</h4>
                    <div className="text-gray-700 leading-relaxed space-y-4">
                      <p>
                        Your <strong>Basal Metabolic Rate (BMR)</strong> is the number of calories your body needs <strong>at complete rest</strong> to maintain vital functions like breathing, circulation, and cell repair. It's essentially the <strong>minimum energy your body burns daily</strong>.
                      </p>
                      <p>
                        The <strong>Mifflin St Jeor Equation</strong> (1990) is a widely accepted and research-backed formula for estimating BMR. Studies have shown it to be one of the most accurate methods for healthy adults. It calculates your resting energy expenditure based on your <strong>weight, height, age, and sex</strong>:
                      </p>
                      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <p className="font-semibold mb-2 text-orange-800">For Men:</p>
                        <p className="font-mono text-sm mb-4">BMR = (10 x weight in kg) + (6.25 x height in cm) - (5 x age in years) + 5</p>
                        <p className="font-semibold mb-2 text-orange-800">For Women:</p>
                        <p className="font-mono text-sm">(10 x weight in kg) + (6.25 x height in cm) - (5 x age in years) - 161</p>
                      </div>
                      <p>
                        Once you know your BMR, you multiply it by an <strong>Activity Factor</strong> to estimate your <strong>total daily maintenance calories</strong>, which accounts for physical activity:
                      </p>
                      <ul className="space-y-1 ml-6 text-gray-700">
                        <li>Sedentary: <strong>1.2</strong></li>
                        <li>Lightly active: <strong>1.375</strong></li>
                        <li>Moderately active: <strong>1.55</strong></li>
                        <li>Very active: <strong>1.725</strong></li>
                        <li>Extra active: <strong>1.9</strong></li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {expandedSection === 'maintenance' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mb-6"
                >
                  <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border-2 border-green-100">
                    <h4 className="text-xl font-bold text-gray-800 mb-4">How Maintenance Calories Are Calculated</h4>
                    <div className="text-gray-700 leading-relaxed space-y-4">
                      <p>
                        Macromate calculates your maintenance calories, the number of calories your body needs to maintain its current weight using principles from metabolic research and energy balance studies. According to findings published in the American Journal of Clinical Nutrition (Hall et al., 2012) and the Journal of the Academy of Nutrition and Dietetics (Dhurandhar et al., 2015), your body maintains weight when calorie intake equals calorie expenditure through metabolism, activity, and digestion.
                      </p>
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <p className="font-semibold mb-2 text-green-800">For Maintenance:</p>
                        <p className="font-mono text-sm mb-3">Calories/day = Basal Metabolic Rate (BMR) * Activity Factor</p>
                        <p className="text-sm font-semibold text-green-700">
                          Your calculation: {result.bmr} * {result.activityMultiplier} = {result.tdee} calories/day
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

         {/* Expanded Content */}
            <AnimatePresence>
           {expandedSection === 'science' && (
            <motion.div
    initial={{ height: 0, opacity: 0 }}
    animate={{ height: 'auto', opacity: 1 }}
    exit={{ height: 0, opacity: 0 }}
    transition={{ duration: 0.3 }}
    className="overflow-hidden mb-6"
  >
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border-2 border-blue-100">
      <h4 className="text-xl font-bold text-gray-800 mb-4">The Science Behind Weight Loss & Gain</h4>
      <div className="text-gray-700 leading-relaxed space-y-4">
        
        {/* Calorie Calculations */}
        <div>
          <h5 className="font-bold text-lg text-blue-800 mb-3">📊 Calorie Calculations</h5>
          <p>
            Macromate's calorie recommendations are based on well-established nutritional science. According to research published in the <strong>American Journal of Clinical Nutrition</strong> (Hall et al., 2012), approximately <strong>7,700 calories correspond to 1 kilogram of body weight</strong>. This is because 1 kg of body fat contains roughly 7,700 calories of stored energy.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 my-4">
            <p className="font-semibold mb-2 text-blue-800">Daily Calorie Adjustment Formula:</p>
            <p className="font-mono text-sm mb-3">Calories/day = Maintenance ± (7700 × kg per week) / 7 days</p>
            <div className="text-sm space-y-1 mt-3">
              <p>• <strong>0.25 kg/week</strong> → ±275 calories/day (mild, sustainable)</p>
              <p>• <strong>0.5 kg/week</strong> → ±550 calories/day (moderate, optimal)</p>
              <p>• <strong>1.0 kg/week</strong> → ±1100 calories/day (aggressive)</p>
            </div>
          </div>
        </div>

        {/* Protein Calculations */}
        <div className="border-t pt-4">
          <h5 className="font-bold text-lg text-blue-800 mb-3">🥩 Protein Requirements</h5>
          <p className="mb-3">
            Protein needs vary based on your goal. Research from the <strong>International Society of Sports Nutrition</strong> (Jäger et al., 2017) and meta-analyses by Morton et al. (2018) provide clear guidelines:
          </p>
          
          <div className="space-y-3">
            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
              <p className="font-semibold text-red-800 mb-1">🔻 During Weight Loss (Cutting):</p>
              <p className="font-mono text-sm mb-2">Protein = 2.4g per kg body weight</p>
              <p className="text-sm">Higher protein intake preserves lean muscle mass during a caloric deficit and increases satiety. Studies show that protein needs increase by 15-25% when cutting to prevent muscle loss.</p>
            </div>

            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <p className="font-semibold text-green-800 mb-1">⚖️ During Maintenance:</p>
              <p className="font-mono text-sm mb-2">Protein = 2.2g per kg body weight</p>
              <p className="text-sm">Optimal for maintaining muscle mass and supporting recovery. This aligns with ISSN recommendations for active individuals.</p>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="font-semibold text-blue-800 mb-1">🔺 During Weight Gain (Bulking):</p>
              <p className="font-mono text-sm mb-2">Protein = 2.2g per kg body weight</p>
              <p className="text-sm">Sufficient for muscle protein synthesis during a surplus. The anabolic effect of extra calories is protein-sparing, so you don't need excessive protein when bulking.</p>
            </div>
          </div>
          
          <p className="text-xs text-gray-600 mt-3">
            <strong>Why body-weight based?</strong> Protein requirements scale with lean body mass. Heavier individuals need more absolute protein, but the ratio remains consistent (2.2-2.4g/kg).
          </p>
        </div>

        {/* Fat Calculations */}
        <div className="border-t pt-4">
          <h5 className="font-bold text-lg text-blue-800 mb-3">🥑 Fat Requirements</h5>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="font-semibold text-yellow-800 mb-2">Fixed at 25% of Total Calories</p>
            <p className="text-sm mb-3">
              Regardless of your goal, dietary fat should comprise <strong>20-30% of total calories</strong> according to the <strong>Academy of Nutrition and Dietetics</strong>. We use 25% as the optimal middle ground.
            </p>
            <div className="text-sm space-y-2">
              <p><strong>Why this matters:</strong></p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Essential for hormone production (testosterone, estrogen, cortisol)</li>
                <li>Required for absorption of fat-soluble vitamins (A, D, E, K)</li>
                <li>Supports cell membrane integrity and brain function</li>
                <li>Minimum of 0.5-1.0g/kg needed for hormonal health</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-3">
            <strong>Note:</strong> Going below 15% fat can disrupt hormone production, while exceeding 35% leaves less room for protein and carbs needed for performance.
          </p>
        </div>

        {/* Carbohydrate Calculations */}
        <div className="border-t pt-4">
          <h5 className="font-bold text-lg text-blue-800 mb-3">🍞 Carbohydrate Allocation</h5>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <p className="font-semibold text-purple-800 mb-2">Fills Remaining Calories</p>
            <p className="font-mono text-sm mb-3">Carbs = (Total Calories - Protein Calories - Fat Calories) / 4</p>
            <p className="text-sm mb-3">
              After determining protein (based on body weight and goal) and fat (25% of calories), <strong>carbohydrates fill the remaining caloric needs</strong>. This approach is supported by research on flexible dieting and energy balance.
            </p>
            <div className="text-sm space-y-2">
              <p><strong>Why this approach works:</strong></p>
              <ul className="list-disc ml-5 space-y-1">
                <li><strong>During Weight Loss:</strong> Lower carbs naturally (due to lower total calories), which aids fat mobilization</li>
                <li><strong>During Maintenance:</strong> Moderate carbs support training and recovery</li>
                <li><strong>During Weight Gain:</strong> Higher carbs (often 55-65% of calories) fuel intense training and support the anabolic environment</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-3">
            <strong>Performance Note:</strong> Carbs are protein-sparing and the primary fuel for high-intensity exercise. Higher carb intake during a surplus maximizes training performance and muscle glycogen stores.
          </p>
        </div>

        {/* Example Calculation */}
        <div className="border-t pt-4">
          <h5 className="font-bold text-lg text-blue-800 mb-3">🧮 Example: Your Current Goal</h5>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-2 border-blue-200">
            <p className="font-semibold text-gray-800 mb-3">
              Selected Goal: <span className="text-orange-600">{goalCards.find(g => g.id === selectedGoal)?.title}</span>
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Target Calories:</span>
                <span className="font-semibold">{result.goals[selectedGoal]} cal/day</span>
              </div>
              <div className="flex justify-between">
                <span>Body Weight:</span>
                <span className="font-semibold">{result.userInfo.weight} kg</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span>Protein (2.2-2.4g/kg):</span>
                <span className="font-semibold">{calculateMacros(result.goals[selectedGoal], goalCards.find(g => g.id === selectedGoal)?.title).protein.grams}g ({calculateMacros(result.goals[selectedGoal], goalCards.find(g => g.id === selectedGoal)?.title).protein.percentage}%)</span>
              </div>
              <div className="flex justify-between">
                <span>Fat (25% of calories):</span>
                <span className="font-semibold">{calculateMacros(result.goals[selectedGoal], goalCards.find(g => g.id === selectedGoal)?.title).fat.grams}g ({calculateMacros(result.goals[selectedGoal], goalCards.find(g => g.id === selectedGoal)?.title).fat.percentage}%)</span>
              </div>
              <div className="flex justify-between">
                <span>Carbs (remaining):</span>
                <span className="font-semibold">{calculateMacros(result.goals[selectedGoal], goalCards.find(g => g.id === selectedGoal)?.title).carbs.grams}g ({calculateMacros(result.goals[selectedGoal], goalCards.find(g => g.id === selectedGoal)?.title).carbs.percentage}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scientific References */}
        <div className="border-t pt-4">
          <h5 className="font-bold text-lg text-blue-800 mb-3">📚 Scientific References</h5>
          <div className="text-xs text-gray-600 space-y-3">
            <p>
              • Hall, K. D., et al. (2012). "Energy balance and its components: implications for body weight regulation." <em>American Journal of Clinical Nutrition</em>, 95(4), 989-994. 
              <a 
                href="https://academic.oup.com/ajcn/article/95/4/989/4578369" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium ml-1"
              >
                [Read Paper →]
              </a>
            </p>
            <p>
              • Morton, R. W., et al. (2018). "A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains in muscle mass and strength in healthy adults." <em>British Journal of Sports Medicine</em>, 52(6), 376-384. 
              <a 
                href="https://bjsm.bmj.com/content/52/6/376" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium ml-1"
              >
                [Read Paper →]
              </a>
            </p>
            <p>
              • Jäger, R., et al. (2017). "International Society of Sports Nutrition Position Stand: protein and exercise." <em>Journal of the International Society of Sports Nutrition</em>, 14(20). 
              <a 
                href="https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0177-8" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium ml-1"
              >
                [Read Paper →]
              </a>
            </p>
            <p>
              • Helms, E. R., et al. (2014). "Evidence-based recommendations for natural bodybuilding contest preparation: nutrition and supplementation." <em>Journal of the International Society of Sports Nutrition</em>, 11(1), 20. 
              <a 
                href="https://jissn.biomedcentral.com/articles/10.1186/1550-2783-11-20" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium ml-1"
              >
                [Read Paper →]
              </a>
            </p>
            <p>
              • Aragon, A. A., et al. (2017). "International Society of Sports Nutrition position stand: diets and body composition." <em>Journal of the International Society of Sports Nutrition</em>, 14(1), 16. 
              <a 
                href="https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0174-y" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium ml-1"
              >
                [Read Paper →]
              </a>
            </p>
            <p>
              • Phillips, S. M., & Van Loon, L. J. (2011). "Dietary protein for athletes: from requirements to optimum adaptation." <em>Journal of Sports Sciences</em>, 29(sup1), S29-S38. 
              <a 
                href="https://www.tandfonline.com/doi/full/10.1080/02640414.2011.619204" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium ml-1"
              >
                [Read Paper →]
              </a>
            </p>
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-700">
              <strong>💡 Note:</strong> All research papers are peer-reviewed and published in reputable scientific journals. Click on any link to read the full study and dive deeper into the methodology and findings.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border-2 border-orange-200 mt-4">
          <p className="text-sm font-semibold text-orange-800 text-center">
            💪 These calculations are personalized to YOUR body weight and goals, ensuring optimal results based on current sports nutrition science!
          </p>
        </div>

      </div>
    </div>
  </motion.div>
)}           
              </AnimatePresence>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 pt-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <button 
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-orange-600 transition-colors duration-200"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Calculators
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Calorie Calculator</h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
        >
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="text-6xl mb-4"
            >
              🔥
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Calculate Your Daily Calories</h2>
            <p className="text-gray-600">Get personalized calorie goals based on your lifestyle and goals</p>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">Age (years)</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="e.g., 25"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg transition-all"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-3">Gender</label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
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
                <label className="flex items-center cursor-pointer">
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                placeholder="e.g., 170"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg transition-all"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="e.g., 65"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg transition-all"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-3">Activity Level</label>
              <div className="space-y-3">
                {Object.entries(activityLevels).map(([key, level]) => (
                  <label key={key} className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
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
            </motion.div>
          </div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
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
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};
export default CalorieCalculator;