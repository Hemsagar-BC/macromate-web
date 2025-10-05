import React, { useState } from 'react';

const BMICalculator = ({ onBack }) => {
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    unit: 'metric' // metric or imperial
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateBMI = () => {
    if (!formData.height || !formData.weight) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      let bmi;
      let heightInMeters;
      let weightInKg;

      if (formData.unit === 'metric') {
        heightInMeters = parseFloat(formData.height) / 100;
        weightInKg = parseFloat(formData.weight);
      } else {
        heightInMeters = (parseFloat(formData.height) * 2.54) / 100;
        weightInKg = parseFloat(formData.weight) * 0.453592;
      }

      bmi = weightInKg / (heightInMeters * heightInMeters);

      let category, categoryColor, healthStatus, recommendation;
      
      if (bmi < 16.0) {
        category = 'Severely Underweight';
        categoryColor = 'text-red-600 bg-red-100';
        healthStatus = 'critical';
        recommendation = 'You probably need to gain weight! Please consult with a healthcare provider immediately.';
      } else if (bmi >= 16.0 && bmi < 18.5) {
        category = 'Underweight';
        categoryColor = 'text-blue-600 bg-blue-100';
        healthStatus = 'underweight';
        recommendation = 'You probably need to gain weight! Consider consulting with a nutritionist for a healthy weight gain plan.';
      } else if (bmi >= 18.5 && bmi < 25.0) {
        category = 'Normal';
        categoryColor = 'text-green-600 bg-green-100';
        healthStatus = 'normal';
        recommendation = 'Great! Your weight is in the healthy range. Maintain your current lifestyle.';
      } else if (bmi >= 25.0 && bmi < 30.0) {
        category = 'Overweight';
        categoryColor = 'text-yellow-600 bg-yellow-100';
        healthStatus = 'overweight';
        recommendation = 'You probably need to lose weight. Consider a balanced diet and regular exercise.';
      } else if (bmi >= 30.0 && bmi < 35.0) {
        category = 'Moderately Obese';
        categoryColor = 'text-orange-600 bg-orange-100';
        healthStatus = 'obese1';
        recommendation = 'You probably need to lose weight. Please consider consulting with a healthcare provider for a personalized plan.';
      } else if (bmi >= 35.0 && bmi < 40.0) {
        category = 'Severely Obese';
        categoryColor = 'text-red-600 bg-red-100';
        healthStatus = 'obese2';
        recommendation = 'You probably need to lose weight urgently. Please consult with a healthcare provider immediately.';
      } else {
        category = 'Morbidly Obese';
        categoryColor = 'text-red-700 bg-red-200';
        healthStatus = 'obese3';
        recommendation = 'You probably need to lose weight urgently. Please seek immediate medical attention.';
      }

      const idealMinWeight = 18.5 * (heightInMeters * heightInMeters);
      const idealMaxWeight = 24.9 * (heightInMeters * heightInMeters);

      setResult({
        bmi: bmi.toFixed(1),
        category,
        categoryColor,
        healthStatus,
        recommendation,
        currentWeight: weightInKg.toFixed(1),
        idealWeightRange: {
          min: idealMinWeight.toFixed(1),
          max: idealMaxWeight.toFixed(1)
        },
        weightToLoseGain: healthStatus === 'normal' ? 0 : 
          healthStatus.includes('underweight') || healthStatus === 'critical' ?
          (idealMinWeight - weightInKg).toFixed(1) :
          (weightInKg - idealMaxWeight).toFixed(1)
      });
      
      setLoading(false);
    }, 1000);
  };

  const resetCalculator = () => {
    setFormData({ height: '', weight: '', unit: 'metric' });
    setResult(null);
  };

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
            <h1 className="text-3xl font-bold text-gray-800">BMI Results</h1>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Your BMI</h2>
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <div className="w-full h-full rounded-full bg-gradient-to-r from-orange-100 to-orange-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-orange-600 mb-2">{result.bmi}</div>
                      <div className="text-sm text-gray-600">BMI Score</div>
                    </div>
                  </div>
                </div>
                <div className={`inline-block px-4 py-2 rounded-full font-semibold ${result.categoryColor}`}>
                  {result.category}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Health Analysis</h3>
              
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 mb-6 border-l-4 border-orange-500">
                <p className="text-gray-800 font-medium">{result.recommendation}</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Weight:</span>
                  <span className="font-semibold text-gray-800">{result.currentWeight} kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ideal Weight Range:</span>
                  <span className="font-semibold text-gray-800">
                    {result.idealWeightRange.min} - {result.idealWeightRange.max} kg
                  </span>
                </div>
                {result.weightToLoseGain > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      {result.healthStatus.includes('underweight') || result.healthStatus === 'critical' 
                        ? 'Weight to Gain:' 
                        : 'Weight to Lose:'
                      }
                    </span>
                    <span className="font-semibold text-orange-600">{result.weightToLoseGain} kg</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">WHO Adult BMI Categories</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                  <span className="text-sm font-medium">&lt; 16.0</span>
                  <span className="text-sm text-red-600">Severely Underweight</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <span className="text-sm font-medium">16.0 - 18.4</span>
                  <span className="text-sm text-blue-600">Underweight</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <span className="text-sm font-medium">18.5 - 24.9</span>
                  <span className="text-sm text-green-600">Normal</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                  <span className="text-sm font-medium">25.0 - 29.9</span>
                  <span className="text-sm text-yellow-600">Overweight</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                  <span className="text-sm font-medium">30.0 - 34.9</span>
                  <span className="text-sm text-orange-600">Moderately Obese</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border-l-4 border-red-600">
                  <span className="text-sm font-medium">≥ 35.0</span>
                  <span className="text-sm text-red-600">Severely/Morbidly Obese</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
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
          <h1 className="text-3xl font-bold text-gray-800">BMI Calculator</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Calculate Your BMI</h2>
            <p className="text-gray-600">Body Mass Index helps assess if your weight is healthy for your height</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Units</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="unit"
                  value="metric"
                  checked={formData.unit === 'metric'}
                  onChange={handleInputChange}
                  className="text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-2">Metric (kg, cm)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="unit"
                  value="imperial"
                  checked={formData.unit === 'imperial'}
                  onChange={handleInputChange}
                  className="text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-2">Imperial (lbs, inches)</span>
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Height {formData.unit === 'metric' ? '(cm)' : '(inches)'}
            </label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              placeholder={formData.unit === 'metric' ? 'e.g., 170' : 'e.g., 67'}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weight {formData.unit === 'metric' ? '(kg)' : '(lbs)'}
            </label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              placeholder={formData.unit === 'metric' ? 'e.g., 65' : 'e.g., 143'}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
            />
          </div>

          <button
            onClick={calculateBMI}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Calculating...
              </div>
            ) : (
              'Calculate BMI'
            )}
          </button>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">BMI Formula:</h4>
            <div className="text-sm text-gray-600">
              <strong>Metric:</strong> BMI = weight(kg) ÷ height(m)²<br/>
              <strong>Imperial:</strong> BMI = (weight(lbs) ÷ height(inches)²) × 703
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BMICalculator;