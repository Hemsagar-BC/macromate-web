// App.jsx
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Feature';
import Discover from './components/Discover';
import Footer from './components/Footer';
import Calculate from './pages/Calculator';
import Food from './pages/Food';
import FoodLog from './pages/FoodLog'; // Import FoodLog

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  
  // Add progress data state management
  const [progressData, setProgressData] = useState({
    profile: {
      currentWeight: null,
      goalWeight: null,
      currentBodyFat: null,
      targetBodyFat: null,
      startDate: null
    },
    weightLog: []
  });

  const navigateToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (href) => {
    setCurrentPage('home');
    setTimeout(() => {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="font-sans">
      <Navbar 
        currentPage={currentPage} 
        scrollToSection={scrollToSection} 
      />
      
      {currentPage === 'home' && (
        <>
          <Hero navigateToPage={navigateToPage} />
          <Features />
          <Discover/>
          <Footer/>
        </>
      )}
      
      {currentPage === 'calculate' && (
        <Calculate 
          navigateToPage={navigateToPage}
          progressData={progressData}
          onProgressDataChange={setProgressData}
        />
      )}
      
      {currentPage === 'food' && (
        <Food navigateToPage={navigateToPage} />
      )}
      
      {/* Add FoodLog page */}
      {currentPage === 'foodlog' && (
        <FoodLog navigateToPage={navigateToPage} />
      )}
    </div>
  );
};

export default App;