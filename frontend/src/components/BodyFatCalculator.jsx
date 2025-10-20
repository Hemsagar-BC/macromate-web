import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BodyFatCalculator = ({ onBack, handleBackToHero }) => {
  const [formData, setFormData] = useState({
    age: '', weight: '', height: '', neck: '', abdomen: '', forearm: '', wrist: '', unit: 'metric'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [targetBodyFat, setTargetBodyFat] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const validateForm = () => {
    const { age, weight, height, neck, abdomen, forearm, wrist } = formData;
    if (!age || !weight || !height || !neck || !abdomen || !forearm || !wrist) {
      setError('Please fill in all fields');
      return false;
    }
    if (parseFloat(age) <= 0 || parseFloat(age) > 120) {
      setError('Please enter a valid age (1-120 years)');
      return false;
    }
    return true;
  };
const handleSaveToDashboard = () => {
  if (!targetBodyFat) {
    alert('Please enter your target body fat percentage');
    return;
  }

  const existingData = JSON.parse(localStorage.getItem('macromate_progress')) || { weightLog: [] };
  
  const weight = formData.unit === 'metric' ? formData.weight : (parseFloat(formData.weight) * 0.453592);
  
  const updatedData = {
    ...existingData,
    profile: {
      ...existingData.profile,
      currentWeight: existingData.profile?.currentWeight || parseFloat(weight),
      goalWeight: existingData.profile?.goalWeight || parseFloat(weight),
      currentBodyFat: parseFloat(result.body_fat_percentage),
      targetBodyFat: parseFloat(targetBodyFat),
      startDate: existingData.profile?.startDate || new Date().toISOString().split('T')[0]
    },
    weightLog: existingData.weightLog.length > 0 ? existingData.weightLog : [{
      date: new Date().toISOString().split('T')[0],
      weight: parseFloat(weight),
      bodyFat: parseFloat(result.body_fat_percentage)
    }]
  };

  localStorage.setItem('macromate_progress', JSON.stringify(updatedData));
  alert('✅ Body composition saved to Progress Dashboard!');
};
  const handleCalculate = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/calculate/bodyfat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        setResult({ ...data.data, original_unit: formData.unit, original_weight: formData.weight });
        setShowResults(true);
      } else {
        setError(data.error || 'Calculation failed');
      }
    } catch (err) {
      setError('Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const PieChart = ({ percentage }) => {
    const fat = parseFloat(percentage);
    const lean = 100 - fat;
    const r = 70;
    const c = 2 * Math.PI * r;
    const fatStroke = (fat / 100) * c;
    const leanStroke = (lean / 100) * c;
    
    return (
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 mx-auto">
        <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 180 180">
          {/* Lean mass (green) - bottom layer */}
          <circle 
            cx="90" 
            cy="90" 
            r={r} 
            fill="none" 
            stroke="#10b981" 
            strokeWidth="35"
          />
          
          {/* Fat mass (orange) - top layer */}
          <circle 
            cx="90" 
            cy="90" 
            r={r} 
            fill="none" 
            stroke="#f97316" 
            strokeWidth="35" 
            strokeDasharray={`${fatStroke} ${c}`}
            className="transition-all duration-1000"
          />
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <div className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-800">{percentage}%</div>
          <div className="text-xs sm:text-sm text-gray-600 font-semibold mt-1">BODY FAT</div>
        </div>
      </div>
    );
  };

  if (showResults && result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 pt-16 sm:pt-20 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-3">
            <button onClick={() => setShowResults(false)} className="flex items-center text-gray-600 hover:text-orange-600 transition-colors group text-sm sm:text-base">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              New Calculation
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Your Results</h1>
            <button onClick={handleBackToHero} className="flex items-center text-gray-600 hover:text-orange-600 transition-colors text-sm sm:text-base">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`mb-8 p-6 rounded-2xl border-2 ${result.category_color}`}>
            <h2 className="text-xl font-bold mb-2">Health Assessment</h2>
            <p className="text-lg">{result.recommendation}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">Body Composition Analysis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
              {/* Pie Chart */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="flex flex-col items-center"
              >
                <PieChart percentage={result.body_fat_percentage} />
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mt-6">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                    <span className="text-xs sm:text-sm font-semibold">Body Fat ({result.body_fat_percentage}%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-xs sm:text-sm font-semibold">Lean ({(100 - parseFloat(result.body_fat_percentage)).toFixed(1)}%)</span>
                  </div>
                </div>
              </motion.div>

              {/* Stats */}
              <div className="space-y-3 sm:space-y-4">
                {[
                  { icon: '⚖️', label: 'Total Weight', value: result.original_unit === 'imperial' ? result.original_weight : result.body_composition.total_weight, unit: result.original_unit === 'imperial' ? 'lbs' : 'kg', bg: 'from-gray-50 to-gray-100', color: 'text-gray-800' },
                  { icon: '🔥', label: 'Fat Mass', value: result.original_unit === 'imperial' ? (parseFloat(result.body_composition.fat_mass) * 2.20462).toFixed(1) : result.body_composition.fat_mass, unit: result.original_unit === 'imperial' ? 'lbs' : 'kg', bg: 'from-orange-50 to-orange-100', color: 'text-orange-600' },
                  { icon: '💚', label: 'Lean Body Mass', value: result.original_unit === 'imperial' ? (parseFloat(result.body_composition.lean_body_mass) * 2.20462).toFixed(1) : result.body_composition.lean_body_mass, unit: result.original_unit === 'imperial' ? 'lbs' : 'kg', bg: 'from-green-50 to-green-100', color: 'text-green-600' },
                  { icon: '🎯', label: 'Category', value: result.category, unit: '', bg: 'from-blue-50 to-blue-100', color: 'text-blue-600' }
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: 0.5 + i * 0.1 }}
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
                    className={`flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r ${item.bg} rounded-xl cursor-pointer transition-shadow`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl sm:text-3xl">{item.icon}</div>
                      <div>
                        <div className="text-xs sm:text-sm text-gray-600">{item.label}</div>
                        <div className={`text-lg sm:text-2xl font-bold ${item.color}`}>{item.value} {item.unit}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {result.risk_factors && result.risk_factors.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border-l-4 border-red-500">
              <div className="flex items-start">
                <div className="text-3xl mr-4">⚠️</div>
                <div>
                  <h3 className="text-xl font-bold text-red-800 mb-3">Health Considerations</h3>
                  <ul className="space-y-2">
                    {result.risk_factors.map((risk, i) => (
                      <li key={i} className="flex items-start text-red-700">
                        <span className="mr-2">•</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="text-3xl mr-3">🤖</span>
              AI Model Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: '🧠', label: 'Model Type', value: 'Ridge Regression', bg: 'bg-gray-50' },
                { icon: '✅', label: 'Accuracy (MAE)', value: `±${result.mae}%`, bg: 'bg-green-50' },
                { icon: '📐', label: 'Features Used', value: '7 measurements', bg: 'bg-blue-50' },
                { icon: '📅', label: 'Analysis Date', value: new Date(result.calculation_date).toLocaleDateString(), bg: 'bg-purple-50' }
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }} className={`flex items-center p-4 ${item.bg} rounded-xl`}>
                  <div className="text-3xl mr-4">{item.icon}</div>
                  <div>
                    <div className="text-sm text-gray-600">{item.label}</div>
                    <div className="font-bold text-gray-800">{item.value}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
<motion.div 
  initial={{ opacity: 0 }} 
  animate={{ opacity: 1 }} 
  className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl p-6 md:p-8 mb-8 border-2 border-blue-200"
>
  <h3 className="text-2xl font-bold text-gray-800 mb-3 flex items-center">
    <span className="text-3xl mr-3">💪</span>
    Track Your Body Composition
  </h3>
  <p className="text-gray-700 mb-6">
    Save your body fat results to track progress over time in your dashboard
  </p>
  
  <div className="grid md:grid-cols-2 gap-4 mb-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Current Body Fat</label>
      <input 
        value={result.body_fat_percentage + '%'} 
        disabled 
        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-600" 
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Target Body Fat (%)</label>
      <input 
        type="number" 
        step="0.1"
        value={targetBodyFat}
        onChange={(e) => setTargetBodyFat(e.target.value)}
        className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        placeholder="e.g., 15"
      />
    </div>
  </div>
  
  <motion.button 
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={handleSaveToDashboard} 
    className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl"
  >
    💾 Save to Progress Dashboard
  </motion.button>
</motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowResults(false)} className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg">
              Calculate Again
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => window.print()} className="px-8 py-3 bg-white text-orange-600 font-semibold rounded-xl border-2 border-orange-500 shadow-lg">
              Print Results
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 pt-16 sm:pt-20 pb-8 relative overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div key={i} className="absolute w-1 h-1 bg-orange-300 rounded-full pointer-events-none" animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }} transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }} style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} />
      ))}

      <div className="max-w-2xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 md:py-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-3">
          <button onClick={onBack} className="flex items-center text-gray-600 hover:text-orange-600 transition-colors group text-sm sm:text-base">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Calculators
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Body Fat Calculator</h1>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
          <div className="text-center mb-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="text-5xl sm:text-6xl mb-4">💪</motion.div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">AI-Powered Body Fat Prediction</h2>
            <p className="text-gray-600 text-sm sm:text-base">Using Ridge Regression Machine Learning</p>
          </div>

          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 rounded-xl p-1 inline-flex w-full sm:w-auto">
              {['metric', 'imperial'].map(unit => (
                <button key={unit} onClick={() => setFormData(p => ({ ...p, unit }))} className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-lg font-semibold transition-all text-sm sm:text-base ${formData.unit === unit ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md' : 'text-gray-600'}`}>
                  {unit.charAt(0).toUpperCase() + unit.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                <span className="text-red-700 text-sm sm:text-base">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
            {[
              { name: 'age', label: 'Age (years)', placeholder: '25' },
              { name: 'weight', label: `Weight (${formData.unit === 'metric' ? 'kg' : 'lbs'})`, placeholder: formData.unit === 'metric' ? '70' : '154' },
              { name: 'height', label: `Height (${formData.unit === 'metric' ? 'cm' : 'inches'})`, placeholder: formData.unit === 'metric' ? '175' : '69' },
              { name: 'neck', label: `Neck (${formData.unit === 'metric' ? 'cm' : 'inches'})`, placeholder: formData.unit === 'metric' ? '37' : '14.5' },
              { name: 'abdomen', label: `Abdomen (${formData.unit === 'metric' ? 'cm' : 'inches'})`, placeholder: formData.unit === 'metric' ? '85' : '33.5' },
              { name: 'forearm', label: `Forearm (${formData.unit === 'metric' ? 'cm' : 'inches'})`, placeholder: formData.unit === 'metric' ? '28' : '11' },
              { name: 'wrist', label: `Wrist (${formData.unit === 'metric' ? 'cm' : 'inches'})`, placeholder: formData.unit === 'metric' ? '17' : '6.7' }
            ].map((field, i) => (
              <motion.div key={field.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.05 }}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{field.label} *</label>
                <input type="number" name={field.name} value={formData[field.name]} onChange={handleInputChange} placeholder={`e.g., ${field.placeholder}`} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm sm:text-base" />
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-3 sm:p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h4 className="font-semibold text-orange-800 mb-2 text-sm sm:text-base">📏 Measurement Tips:</h4>
            <ul className="text-xs sm:text-sm text-orange-700 space-y-1">
              <li>• <strong>Neck:</strong>Narrowest point below Adam's apple</li>
              <li>• <strong>Abdomen:</strong> At navel level</li>
              <li>• <strong>Forearm:</strong> Widest point</li>
              <li>• <strong>Wrist:</strong> Narrowest point</li>
            </ul>
          </motion.div>

<motion.div 
  initial={{ opacity: 0 }} 
  animate={{ opacity: 1 }} 
  className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group"
>
  <div className="flex items-start gap-3">
    <div className="text-2xl mt-0.5 group-hover:scale-110 transition-transform duration-300">
      ℹ️
    </div>
    <div>
      <h4 className="font-bold text-blue-900 mb-2 text-sm sm:text-base flex items-center gap-2">
        Important Note
      </h4>
      <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
        This calculator provides an <strong>estimated prediction</strong> of body fat percentage using AI-powered Ridge Regression. 
        Results may vary and should not replace professional medical assessment. This is just to have an idea or estimation of your bodyfat percentge.
      </p>
    </div>
  </div>
</motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <motion.button onClick={handleCalculate} disabled={loading} className="w-full sm:flex-1 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 text-sm sm:text-base" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              {loading ? <div className="flex items-center justify-center"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>Calculating...</div> : 'Predict Body Fat'}
            </motion.button>
            <motion.button onClick={() => setFormData({ age: '', weight: '', height: '', neck: '', abdomen: '', forearm: '', wrist: '', unit: 'metric' })} className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-orange-500 hover:text-orange-600 transition-all text-sm sm:text-base" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              Reset
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default BodyFatCalculator;