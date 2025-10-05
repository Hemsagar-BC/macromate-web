// components/Navbar.jsx - Fully Responsive with Slide Animation
import React, { useState, useEffect } from 'react';
import { navItems } from '../constants';

const Navbar = ({ currentPage, activeSection, scrollToSection, navigateToPage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    if (currentPage === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigateToPage('home');
    }
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (href) => {
    scrollToSection(href);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white/90 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer flex-shrink-0"
            onClick={handleLogoClick}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-base sm:text-lg">M</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-gray-800">MacroMate</span>
          </div>

          {/* Desktop Nav */}
          {currentPage === 'home' && (
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => {
                const sectionName = item.href.replace('#', '');
                const isActive = activeSection === sectionName;

                return (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className={`text-gray-700 hover:text-orange-600 transition-colors duration-200 font-medium relative ${
                      isActive ? 'text-orange-600' : ''
                    }`}
                  >
                    {item.name}
                    {isActive && (
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-orange-600 rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Mobile Menu Button */}
          {currentPage === 'home' && (
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-orange-600 p-2"
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Dropdown Menu with Animation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-100 ease-in-out ${
            isMobileMenuOpen ? 'max-h-60' : 'max-h-0'
          }`}
        >
          <div className="py-4 flex flex-col items-center space-y-3">
            {navItems.map((item) => {
              const sectionName = item.href.replace('#', '');
              const isActive = activeSection === sectionName;

              return (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className={`w-full text-center py-2 text-gray-700 hover:text-orange-600 transition-colors duration-200 font-medium ${
                    isActive ? 'text-orange-600' : ''
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
