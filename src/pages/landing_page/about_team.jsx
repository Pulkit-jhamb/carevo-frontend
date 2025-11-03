import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import pulkitImg from '../../assets/pulkit.png';
import kartikImg from '../../assets/kartik_dp.jpg';
import harshitImg from '../../assets/harshit1.png';

export default function AboutTeam() {
  const navigate = useNavigate();
  const team = [
    {
      name: "Pulkit Jhamb",
      role: "CEO",
      bio: "Leads product vision and strategy at Carevo.",
      img: pulkitImg,
      style: { transform: 'scale(1.15)' },
      linkedin: "https://www.linkedin.com/in/pulkit-jhamb-7766ab2b3/",
      instagram: "#",
    },
    {
      name: "Kartik Malik",
      role: "CTO",
      bio: "Oversees engineering and AI systems.",
      img: kartikImg,

      linkedin: "#",
      instagram: "#",
    },
    {
      name: "Harshit Dua",
      role: "CMO and Design Head",
      bio: "Drives growth, brand and design.",
      img: harshitImg,
      linkedin: "#",
      instagram: "#",
    },
    {
      name: "Riya Mehta",
      role: "Head of Engineering",
      bio: "Builds reliable, scalable experiences.",
      img: "https://i.pravatar.cc/300?img=47",
      linkedin: "#",
      instagram: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Header Navigation (same as landing page) */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
        <nav className="max-w-full mx-auto px-12 py-5 flex items-center justify-between">
          {/* Brand Logo & Navigation */}
          <div className="flex items-center space-x-8">
            <div onClick={() => navigate('/')} className="text-xl font-bold text-black cursor-pointer">Carevo</div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-8">
              <a
                onClick={() => navigate('/about-team')}
                className="text-gray-900 text-sm hover:text-black transition-colors cursor-pointer"
              >
                About Team
              </a>
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

      {/* Page content */}
      <section className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-center text-black mb-10">Our Team</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((m, i) => (
              <article
                key={i}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center hover:shadow-md transition-shadow"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden shadow mb-5 ring-1 ring-black/5">
                  <img
                    src={m.img}
                    alt={m.name}
                    className="w-full h-full object-cover object-center"
                    style={m.style}
                    loading="lazy"
                  />
                </div>
                <h3 className="text-[17px] font-semibold text-gray-900">{m.name}</h3>
                <p className="text-gray-600 text-sm mt-2">{m.role}</p>
                <p className="text-gray-500 text-sm mt-4 leading-relaxed max-w-[230px]">{m.bio}</p>

                <div className="flex items-center gap-4 mt-6">
                <a href={m.linkedin} aria-label="LinkedIn" className="text-sky-700 hover:text-sky-800" target="_blank" rel="noreferrer noopener">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8.98h5V24H0V8.98zm7.5 0h4.8v2.05h.07c.67-1.27 2.3-2.6 4.73-2.6 5.06 0 6 3.33 6 7.66V24h-5v-6.63c0-1.58-.03-3.62-2.2-3.62-2.2 0-2.53 1.72-2.53 3.5V24h-5V8.98z"/>
                  </svg>
                </a>
                <a href={m.instagram} aria-label="Instagram" className="text-pink-600 hover:text-pink-700" target="_blank" rel="noreferrer noopener">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h10zm-5 3a5 5 0 1 0 .001 10.001A5 5 0 0 0 12 7zm0 2.5a2.5 2.5 0 1 1-.001 5.001A2.5 2.5 0 0 1 12 9.5zM18 6.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                  </svg>
                </a>
              </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <br /><br /><br /><br />

      {/* Footer (same as landing page) */}
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
            <div className="text-gray-500 mb-4 md:mb-0"> 2025 Carevo. All rights reserved.</div>

            {/* Social Media Icons */}
            <div className="flex gap-4">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
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