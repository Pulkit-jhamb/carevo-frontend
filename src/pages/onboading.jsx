import React, { useState, useEffect } from 'react';

const SplashScreen = ({ onAnimationComplete }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showTimeout = setTimeout(() => setIsVisible(true), 10);
    const hideTimeout = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onAnimationComplete, 1000);
    }, 3010);

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
  }, [onAnimationComplete]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black">
      <div
        className={`transition-opacity duration-[2000ms] ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{
          transitionProperty: 'opacity',
          transitionDuration: isVisible ? '2000ms' : '1000ms',
          opacity: isVisible ? 1 : 0
        }}
      >
        <h1 className="text-6xl md:text-7xl font-bold text-white">
          Carevo
        </h1>
      </div>
    </div>
  );
};

const OnboardingFlow = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState('forward');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [userInfo, setUserInfo] = useState({
    name: '',
    day: '',
    month: '',
    year: '',
    language: 'English'
  });
  const [selectedPlan, setSelectedPlan] = useState('');

  const totalSteps = selectedInstitution === 'college' ? 6 : 5;

  const nextStep = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setDirection('forward');
    
    setTimeout(() => {
      setCurrentStep(prev => prev + 1);
      setTimeout(() => setIsAnimating(false), 400);
    }, 400);
  };

  const prevStep = () => {
    if (isAnimating || currentStep === 1) return;
    
    setIsAnimating(true);
    setDirection('backward');
    
    setTimeout(() => {
      setCurrentStep(prev => prev - 1);
      setTimeout(() => setIsAnimating(false), 400);
    }, 400);
  };

  const getBackgroundColor = () => {
    if (selectedTheme === 'light') return 'bg-white';
    if (selectedTheme === 'dark') return 'bg-black';
    return 'bg-black';
  };

  const getTextColor = () => {
    if (selectedTheme === 'light') return 'text-black';
    return 'text-white';
  };

  const getSecondaryTextColor = () => {
    if (selectedTheme === 'light') return 'text-gray-600';
    return 'text-gray-400';
  };

  const getInputColors = () => {
    if (selectedTheme === 'light') {
      return 'bg-white border-gray-300 text-black placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black';
    }
    return 'bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-white focus:ring-1 focus:ring-white';
  };

  const getButtonColors = () => {
    if (selectedTheme === 'light') {
      return 'bg-black text-white hover:bg-gray-900';
    }
    return 'bg-white text-black hover:bg-gray-100';
  };

  const getCardColors = () => {
    if (selectedTheme === 'light') {
      return 'bg-gray-50 border-gray-200';
    }
    return 'bg-[#1a1a1a] border-gray-800';
  };

  const getStepIndicatorColor = (step) => {
    if (selectedTheme === 'light') {
      if (step === currentStep) return 'bg-black';
      if (step < currentStep) return 'bg-gray-400';
      return 'bg-gray-300';
    }
    if (step === currentStep) return 'bg-white';
    if (step < currentStep) return 'bg-gray-400';
    return 'bg-gray-700';
  };

  const StepIndicator = () => (
    <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index + 1}
          className={`w-2 h-2 rounded-full transition-all duration-500 ${getStepIndicatorColor(index + 1)}`}
        />
      ))}
    </div>
  );

  const getTransitionClass = () => {
    if (isAnimating) {
      return direction === 'forward' 
        ? 'opacity-0 translate-x-8' 
        : 'opacity-0 -translate-x-8';
    }
    return 'opacity-100 translate-x-0';
  };

  // Step 1: Theme Selection
  const ThemeSelectionStep = () => (
    <div className={`transition-all duration-300 ${getTransitionClass()}`}>
      <div className="text-center">
        <h1 className={`text-2xl font-semibold mb-12 ${getTextColor()}`}>Choose your style</h1>
        
        <div className="flex justify-center space-x-8 mb-12">
          <div
            className={`relative cursor-pointer transition-all duration-200 ${
              selectedTheme === 'light' ? 'scale-105' : 'hover:scale-102'
            }`}
            onClick={() => setSelectedTheme('light')}
          >
            <div className={`w-48 h-32 rounded-xl border-2 transition-all duration-200 ${
              selectedTheme === 'light' 
                ? 'border-black shadow-lg' 
                : 'border-gray-400 hover:border-gray-600'
            }`}>
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-4 flex flex-col">
                <div className="flex justify-between items-center mb-3">
                  <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                  <div className="w-8 h-4 bg-gray-800 rounded-full"></div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center">
                    <span className="text-gray-800 text-xs font-semibold">Aa</span>
                  </div>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="w-20 h-1 bg-gray-400 rounded"></div>
                  <div className="w-16 h-1 bg-gray-300 rounded"></div>
                  <div className="w-12 h-1 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
            <p className={`text-sm mt-3 font-medium ${getTextColor()}`}>Light</p>
          </div>

          <div
            className={`relative cursor-pointer transition-all duration-200 ${
              selectedTheme === 'dark' ? 'scale-105' : 'hover:scale-102'
            }`}
            onClick={() => setSelectedTheme('dark')}
          >
            <div className={`w-48 h-32 rounded-xl border-2 transition-all duration-200 ${
              selectedTheme === 'dark' 
                ? 'border-white shadow-lg' 
                : 'border-gray-600 hover:border-gray-500'
            }`}>
              <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-lg p-4 flex flex-col">
                <div className="flex justify-between items-center mb-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <div className="w-8 h-4 bg-white rounded-full"></div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">Aa</span>
                  </div>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="w-20 h-1 bg-gray-600 rounded"></div>
                  <div className="w-16 h-1 bg-gray-700 rounded"></div>
                  <div className="w-12 h-1 bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
            <p className={`text-sm mt-3 font-medium ${getTextColor()}`}>Dark</p>
          </div>
        </div>

        <button
          onClick={nextStep}
          disabled={!selectedTheme || isAnimating}
          className={`px-8 py-3 rounded-full font-medium transition-all duration-200 ${
            selectedTheme && !isAnimating
              ? `${getButtonColors()} hover:scale-105 cursor-pointer`
              : selectedTheme === 'light'
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );

  // Step 2: Institution Selection
  const InstitutionStep = () => (
    <div className={`transition-all duration-300 ${getTransitionClass()}`}>
      <div className="text-center max-w-5xl mx-auto">
        <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${getTextColor()}`}>
          Are you a school or college student?
        </h1>
        <p className={`text-base mb-10 ${getSecondaryTextColor()}`}>
          Let's start with your current stage.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
          <div
            className={`relative cursor-pointer transition-all duration-200 ${
              selectedInstitution === 'school' ? 'scale-[1.02]' : 'hover:scale-[1.01]'
            }`}
            onClick={() => setSelectedInstitution('school')}
          >
            <div
              className={`rounded-xl overflow-hidden border-2 ${
                selectedTheme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-[#1a1a1a] border-gray-800'
              } ${selectedInstitution === 'school' ? (selectedTheme === 'light' ? 'ring-2 ring-black' : 'ring-2 ring-white') : ''}`}
            >
              <div className="p-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${selectedTheme === 'light' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    <path d="M9 22V12h6v10" />
                  </svg>
                </div>
                <div className={`text-left ${getTextColor()}`}>
                  <div className="text-xl font-semibold mb-1">School</div>
                  <div className={`${getSecondaryTextColor()} text-sm`}>Choose your path to more engaging learning.</div>
                </div>
              </div>
              <div className={selectedTheme === 'light' ? 'h-px bg-gray-200' : 'h-px bg-gray-800'} />
              <div className="p-6">
                <div className={`text-left text-sm font-medium ${getSecondaryTextColor()} mb-3`}>Designed For</div>
                <ul className="space-y-2.5 text-left">
                  {['Primary School', 'Middle School', 'High School', 'Homeschool'].map((label) => (
                    <li key={label} className="flex items-center gap-2.5">
                      <div className={`w-1 h-1 rounded-full ${selectedTheme === 'light' ? 'bg-black' : 'bg-white'}`}></div>
                      <span className={`text-sm ${getTextColor()}`}>{label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div
            className={`relative cursor-pointer transition-all duration-200 ${
              selectedInstitution === 'college' ? 'scale-[1.02]' : 'hover:scale-[1.01]'
            }`}
            onClick={() => setSelectedInstitution('college')}
          >
            <div
              className={`rounded-xl overflow-hidden border-2 ${
                selectedTheme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-[#1a1a1a] border-gray-800'
              } ${selectedInstitution === 'college' ? (selectedTheme === 'light' ? 'ring-2 ring-black' : 'ring-2 ring-white') : ''}`}
            >
              <div className="p-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${selectedTheme === 'light' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 10l-10-5L2 10l10 5 10-5z" />
                    <path d="M6 12v5c0 .6.4 1 1 1h10c.6 0 1-.4 1-1v-5" />
                  </svg>
                </div>
                <div className={`text-left ${getTextColor()}`}>
                  <div className="text-xl font-semibold mb-1">College</div>
                  <div className={`${getSecondaryTextColor()} text-sm`}>Select your track for academic success.</div>
                </div>
              </div>
              <div className={selectedTheme === 'light' ? 'h-px bg-gray-200' : 'h-px bg-gray-800'} />
              <div className="p-6">
                <div className={`text-left text-sm font-medium ${getSecondaryTextColor()} mb-3`}>Designed For</div>
                <ul className="space-y-2.5 text-left">
                  {["Undergraduate's", "Postgraduate's", "PhD / Doctorate's", 'Community College / Diploma'].map((label) => (
                    <li key={label} className="flex items-center gap-2.5">
                      <div className={`w-1 h-1 rounded-full ${selectedTheme === 'light' ? 'bg-black' : 'bg-white'}`}></div>
                      <span className={`text-sm ${getTextColor()}`}>{label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prevStep}
            disabled={isAnimating}
            className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 border ${
              selectedTheme === 'light'
                ? 'bg-white border-gray-300 text-black hover:bg-gray-50'
                : 'bg-[#1a1a1a] border-gray-700 text-white hover:bg-[#2a2a2a]'
            }`}
          >
            Back
          </button>

          <button
            onClick={nextStep}
            disabled={!selectedInstitution || isAnimating}
            className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${
              selectedInstitution && !isAnimating
                ? `${getButtonColors()} hover:scale-105 cursor-pointer`
                : selectedTheme === 'light'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );

  // Step 3: User Info
  const UserInfoStep = () => (
    <div className={`transition-all duration-300 ${getTransitionClass()}`}>
      <div className="text-center max-w-lg mx-auto">
        <h1 className={`text-2xl md:text-3xl font-bold mb-10 ${getTextColor()}`}>Help us personalize your experience</h1>
        
        <div className="space-y-8 mb-10">
          <div className="text-left">
            <label className={`block text-base font-medium mb-3 ${getTextColor()}`}>
              What's your name?
            </label>
            <input
              type="text"
              className={`w-full px-4 py-3.5 rounded-lg border outline-none transition-all ${getInputColors()}`}
              placeholder="pulkit"
            />
          </div>

          <div className="text-left">
            <label className={`block text-base font-medium mb-3 ${getTextColor()}`}>
              What's your date of birth?
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                className={`w-20 px-4 py-3.5 rounded-lg border outline-none transition-all text-center ${getInputColors()}`}
                placeholder="23"
                maxLength="2"
              />

              <select
                className={`flex-1 px-4 py-3.5 rounded-lg border outline-none transition-all ${getInputColors()}`}
              >
                <option value="">July</option>
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
              </select>

              <input
                type="text"
                className={`w-28 px-4 py-3.5 rounded-lg border outline-none transition-all text-center ${getInputColors()}`}
                placeholder="2004"
                maxLength="4"
              />
            </div>
          </div>

          <div className="text-left">
            <label className={`block text-base font-medium mb-3 ${getTextColor()}`}>
              What's your preferred language?
            </label>
            <select
              className={`w-full px-4 py-3.5 rounded-lg border outline-none transition-all ${getInputColors()}`}
            >
              <option value="English">🇺🇸 English</option>
              <option value="Spanish">🇪🇸 Spanish</option>
              <option value="French">🇫🇷 French</option>
              <option value="German">🇩🇪 German</option>
              <option value="Hindi">🇮🇳 Hindi</option>
              <option value="Chinese">🇨🇳 Chinese</option>
              <option value="Japanese">🇯🇵 Japanese</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={prevStep}
            disabled={isAnimating}
            className={`px-8 py-3 rounded-full font-medium transition-all duration-200 ${
              selectedTheme === 'light'
                ? 'bg-white text-black hover:bg-gray-100'
                : 'bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]'
            }`}
          >
            Back
          </button>

          <button
            onClick={nextStep}
            disabled={isAnimating}
            className={`px-8 py-3 rounded-full font-medium transition-all duration-200 ${
              !isAnimating
                ? `${getButtonColors()} hover:scale-105 cursor-pointer`
                : selectedTheme === 'light'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );

  // Step 4a: Category Selection for College (Engineering, Medical, etc.)
  const CollegeCategoryStep = () => (
    <div className={`transition-all duration-300 ${getTransitionClass()}`}>
      <div className="text-center max-w-4xl mx-auto">
        <h1 className={`text-3xl md:text-4xl font-bold mb-12 ${getTextColor()}`}>
          Which one describes you best?
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { id: 'engineering', label: 'Engineering student', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
            { id: 'medical', label: 'Medical student', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
            { id: 'commerce', label: 'Commerce student', icon: 'M12 14l9-5-9-5-9 5 9 5zm0 7l-9-5 9-5 9 5-9 5z' },
            { id: 'science', label: 'Science student', icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z' },
            { id: 'arts', label: 'Arts / Humanities student', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
            { id: 'other', label: 'Other', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
          ].map((category) => (
            <div
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-200 ${
                selectedCategory === category.id
                  ? selectedTheme === 'light'
                    ? 'border-black bg-gray-100'
                    : 'border-white bg-[#2a2a2a]'
                  : selectedTheme === 'light'
                  ? 'border-gray-300 bg-gray-50 hover:border-gray-400'
                  : 'border-gray-800 bg-[#1a1a1a] hover:border-gray-700'
              }`}
            >
              <div className={`w-10 h-10 mx-auto mb-3 rounded-full flex items-center justify-center ${
                selectedTheme === 'light' ? 'bg-black text-white' : 'bg-white text-black'
              }`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={category.icon} />
                </svg>
              </div>
              <div className={`text-sm font-medium ${getTextColor()}`}>{category.label}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prevStep}
            className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${
              selectedTheme === 'light'
                ? 'bg-white text-black hover:bg-gray-100'
                : 'bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]'
            }`}
          >
            Back
          </button>

          <button
            onClick={nextStep}
            disabled={!selectedCategory || isAnimating}
            className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${
              selectedCategory && !isAnimating
                ? `${getButtonColors()} hover:scale-105 cursor-pointer flex items-center gap-2`
                : selectedTheme === 'light'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            Next
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  // Step 4b: Category Selection for School (JEE, NEET, etc.)
  const SchoolCategoryStep = () => (
    <div className={`transition-all duration-300 ${getTransitionClass()}`}>
      <div className="text-center max-w-4xl mx-auto">
        <h1 className={`text-3xl md:text-4xl font-bold mb-12 ${getTextColor()}`}>
          Which one describes you best?
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { id: 'jee', label: 'JEE aspirant', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
            { id: 'neet', label: 'NEET aspirant', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
            { id: 'cuet', label: 'CUET aspirant', icon: 'M12 14l9-5-9-5-9 5 9 5zm0 7l-9-5 9-5 9 5-9 5z' },
            { id: 'abroad', label: 'Study abroad student', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            { id: 'defence', label: 'Defence / NDA aspirant', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
            { id: 'design', label: 'Design aspirant', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
            { id: 'career', label: 'Exploring career options', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
            { id: 'notsure', label: 'Not sure yet', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
          ].map((category) => (
            <div
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-200 ${
                selectedCategory === category.id
                  ? selectedTheme === 'light'
                    ? 'border-black bg-gray-100'
                    : 'border-white bg-[#2a2a2a]'
                  : selectedTheme === 'light'
                  ? 'border-gray-300 bg-gray-50 hover:border-gray-400'
                  : 'border-gray-800 bg-[#1a1a1a] hover:border-gray-700'
              }`}
            >
              <div className={`w-10 h-10 mx-auto mb-3 rounded-full flex items-center justify-center ${
                selectedTheme === 'light' ? 'bg-black text-white' : 'bg-white text-black'
              }`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={category.icon} />
                </svg>
              </div>
              <div className={`text-sm font-medium ${getTextColor()}`}>{category.label}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prevStep}
            className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${
              selectedTheme === 'light'
                ? 'bg-white text-black hover:bg-gray-100'
                : 'bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]'
            }`}
          >
            Back
          </button>

          <button
            onClick={nextStep}
            disabled={!selectedCategory || isAnimating}
            className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${
              selectedCategory && !isAnimating
                ? `${getButtonColors()} hover:scale-105 cursor-pointer flex items-center gap-2`
                : selectedTheme === 'light'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            Next
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  // Step 5: Pricing Plans
  const PricingStep = () => (
    <div className={`transition-all duration-300 ${getTransitionClass()}`}>
      <div className="text-center max-w-6xl mx-auto">
        <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${getTextColor()}`}>
          Carevo Plans
        </h1>
        <p className={`text-base mb-10 ${getSecondaryTextColor()}`}>
          Choose a plan that fits your learning journey
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-5xl mx-auto">
          {[
            {
              id: 'starter',
              name: 'Starter',
              price: '₹0',
              tag: 'Free forever',
              description: 'Get started with essential tools to explore Carevo.',
              features: [
                'Personalized dashboard',
                'Daily goals and reminders',
                'Basic study planner',
                'Community access'
              ],
              popular: false
            },
            {
              id: 'student',
              name: 'Student',
              price: '₹199',
              per: '/month',
              tag: 'Best for most students',
              description: 'Unlock advanced features to accelerate progress.',
              features: [
                'Smart study plans with insights',
                'AI mentor chat (standard)',
                'Mock tests and analysis',
                'Notes and revision tracker'
              ],
              popular: true
            },
            {
              id: 'pro',
              name: 'Pro',
              price: '₹499',
              per: '/month',
              tag: 'For power users',
              description: 'Everything in Student, plus premium tools.',
              features: [
                'AI mentor chat (pro)',
                'Career roadmap & goals',
                'Advanced analytics',
                'Priority support'
              ],
              popular: false
            }
          ].map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-2 transition-all duration-200 ${
                selectedPlan === plan.id
                  ? selectedTheme === 'light' ? 'border-black' : 'border-white'
                  : selectedTheme === 'light' ? 'border-gray-200' : 'border-gray-800'
              } ${selectedTheme === 'light' ? 'bg-white' : 'bg-[#111111]'}`}
            >
              {plan.popular && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium ${
                  selectedTheme === 'light' ? 'bg-black text-white' : 'bg-white text-black'
                }`}>
                  Most popular
                </div>
              )}

              <div className="p-6">
                {plan.tag && (
                  <div className={`text-xs mb-2 ${getSecondaryTextColor()}`}>{plan.tag}</div>
                )}
                <h3 className={`text-xl font-semibold mb-1 ${getTextColor()}`}>{plan.name}</h3>
                <div className="mb-4 flex items-end justify-center gap-1">
                  <span className={`text-3xl font-bold ${getTextColor()}`}>{plan.price}</span>
                  {plan.per && <span className={`${getSecondaryTextColor()} mb-1`}>{plan.per}</span>}
                </div>
                <p className={`text-sm mb-6 ${getSecondaryTextColor()}`}>{plan.description}</p>

                <ul className="space-y-3 mb-6 text-left">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${selectedTheme === 'light' ? 'text-black' : 'text-white'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={`text-sm ${getTextColor()}`}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full py-3 rounded-full font-medium transition-all duration-200 ${
                    selectedTheme === 'light'
                      ? (selectedPlan === plan.id ? 'bg-gray-900 text-white' : 'bg-black text-white hover:bg-gray-900')
                      : (selectedPlan === plan.id ? 'bg-gray-100 text-black' : 'bg-white text-black hover:bg-gray-100')
                  }`}
                >
                  {selectedPlan === plan.id ? 'Selected' : 'Choose plan'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => {
              alert('Onboarding completed! Welcome to Carevo!');
            }}
            className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${
              selectedTheme === 'light'
                ? 'bg-white text-black border border-gray-300 hover:bg-gray-50'
                : 'bg-[#1a1a1a] text-white border border-gray-800 hover:bg-[#222]'
            }`}
          >
            Skip for now
          </button>

          <button
            onClick={() => {
              alert('Onboarding completed! Welcome to Carevo!');
            }}
            className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${
              selectedTheme === 'light'
                ? 'bg-black text-white hover:bg-gray-900'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );

  if (showSplash) {
    return <SplashScreen onAnimationComplete={() => setShowSplash(false)} />;
  }

  const renderStep = () => {
    if (currentStep === 1) return <ThemeSelectionStep />;
    if (currentStep === 2) return <InstitutionStep />;
    if (currentStep === 3) return <UserInfoStep />;
    if (currentStep === 4) {
      return selectedInstitution === 'college' ? <CollegeCategoryStep /> : <SchoolCategoryStep />;
    }
    if (currentStep === 5 && selectedInstitution === 'school') return <PricingStep />;
    if (currentStep === 5 && selectedInstitution === 'college') return <PricingStep />;
    if (currentStep === 6 && selectedInstitution === 'college') return <PricingStep />;
    return null;
  };

  return (
    <div className={`min-h-screen transition-all duration-500 flex flex-col items-center justify-center p-6 ${getBackgroundColor()}`}>
      <div className="w-full max-w-6xl flex-1 flex flex-col justify-center relative">
        {renderStep()}
        <StepIndicator />
      </div>
    </div>
  );
};

export default OnboardingFlow;