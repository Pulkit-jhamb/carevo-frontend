import React from "react";

function Navbar() {
  return (
    <div className="sticky top-0 z-50 w-full px-2" style={{ zIndex: 50 }}>
      <div className="rounded-3xl shadow-lg bg-white border-b border-gray-200 w-full">
        <nav className="flex items-center justify-between px-8 py-3">
      {/* Logo and Brand */}
      <div className="flex items-center space-x-4">
        <span className="font-bold text-xl tracking-tight text-gray-900 flex items-center">
          Carevo
        </span>
      </div>
      {/* Navigation Links */}
      <div className="flex-1 flex justify-center">
        <div className="flex items-center gap-16">
          <a href="#home" className="text-gray-700  text-base font-medium  hover:text-black transition">Home</a>
          <a href="#product" className="text-gray-700  text-base font-medium hover:text-black transition">Product</a>
          <a href="#pricing" className="text-gray-700 text-base font-medium hover:text-black transition">Pricing</a>
        </div>
      </div>
      {/* Navigation Buttons */}
      <div className="flex items-center space-x-3">
        <a href="/login">
          <button className="bg-white  hover:bg-green text-black text-sm font-semibold px-5 py-2 rounded-full transition shadow">
            Login
          </button>
        </a>
        <a href="/signup">
          <button className="bg-black hover:bg-black text-white text-sm font-semibold px-5 py-2 rounded-full transition shadow">
            Sign In
          </button>
        </a>
      </div>
        </nav>
      </div>
    </div>
  );
}

// Remove photos from the code: (Assuming "photos" refers to any image/photo elements in the rest of the file, so do not render any <img> or similar elements.)

const benefits = [
  {
    icon: (
      <span className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-xl mb-6">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z" />
          <path d="M15.5 11.5a3.5 3.5 0 01-7 0" />
        </svg>
      </span>
    ),
    title: "Personalized Career Plans",
    desc: "Get AI-generated career roadmaps tailored to your interests, skills, and academic performance.",
  },
  {
    icon: (
      <span className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-xl mb-6">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <path d="M8 17v-6M12 17v-2M16 17v-4" />
        </svg>
      </span>
    ),
    title: "Real-Time Academic Dashboard",
    desc: "Track your progress, identify weak areas, and get personalized study recommendations.",
  },
  {
    icon: (
      <span className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-xl mb-6">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="8" />
          <path d="M12 8.5c-1.5 0-2.5 1.2-2.5 2.5 0 2 2.5 4.5 2.5 4.5s2.5-2.5 2.5-4.5c0-1.3-1-2.5-2.5-2.5z" />
        </svg>
      </span>
    ),
    title: "Mental Health Support During Exams",
    desc: "Access stress management tools, meditation guides, and counseling support when you need it most.",
  },
];

const testimonials = [
  {
    name: "Aarav S.",
    quote:
      "Carevo helped me choose the right stream after 10th. The dashboard kept me motivated throughout the year.",
  },
  {
    name: "Priya M.",
    quote:
      "The mental health support was a lifesaver during my board exams. I felt heard and supported.",
  },
];

const plans = [
  {
    name: "Free Plan",
    subtitle: "Perfect to get started",
    price: "₹0",
    per: "/month",
    features: [
      "Basic career assessment",
      "Study tips and resources",
      "Community access",
    ],
    button: "Get Started",
    highlight: false,
  },
  {
    name: "Standard Plan",
    subtitle: "Career plan + dashboard",
    price: "₹499",
    per: "/month",
    features: [
      "Everything in Free",
      "Personalized career roadmap",
      "Academic progress tracking",
      "Monthly counseling session",
    ],
    button: "Get Started",
    highlight: true,
    badge: "Most Popular",
  },
  {
    name: "Premium Plan",
    subtitle: "All features + 24/7 support",
    price: "₹999",
    per: "/month",
    features: [
      "Everything in Standard",
      "24/7 mental health support",
      "Weekly counseling sessions",
      "Parent dashboard access",
      "Priority support",
    ],
    button: "Get Started",
    highlight: false,
  },
];

