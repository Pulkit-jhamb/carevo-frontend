import React, { useState } from 'react';
import { Check, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      period: '',
      buttonText: 'Get Started',
      buttonStyle: 'bg-gray-900 text-white hover:bg-black',
      features: [
        'Personalized AI guidance (limited)',
        'Student profiling basics',
        'Starter study plans',
        'Progress tracking dashboard (basic)'
      ]
    },
    {
      name: 'Pro',
      price: '₹300',
      period: '/ month',
      buttonText: 'Upgrade to Pro',
      buttonStyle: 'bg-gray-900 text-white hover:bg-black',
      subtitle: 'Full access for ambitious learners.',
      sectionTitle: 'Everything in Starter, plus',
      features: [
        'Unlimited AI guidance and Q&A',
        'Advanced student profiling & insights',
        'Adaptive study plans with reminders',
        'Skill & career roadmap suggestions',
        'Detailed analytics dashboard'
      ]
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      buttonText: 'Talk to Sales',
      buttonStyle: 'bg-blue-500 text-white hover:bg-blue-600',
      subtitle: 'Solutions for schools, colleges, and institutions.',
      sectionTitle: 'Everything in Pro, plus',
      features: [
        'Admin analytics and cohort insights',
        'Curriculum-aligned guidance modules',
        'Multi-tenant dashboards & role-based access',
        'SSO/IDP integration and enterprise security',
        'Dedicated onboarding and support'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation (same as landing page) */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
        <nav className="max-w-full mx-auto px-12 py-5 flex items-center justify-between">
          {/* Brand Logo & Navigation */}
          <div className="flex items-center space-x-8">
            <div onClick={() => navigate('/')} className="text-xl font-bold text-black cursor-pointer">Carevo</div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-8">
              <a
                onClick={() => navigate('/product')}
                className="text-gray-900 text-sm hover:text-black transition-colors cursor-pointer"
              >
                Product
              </a>
              <a
                onClick={() => navigate('/pricing')}
                className="text-gray-900 text-sm hover:text-black transition-colors cursor-pointer"
              >
                Pricing
              </a>
            </div>
          </div>

          {/* CTA Button */}
          <button onClick={() => navigate('/login')} className="flex items-center space-x-2 bg-gray-900 text-white px-5 py-2.5 rounded-md hover:bg-black transition-colors text-sm font-medium">
            <Calendar className="w-4 h-4" />
            <span>Get Started for Free</span>
          </button>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto py-20 px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
            Start Carevo for free.
          </h1>
          <p className="text-gray-700 text-lg mb-8">
            Get AI-powered academic guidance, adaptive study plans, and a clean dashboard to track your progress.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-full p-1 shadow-sm">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annually')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === 'annually'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annually
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              {/* Plan Header */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && (
                    <span className="text-gray-500 ml-2">{plan.period}</span>
                  )}
                </div>
                <button
                  className={`w-full py-3 px-6 rounded-xl font-medium transition-colors ${plan.buttonStyle}`}
                >
                  {plan.buttonText}
                </button>
              </div>

              {/* Subtitle */}
              {plan.subtitle && (
                <p className="text-sm text-gray-600 mb-6">{plan.subtitle}</p>
              )}

              {/* Features */}
              <div>
                {plan.sectionTitle && (
                  <p className="text-sm font-medium text-gray-900 mb-4">{plan.sectionTitle}</p>
                )}
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr className="w-5/6 border-t border-gray-300 mx-auto" />
      <footer className="bg-gray-50 py-16 px-12">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 mb-8">
            <div className="lg:w-1/4">
              <div className="text-3xl font-bold text-gray-900 mb-4">
                Carevo
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gray-200 rounded-md px-3 py-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-xs text-gray-600">All systems operational</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:w-3/4">
              <div>
                <h3 className="text-gray-900 font-semibold text-sm mb-4">Use Cases</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Sales</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Support</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Consulting</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Recruiting</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-gray-900 font-semibold text-sm mb-4">Enterprise</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Carevo for Enterprise</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Enterprise Guides</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Security</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Vendor Profile</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">ROI Calculator</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Book A Demo</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-gray-900 font-semibold text-sm mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Manifesto</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Press</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Careers</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Bug Bounty</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-gray-900 font-semibold text-sm mb-4">Support</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Help Center</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Contact Us</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-gray-900 font-semibold text-sm mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Terms of Service</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Data Processing Agreement</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Subprocessors</a></li>
                </ul>
              </div>
            </div>
          </div>

          <hr className="border-gray-300 mb-8" />

          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <div className="text-gray-500 mb-4 md:mb-0">
              &copy; 2025 Carevo. All rights reserved.
            </div>

            <div className="flex gap-4">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;