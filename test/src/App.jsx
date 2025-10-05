// App.jsx
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Feature';
import Discover from './components/Discover';
import Calculate from './pages/Calculator';
import Food from './pages/Food';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

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
        </>
      )}
      
      {currentPage === 'calculate' && (
        <Calculate navigateToPage={navigateToPage} />
      )}
      
      {currentPage === 'food' && (
        <Food navigateToPage={navigateToPage} />
      )}
    </div>
  );
};

export default App;