function Landing_page() {   
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f9fb] via-[#e0e7ef] to-[#c7d2fe] font-sans text-black scroll-smooth relative">
      {/* Decorative abstract shapes */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-purple-100 rounded-full opacity-30 blur-3xl -z-10" style={{ filter: 'blur(100px)', top: '-6rem', left: '-6rem' }} />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-blue-100 rounded-full opacity-30 blur-3xl -z-10" style={{ filter: 'blur(100px)', bottom: '-6rem', right: '-6rem' }} />

      <Navbar />
      
      {/* Header Section */}
      <section id="home" className="flex flex-col items-center justify-center px-6 md:px-20 pt-24 pb-16 max-w-4xl mx-auto min-h-[60vh] text-center">
        <div className="flex flex-col items-center justify-center w-full max-w-xl gap-6">
<br />
          <h1 className="text-center text-4xl md:text-6xl font-extrabold leading-[1.1] mb-4 text-black">
            Confused About Your Future? We're Here to Guide You.
          </h1>
          <p className="text-lg md:text-2xl font-normal text-gray-600 mb-6 max-w-lg">
            Carevo helps students in India make smarter academic and career decisions with AI-powered counseling.
          </p>
          <div className="flex flex-row gap-4 mb-8 w-full justify-center">
            
            <a href="/login">
              <button className="flex items-center bg-black text-white px-6 py-4 rounded-lg font-semibold text-base hover:bg-gray-900 transition w-fit">
                Get Started
                <span className="ml-2">
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </button>
            </a>
            
          </div>

        </div>
      </section>

      <br /><br /><br /><br /><br />

      {/* Product Benefits */}
      <section id="product" className="w-full bg-[#f7f9fb] py-20 px-4">
        <br /><br />
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-4">Everything You Need to Succeed</h2>
          <p className="text-lg md:text-xl text-gray-500 text-center mb-14 max-w-2xl mx-auto">Our AI-powered platform provides comprehensive support for your academic and career journey.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((b) => (
              <div key={b.title} className="bg-white rounded-2xl shadow-md flex flex-col items-center px-8 py-10 text-center">
                {b.icon}
                <h3 className="text-xl font-bold mb-2">{b.title}</h3>
                <p className="text-gray-500 text-base">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <br />
      </section>



      {/* Pricing Plans */}
      <section id="pricing" className="w-full bg-[#f7f9fb] py-20 px-4">
        <br /><br />
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-4">Choose Your Plan</h2>
          <p className="text-lg md:text-xl text-gray-500 text-center mb-14 max-w-2xl mx-auto">Start free and upgrade as you grow</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, idx) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl shadow-md flex flex-col items-center px-8 py-10 text-center border transition-all duration-300 ${plan.highlight ? 'border-2 border-black scale-105 z-10' : 'border border-gray-200'}`}
              >
                {plan.badge && (
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-bold px-4 py-1 rounded-full shadow">{plan.badge}</span>
                )}
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <div className="text-gray-500 text-base mb-2">{plan.subtitle}</div>
                <div className="flex items-end justify-center mb-2">
                  <span className="text-3xl font-extrabold text-black">{plan.price}</span>
                  <span className="text-lg text-gray-700 font-medium ml-1">{plan.per}</span>
                </div>
                <ul className="mb-6 space-y-2 text-left w-full max-w-xs mx-auto">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center text-base text-gray-800">
                      <svg width="20" height="20" fill="none" stroke="#22c55e" strokeWidth="2.2" viewBox="0 0 24 24" className="mr-2"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-2 rounded-md font-semibold text-base border transition-all duration-200 ${plan.highlight ? 'bg-black text-white border-black hover:bg-gray-900' : 'bg-white text-black border-black hover:bg-gray-100'}`}
                >
                  {plan.button}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-black border-t border-gray-900 py-10 px-4 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Brand and tagline */}
          <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
            <span className="font-bold text-2xl text-white mb-2 flex items-center">
              Carevo
            </span>
            <span className="text-gray-300 text-sm max-w-xs text-center md:text-left">
              Empowering students with personalized career and academic guidance.
            </span>
          </div>
          {/* Footer navigation */}
          <div className="flex flex-col md:flex-row gap-8">
            <div>
              <h4 className="font-semibold text-white mb-2">Product</h4>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#testimonials" className="hover:text-white transition">Testimonials</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Company</h4>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li><a href="#about" className="hover:text-white transition">About</a></li>
                <li><a href="#contact" className="hover:text-white transition">Contact</a></li>
                <li><a href="#careers" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Resources</h4>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li><a href="#blog" className="hover:text-white transition">Blog</a></li>
                <li><a href="#faq" className="hover:text-white transition">FAQ</a></li>
                <li><a href="#support" className="hover:text-white transition">Support</a></li>
              </ul>
            </div>
          </div>
          {/* Social links */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <div className="flex space-x-4 mb-2">
              <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-400 hover:text-white transition">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M22 5.92a8.38 8.38 0 01-2.36.65A4.13 4.13 0 0021.4 4.1a8.19 8.19 0 01-2.6 1A4.1 4.1 0 0012 8.09c0 .32.04.64.1.94A11.65 11.65 0 013 4.89a4.07 4.07 0 001.27 5.47A4.07 4.07 0 012.8 9.1v.05a4.1 4.1 0 003.29 4.02c-.3.08-.62.13-.95.13-.23 0-.45-.02-.67-.06a4.1 4.1 0 003.83 2.85A8.23 8.23 0 012 19.54a11.62 11.62 0 006.29 1.84c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0022 5.92z" /></svg>
              </a>
              <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-black transition">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
              </a>
              <a href="mailto:support@carevo.com" aria-label="Email" className="text-gray-400 hover:text-black transition">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 4h16v16H4V4zm0 0l8 8 8-8" /></svg>
              </a>
            </div>
            <span className="text-xs text-gray-400">&copy; {new Date().getFullYear()} Carevo. All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* Subtle Animations */}
      <style>
        {`
          html { scroll-behavior: smooth; }
          .animate-fade-in {
            opacity: 0;
            transform: translateY(20px);
            animation: fadeInUp 0.7s forwards;
          }
          .animate-fade-in.delay-100 { animation-delay: 0.1s; }
          .animate-fade-in.delay-200 { animation-delay: 0.2s; }
          .animate-bounce-in {
            animation: bounceIn 0.7s;
          }
          @keyframes fadeInUp {
            to {
              opacity: 1;
              transform: none;
            }
          }
          @keyframes bounceIn {
            0% {
              opacity: 0;
              transform: scale(0.8);
            }
            60% {
              opacity: 1;
              transform: scale(1.05);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>
    </div>
  );
}

export default Landing_page;
