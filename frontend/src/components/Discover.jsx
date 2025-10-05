import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data for demonstration - replace with your actual import
const discoverData = {
  subtitle: "Learn the fundamentals of healthy eating and nutrition science",
  sections: [
    {
      id: "calories",
      title: "What are Calories?",
      content: "Calories are like tiny bits of energy your body gets from food to help you run, play, and grow strong! 🌟",
      icon: "🔥",
      details: [
        "1 calorie = 4.184 joules of energy",
        "Your body burns calories even at rest (BMR)",
        "Different activities burn different amounts of calories",
        "Weight management = Calories in vs Calories out"
      ]
    },
    {
      id: "macros",
      title: "Understanding Macronutrients",
      content: "Macros are the three main nutrients your body needs in large amounts: proteins, carbohydrates, and fats.",
      icon: "⚖️",
      details: [
        "Proteins: 4 calories per gram - builds and repairs tissues",
        "Carbohydrates: 4 calories per gram - primary energy source",
        "Fats: 9 calories per gram - essential for hormone production",
        "Each macro plays a unique role in your health"
      ]
    },
    {
      id: "bmi",
      title: "Body Mass Index (BMI)",
      content: "BMI is a screening tool that indicates whether you're at a healthy weight for your height.",
      icon: "📊",
      details: [
        "BMI = weight(kg) / height(m)²",
        "Underweight: BMI < 18.5",
        "Normal weight: BMI 18.5-24.9",
        "Overweight: BMI 25-29.9",
        "Obesity: BMI ≥ 30"
      ]
    },
    {
      id: "tdee",
      title: "Total Daily Energy Expenditure",
      content: "TDEE is the total number of calories you burn in a day, including exercise and daily activities.",
      icon: "⚡",
      details: [
        "BMR: Calories burned at rest",
        "TEF: Thermic effect of food",
        "NEAT: Non-exercise activity thermogenesis",
        "EAT: Exercise activity thermogenesis"
      ]
    }
  ]
};

const Discover = () => {
  const [activeTab, setActiveTab] = useState(0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const tabContentVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      x: 30,
      transition: { duration: 0.3 }
    }
  };

  return (
    <section id="discover" className="py-20 bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 2.0}}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Master Your{" "}
            <span className="bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
              Nutrition Knowledge
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {discoverData.subtitle}
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {discoverData.sections.map((section, index) => (
            <motion.button
              key={section.id}
              onClick={() => setActiveTab(index)}
              variants={itemVariants}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === index
                  ? 'bg-orange-500 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-600 hover:bg-orange-100 hover:text-orange-600 shadow-md'
              }`}
              whileHover={{ scale: activeTab === index ? 1.05 : 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-xl">{section.icon}</span>
              <span>{section.title}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div 
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <div className="p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <motion.div 
                    className="flex items-center space-x-4 mb-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center text-2xl">
                      {discoverData.sections[activeTab].icon}
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800">
                      {discoverData.sections[activeTab].title}
                    </h3>
                  </motion.div>
                  
                  <motion.p 
                    className="text-xl text-gray-600 mb-8 leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {discoverData.sections[activeTab].content}
                  </motion.p>

                  {/* Key Points */}
                  <motion.div 
                    className="space-y-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {discoverData.sections[activeTab].details.map((detail, index) => (
                      <motion.div 
                        key={index} 
                        className="flex items-start space-x-3"
                        variants={itemVariants}
                        custom={index}
                      >
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-3 flex-shrink-0"></div>
                        <p className="text-gray-700 leading-relaxed">{detail}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Right Side - Visual Element */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={`visual-${activeTab}`}
                  className="relative"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl p-8 h-full flex items-center justify-center">
                    {/* Dynamic visual based on active tab */}
                    {activeTab === 0 && (
                      <motion.div 
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <motion.div 
                          className="text-6xl mb-4"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          🔥
                        </motion.div>
                        <motion.div 
                          className="text-2xl font-bold text-orange-600 mb-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          2000
                        </motion.div>
                        <div className="text-gray-600">Daily Calories</div>
                        <motion.div 
                          className="mt-6 bg-white rounded-lg p-4 shadow-md"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Energy Balance</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <motion.div 
                              className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: '75%' }}
                              transition={{ duration: 1, delay: 0.5 }}
                            />
                          </div>
                        </motion.div>
                      </motion.div>
                    )}

                    {activeTab === 1 && (
                      <motion.div 
                        className="text-center space-y-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <motion.div 
                          className="text-4xl mb-4"
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          ⚖️
                        </motion.div>
                        <motion.div 
                          className="grid grid-cols-3 gap-4"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {[
                            { percent: "40%", label: "Carbs", color: "blue" },
                            { percent: "30%", label: "Protein", color: "green" },
                            { percent: "30%", label: "Fats", color: "yellow" }
                          ].map((macro, index) => (
                            <motion.div 
                              key={index}
                              className="bg-white rounded-lg p-4 shadow-md"
                              variants={itemVariants}
                              whileHover={{ scale: 1.05, y: -5 }}
                            >
                              <div className={`text-lg font-bold text-${macro.color}-600`}>{macro.percent}</div>
                              <div className="text-sm text-gray-600">{macro.label}</div>
                            </motion.div>
                          ))}
                        </motion.div>
                      </motion.div>
                    )}

                    {activeTab === 2 && (
                      <motion.div 
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <motion.div 
                          className="text-6xl mb-4"
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          📊
                        </motion.div>
                        <motion.div 
                          className="bg-white rounded-lg p-6 shadow-md"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <div className="text-3xl font-bold text-orange-600 mb-2">22.5</div>
                          <div className="text-gray-600 mb-4">BMI Score</div>
                          <motion.div 
                            className="text-sm text-green-600 font-medium bg-green-100 px-3 py-1 rounded-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            Normal Weight
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    )}

                    {activeTab === 3 && (
                      <motion.div 
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <motion.div 
                          className="text-6xl mb-4"
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                          ⚡
                        </motion.div>
                        <motion.div 
                          className="space-y-4"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {[
                            { label: "BMR", value: "1,600 cal" },
                            { label: "TDEE", value: "2,400 cal" }
                          ].map((item, index) => (
                            <motion.div 
                              key={index}
                              className="bg-white rounded-lg p-4 shadow-md"
                              variants={itemVariants}
                              whileHover={{ scale: 1.05 }}
                            >
                              <div className="text-sm text-gray-600 mb-1">{item.label}</div>
                              <div className="text-lg font-bold text-orange-600">{item.value}</div>
                            </motion.div>
                          ))}
                        </motion.div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Quick Tips Section */}
        <motion.div 
          className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {[
            { icon: '💡', title: 'Pro Tip', text: 'Track your meals consistently for better results and insights into your eating patterns.' },
            { icon: '📱', title: 'Smart Tracking', text: 'Use our photo recognition to quickly log meals without manual entry.' },
            { icon: '🎯', title: 'Goal Setting', text: 'Set realistic and achievable goals based on your lifestyle and preferences.' },
            { icon: '📈', title: 'Progress', text: 'Monitor your progress with detailed analytics and personalized insights.' }
          ].map((tip, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="text-3xl mb-4">{tip.icon}</div>
              <h4 className="font-semibold text-gray-800 mb-2">{tip.title}</h4>
              <p className="text-gray-600 text-sm">{tip.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Discover;