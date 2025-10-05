// components/Features.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { featuresData } from '../constants';
import image from "../assets/noyes.png"

const Features = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.9, ease: "easeOut" }
    }
  };

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.9 }
    }
  };

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 2.0 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Transform Your{" "}
            <span className="bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
              Health Journey
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {featuresData.subtitle}
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Image */}
          <motion.div 
            className="relative flex justify-center"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 2.0 }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl w-full max-w-md">
              <motion.img
                src={image}
                alt="Healthy nutrition and food tracking"
                className="w-full h-[400px] sm:h-[450px] lg:h-[500px] object-cover rounded-2xl"
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 3.0 }}
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent"></div>
              
              {/* Floating badge */}
              <motion.div 
                className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🎯</span>
                  <span className="text-sm font-semibold text-gray-800">Track & Optimize</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Feature Points */}
          <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: Infinity, amount: 0.2 }}
            
          >
            {featuresData.points.map((point, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group flex items-start space-x-4 p-5 rounded-xl hover:bg-orange-50 transition-all duration-300 cursor-pointer border border-transparent hover:border-orange-200"
                whileHover={{ scale: 1.02, x: 5 }}
              >
                {/* Icon */}
                <motion.div 
                  className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center text-2xl group-hover:from-orange-200 group-hover:to-orange-300 transition-all duration-300 shadow-sm"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {point.icon}
                </motion.div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors duration-300">
                    {point.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    {point.description}
                  </p>
                </div>

                {/* Arrow indicator */}
                <motion.div 
                  className="flex-shrink-0"
                  initial={{ opacity: 0, x: -10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Stats */}
        <motion.div 
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {[
            { value: "50K+", label: "Active Users" },
            { value: "1M+", label: "Foods Analyzed" },
            { value: "99.5%", label: "Uptime" },
            { value: "4.9★", label: "User Rating" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={statsVariants}
              className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl hover:shadow-lg transition-shadow duration-300"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">{stat.value}</div>
              <div className="text-gray-700 font-medium text-sm md:text-base">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;