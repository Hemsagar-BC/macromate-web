import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus } from 'lucide-react';

const ProgressDashboard = ({ onBack, navigateToCalculator, initialData, onDataChange }) => {
  const loadData = () => {
    // Use initialData from props if available, otherwise return empty state
    if (initialData && initialData.profile.currentWeight) {
      return initialData;
    }
    return {
      profile: {
        currentWeight: null,
        goalWeight: null,
        currentBodyFat: null,
        targetBodyFat: null,
        startDate: null
      },
      weightLog: []
    };
  };

  const [data, setData] = useState(loadData());

  // Update parent component whenever data changes
  const updateData = (newData) => {
    setData(newData);
    if (onDataChange) {
      onDataChange(newData);
    }
  };
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [showEditGoals, setShowEditGoals] = useState(false);
  const [editForm, setEditForm] = useState({
    currentWeight: '',
    goalWeight: '',
    currentBodyFat: '',
    targetBodyFat: ''
  });
  const [activeTab, setActiveTab] = useState('weight');
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    bodyFat: ''
  });

  const hasData = data.profile.currentWeight && data.weightLog.length > 0;

  const handleSetGoal = () => {
    const currentWeight = prompt('Enter your current weight (kg):');
    const goalWeight = prompt('Enter your goal weight (kg):');
    const currentBodyFat = prompt('Enter your current body fat % (optional):');
    const targetBodyFat = prompt('Enter your target body fat % (optional):');
    
    if (currentWeight && goalWeight) {
      const newData = {
        ...data,
        profile: {
          currentWeight: parseFloat(currentWeight),
          goalWeight: parseFloat(goalWeight),
          currentBodyFat: currentBodyFat ? parseFloat(currentBodyFat) : null,
          targetBodyFat: targetBodyFat ? parseFloat(targetBodyFat) : null,
          startDate: new Date().toISOString().split('T')[0]
        },
        weightLog: [{
          date: new Date().toISOString().split('T')[0],
          weight: parseFloat(currentWeight),
          bodyFat: currentBodyFat ? parseFloat(currentBodyFat) : null
        }]
      };
      updateData(newData);
    }
  };

  const handleAddEntry = () => {
    if (!newEntry.weight) {
      alert('Please enter your weight');
      return;
    }

    const entry = {
      date: newEntry.date,
      weight: parseFloat(newEntry.weight),
      bodyFat: newEntry.bodyFat ? parseFloat(newEntry.bodyFat) : null
    };

    const newData = {
      ...data,
      profile: {
        ...data.profile,
        currentWeight: entry.weight,
        currentBodyFat: entry.bodyFat || data.profile.currentBodyFat
      },
      weightLog: [...data.weightLog, entry].sort((a, b) => new Date(a.date) - new Date(b.date))
    };
    
    updateData(newData);

    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      weight: '',
      bodyFat: ''
    });
    setShowAddEntry(false);
  };

  const handleDeleteEntry = (indexToDelete) => {
    if (data.weightLog.length === 1) {
      alert('Cannot delete the only entry. You need at least one entry to track progress.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this entry?')) {
      const reversedIndex = data.weightLog.length - 1 - indexToDelete;
      const updatedLog = data.weightLog.filter((_, index) => index !== reversedIndex);
      
      const latestEntry = updatedLog[updatedLog.length - 1];
      
      const newData = {
        ...data,
        profile: {
          ...data.profile,
          currentWeight: latestEntry.weight,
          currentBodyFat: latestEntry.bodyFat || data.profile.currentBodyFat
        },
        weightLog: updatedLog
      };
      
      updateData(newData);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    });
  };

  const formatChartDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const calculateProgress = (type = 'weight') => {
    if (type === 'weight') {
      if (!data.profile.currentWeight || !data.profile.goalWeight) return 0;
      const start = data.weightLog[0]?.weight || data.profile.currentWeight;
      const current = data.profile.currentWeight;
      const goal = data.profile.goalWeight;
      
      const totalChange = Math.abs(goal - start);
      const currentChange = Math.abs(current - start);
      const progress = (currentChange / totalChange) * 100;
      
      return Math.min(Math.round(progress), 100);
    } else {
      if (!data.profile.currentBodyFat || !data.profile.targetBodyFat) return 0;
      const start = data.weightLog[0]?.bodyFat || data.profile.currentBodyFat;
      const current = data.profile.currentBodyFat;
      const goal = data.profile.targetBodyFat;
      
      const totalChange = Math.abs(goal - start);
      const currentChange = Math.abs(current - start);
      const progress = (currentChange / totalChange) * 100;
      
      return Math.min(Math.round(progress), 100);
    }
  };

  if (!hasData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Progress Dashboard</h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center"
          >
            <div className="text-6xl mb-6">📊</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Start Your Journey</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Set your weight and body fat goals to start tracking your progress. Get personalized insights for your fitness journey.
            </p>

            <div className="space-y-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSetGoal}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Set Your Goals
              </motion.button>

              <div className="grid md:grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigateToCalculator && navigateToCalculator('calories')}
                  className="py-3 bg-white text-orange-600 font-semibold rounded-xl border-2 border-orange-500 hover:bg-orange-50 transition-all"
                >
                  📊 Calculate Calories
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigateToCalculator && navigateToCalculator('bodyfat')}
                  className="py-3 bg-white text-orange-600 font-semibold rounded-xl border-2 border-orange-500 hover:bg-orange-50 transition-all"
                >
                  💪 Check Body Fat
                </motion.button>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              Tip: Use our calculators to get personalized goals based on your body metrics
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const weightProgress = calculateProgress('weight');
  const bodyFatProgress = data.profile.currentBodyFat ? calculateProgress('bodyfat') : null;
  const weightDifference = (data.profile.currentWeight - data.profile.goalWeight).toFixed(1);
  const bodyFatDifference = data.profile.currentBodyFat && data.profile.targetBodyFat 
    ? (data.profile.currentBodyFat - data.profile.targetBodyFat).toFixed(1) 
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <span className="hidden sm:inline">Back to Calculators</span>
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Progress Dashboard</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Weight Tracker</h2>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setEditForm({
                    currentWeight: data.profile.currentWeight || '',
                    goalWeight: data.profile.goalWeight || '',
                    currentBodyFat: data.profile.currentBodyFat || '',
                    targetBodyFat: data.profile.targetBodyFat || ''
                  });
                  setShowEditGoals(true);
                }}
                className="px-3 md:px-4 py-2 border-2 border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-semibold text-xs md:text-sm"
              >
                <span className="hidden sm:inline">⚙️ </span>Edit Goals
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddEntry(true)}
                className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all font-semibold text-xs md:text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Entry</span>
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm text-gray-600 mb-1">Current Weight</div>
              <div className="text-2xl md:text-3xl font-bold text-gray-800">{data.profile.currentWeight} kg</div>
            </div>
            <div className="bg-orange-50 rounded-xl p-4">
              <div className="text-sm text-gray-600 mb-1">Target Weight</div>
              <div className="text-2xl md:text-3xl font-bold text-orange-600">{data.profile.goalWeight} kg</div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-bold text-orange-600">{weightProgress}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${weightProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-500">Start: {data.weightLog[0]?.weight} kg</span>
              <span className="text-xs text-gray-500">{Math.abs(weightDifference)} kg to goal</span>
            </div>
          </div>

          {data.profile.currentBodyFat && data.profile.targetBodyFat && (
            <>
              <div className="grid grid-cols-2 gap-4 mb-6 pt-6 border-t border-gray-200">
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Current Body Fat</div>
                  <div className="text-2xl md:text-3xl font-bold text-blue-600">{data.profile.currentBodyFat}%</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Target Body Fat</div>
                  <div className="text-2xl md:text-3xl font-bold text-green-600">{data.profile.targetBodyFat}%</div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Body Fat Progress</span>
                  <span className="text-sm font-bold text-blue-600">{bodyFatProgress}%</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${bodyFatProgress}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-500">Start: {data.weightLog[0]?.bodyFat}%</span>
                  <span className="text-xs text-gray-500">{Math.abs(bodyFatDifference)}% to goal</span>
                </div>
              </div>
            </>
          )}

          <div className="border-b border-gray-200 mb-4">
            <div className="flex gap-6">
              <button
                onClick={() => setActiveTab('weight')}
                className={`px-4 py-2 font-semibold transition-colors ${
                  activeTab === 'weight' 
                    ? 'text-orange-600 border-b-2 border-orange-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Weight
              </button>
              {data.profile.currentBodyFat && (
                <button
                  onClick={() => setActiveTab('bodyfat')}
                  className={`px-4 py-2 font-semibold transition-colors ${
                    activeTab === 'bodyfat' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Body Fat
                </button>
              )}
            </div>
          </div>

          {activeTab === 'weight' && (
            <div className="h-64 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.weightLog}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatChartDate}
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                    domain={['dataMin - 2', 'dataMax + 2']}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                    labelFormatter={(label) => formatChartDate(label)}
                    formatter={(value) => [`${value} kg`, 'Weight']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#f97316" 
                    strokeWidth={3}
                    dot={{ fill: '#f97316', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey={() => data.profile.goalWeight} 
                    stroke="#10b981" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeTab === 'bodyfat' && data.profile.currentBodyFat && (
            <div className="h-64 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.weightLog.filter(entry => entry.bodyFat)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatChartDate}
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                    domain={['dataMin - 2', 'dataMax + 2']}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                    labelFormatter={(label) => formatChartDate(label)}
                    formatter={(value) => [`${value}%`, 'Body Fat']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="bodyFat" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                  {data.profile.targetBodyFat && (
                    <Line 
                      type="monotone" 
                      dataKey={() => data.profile.targetBodyFat} 
                      stroke="#10b981" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Entries</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {data.weightLog.slice().reverse().map((entry, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800 flex flex-wrap items-center gap-2">
                      <span>{entry.weight} kg</span>
                      {entry.bodyFat && (
                        <span className="text-blue-600">• {entry.bodyFat}% BF</span>
                      )}
                      {index === 0 && (
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs font-semibold rounded-full">
                          Latest
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 truncate">{formatDate(entry.date)}</div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteEntry(index)}
                    className="ml-3 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                    title="Delete entry"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -5 }}
            onClick={() => navigateToCalculator && navigateToCalculator('calories')}
            className="bg-white rounded-xl shadow-lg p-6 text-left hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center text-2xl">
                📊
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Calorie Calculator</h3>
                <p className="text-sm text-gray-600">Plan your daily nutrition</p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02, y: -5 }}
            onClick={() => navigateToCalculator && navigateToCalculator('bodyfat')}
            className="bg-white rounded-xl shadow-lg p-6 text-left hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl flex items-center justify-center text-2xl">
                💪
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Body Fat Predictor</h3>
                <p className="text-sm text-gray-600">Check your composition</p>
              </div>
            </div>
          </motion.button>
        </div>
      </div>

      {showAddEntry && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowAddEntry(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Entry</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 75.5"
                  value={newEntry.weight}
                  onChange={(e) => setNewEntry({...newEntry, weight: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Body Fat % (optional)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 18.5"
                  value={newEntry.bodyFat}
                  onChange={(e) => setNewEntry({...newEntry, bodyFat: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddEntry}
                className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl"
              >
                Add Entry
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAddEntry(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showEditGoals && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowEditGoals(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Edit Your Goals</h3>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editForm.currentWeight}
                    onChange={(e) => setEditForm({...editForm, currentWeight: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Goal Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editForm.goalWeight}
                    onChange={(e) => setEditForm({...editForm, goalWeight: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Body Fat (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editForm.currentBodyFat}
                    onChange={(e) => setEditForm({...editForm, currentBodyFat: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Body Fat (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editForm.targetBodyFat}
                    onChange={(e) => setEditForm({...editForm, targetBodyFat: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const updatedProfile = {
                    ...data.profile,
                    currentWeight: parseFloat(editForm.currentWeight),
                    goalWeight: parseFloat(editForm.goalWeight),
                    currentBodyFat: editForm.currentBodyFat ? parseFloat(editForm.currentBodyFat) : data.profile.currentBodyFat,
                    targetBodyFat: editForm.targetBodyFat ? parseFloat(editForm.targetBodyFat) : data.profile.targetBodyFat
                  };
                  updateData({...data, profile: updatedProfile});
                  setShowEditGoals(false);
                  alert('✅ Goals updated successfully!');
                }}
                className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl"
              >
                Update Goals
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowEditGoals(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ProgressDashboard;