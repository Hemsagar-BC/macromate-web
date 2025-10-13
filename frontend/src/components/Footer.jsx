const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="bg-orange-600 rounded-xl p-2 mr-3">
                <span className="text-2xl font-bold">M</span>
              </div>
              <span className="text-xl font-bold">MacroMate</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
                    Your science-backed fitness companion for optimal nutrition and health.
                 <br />
                <span className="mt-2 inline-block">
                Made with <span className="text-red-500 animate-pulse">❤️</span> by{' '}
                <span className="font-semibold text-orange-500 hover:text-orange-400 transition-colors cursor-pointer">
                 HS36
               </span>
             </span>
           </p>
        </div>
          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span className="text-orange-500">🔗</span> Quick Links
            </h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><a href="#bmi" className="hover:text-orange-500 transition-colors hover:translate-x-1 inline-block">BMI Calculator</a></li>
              <li><a href="#calories" className="hover:text-orange-500 transition-colors hover:translate-x-1 inline-block">Calorie Calculator</a></li>
              <li><a href="#macros" className="hover:text-orange-500 transition-colors hover:translate-x-1 inline-block">Macro Calculator</a></li>
              <li><a href="#bodyfat" className="hover:text-orange-500 transition-colors hover:translate-x-1 inline-block">Body Fat Predictor</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><a href="#about" className="hover:text-orange-500 transition-colors hover:translate-x-1 inline-block">Privacy Policy</a></li>
              <li><a href="#science" className="hover:text-orange-500 transition-colors hover:translate-x-1 inline-block">Terms of Service</a></li>
              <li><a href="#faq" className="hover:text-orange-500 transition-colors hover:translate-x-1 inline-block">Support</a></li>
              <li><a href="#blog" className="hover:text-orange-500 transition-colors hover:translate-x-1 inline-block">Documentation</a></li>
            </ul>
          </div>

          {/* Connect With Us */}
          <div>
            <h3 className="font-bold text-lg mb-4">Connect With Us</h3>
            <div className="flex gap-4">
              <a href="https://github.com/Hemsagar-BC" target="_blank" rel="noopener noreferrer" 
                 className="bg-slate-800 hover:bg-orange-600 p-3 rounded-lg transition-all hover:scale-110">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" 
                 className="bg-slate-800 hover:bg-orange-600 p-3 rounded-lg transition-all hover:scale-110">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                 className="bg-slate-800 hover:bg-orange-600 p-3 rounded-lg transition-all hover:scale-110">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
              </a>
            </div>
          </div>
     </div>

        {/* Medical Disclaimer Banner */}
        <div className="border-t border-slate-700 pt-8 mb-8">
          <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-4">
            <p className="text-xs text-gray-300 text-center leading-relaxed">
              <strong className="text-orange-400">⚠️ Medical Disclaimer:</strong> MacroMate provides general nutritional information based on scientific research. 
              This tool is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider 
              before making significant changes to your diet or exercise routine.
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 mb-6">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-300">© 2025 <span className="text-orange-500 font-semibold">MacroMate</span>. All Rights Reserved.</p>
              <p className="text-xs text-gray-500 mt-1">Building the future of nutrition tracking</p>
            </div>
            <div className="flex items-center gap-3 bg-slate-800 px-4 py-2 rounded-full">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-orange-500">v1.0.0 Beta</span>
              </div>
              <div className="w-px h-4 bg-slate-600"></div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs text-gray-300">All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;