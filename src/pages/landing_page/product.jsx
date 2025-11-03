import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import landingVideo1 from '../../assets/landingpagevideo1.mp4';
import landingVideo2 from '../../assets/landingpagevideo2.mp4';

export default function ProductPage() {
  const navigate = useNavigate();

  const useCases = [
    {
      title: 'Study Plans',
      description:
        'Adaptive, day-by-day plans that adjust to your pace and remind you what to do next — no more guesswork.',
      iconBg: 'bg-indigo-50',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-indigo-600">
          <path d="M4 4h16v2H4V4zm0 4h10v2H4V8zm0 4h16v2H4v-2zm0 4h10v2H4v-2z"/>
        </svg>
      )
    },
    {
      title: 'Exam Prep',
      description:
        'Targeted practice and AI explanations based on your weak areas so you improve where it matters most.',
      iconBg: 'bg-rose-50',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-rose-600">
          <path d="M12 2l4 8 8 1-6 6 1 9-7-4-7 4 1-9-6-6 8-1 4-8z"/>
        </svg>
      )
    },
    {
      title: 'Career Roadmaps',
      description:
        'From your interests and scores to skills and roles — get a clear, personalized path to your career goals.',
      iconBg: 'bg-gray-100',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-600">
          <path d="M3 12h4l3 7 4-14 3 7h4"/>
        </svg>
      )
    },
    {
      title: 'Wellness Check-ins',
      description:
        'Lightweight mental wellness tracking and nudges so you stay balanced while you push forward.',
      iconBg: 'bg-blue-50',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-600">
          <path d="M12 21s-6-4.35-6-9a6 6 0 1112 0c0 4.65-6 9-6 9z"/>
        </svg>
      )
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

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 md:px-12">
        <section className="pt-16 md:pt-24 pb-10">
          <p className="text-xs font-semibold text-blue-600 tracking-widest mb-3">PRODUCT</p>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight max-w-4xl">
            The AI that guides your academics and career – every step of the way.
          </h1>
          <p className="text-gray-700 text-lg mt-5 max-w-2xl">
            Carevo profiles you, plans your study routine, explains tough concepts, and turns progress into clear insights.
          </p>

          {/* Right CTA pill (mimic floating) */}
          <div className="mt-6">
            <button onClick={() => navigate('/login')} className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-[0_8px_16px_rgba(59,130,246,0.35)]">
              Get started free
            </button>
          </div>

          {/* Rounded video container */}
          <div className="mt-10 rounded-3xl overflow-hidden shadow-xl border border-gray-100">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              style={{ minHeight: '520px' }}
            >
              <source src={landingVideo2} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </section>

        {/* Use cases list */}
        <section className="pt-10 md:pt-20 pb-8">
          <p className="text-sm font-semibold text-blue-600 mb-2">Built for real student moments</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-8 max-w-3xl">
            Carevo helps you focus, practice, plan, and progress.
          </h2>

          <div className="divide-y divide-gray-200 rounded-2xl bg-white">
            {useCases.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-6 py-5 px-4 md:px-6 hover:bg-gray-100/70 transition-colors rounded-xl"
              >
                <div className={`w-10 h-10 ${item.iconBg} rounded-xl flex items-center justify-center shadow-sm`}>{item.icon}</div>
                <div className="flex-1">
                  <div className="text-gray-900 font-medium">{item.title}</div>
                  <div className="text-gray-600 text-sm mt-1 max-w-3xl">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Insights section */}
        <section className="pt-16 md:pt-24 pb-20">
          <p className="text-blue-600 text-sm font-medium mb-3">Stay on track</p>
          <h3 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight max-w-4xl mb-8">
            Understand your progress, and get actionable next steps.
          </h3>

          <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              style={{ minHeight: '520px' }}
            >
              <source src={landingVideo1} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </section>
      </main>

      {/* Footer (same as landing/pricing) */}
      <hr className="w-3/4 border-t border-gray-300 mx-auto" />
      <footer className="bg-gray-50 py-16 px-12">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 mb-8">
            {/* Carevo Logo */}
            <div className="lg:w-1/4">
              <div className="text-3xl font-bold text-gray-900 mb-4">Carevo</div>
              {/* System Status Indicator */}
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gray-200 rounded-md px-3 py-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-xs text-gray-600">All systems operational</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Link Columns */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:w-3/4">
              {/* Use Cases */}
              <div>
                <h3 className="text-gray-900 font-semibold text-sm mb-4">Use Cases</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Sales</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Support</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Consulting</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Recruiting</a></li>
                </ul>
              </div>

              {/* Enterprise */}
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

              {/* Resources */}
              <div>
                <h3 className="text-gray-900 font-semibold text-sm mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Manifesto</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Press</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Careers</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Bug Bounty</a></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="text-gray-900 font-semibold text-sm mb-4">Support</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Help Center</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Contact Us</a></li>
                </ul>
              </div>

              {/* Legal */}
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
            {/* Copyright */}
            <div className="text-gray-500 mb-4 md:mb-0">© 2025 Carevo. All rights reserved.</div>

            {/* Social Media Icons */}
            <div className="flex gap-4">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.919-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/></svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
