import { Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CardSwap, { Card } from '../../components/card_swap';

// Video imports
import landingVideo1 from '../../assets/landingpagevideo1.mp4';
import landingVideo2 from '../../assets/landingpagevideo2.mp4';
import bgVideo from '../../assets/bgVideo.mp4';
import bgVideo2 from '../../assets/bgVideo2.mp4';
import bgVideo3 from '../../assets/bgVideo3.mp4';

// Image imports
import dashboardImg from '../../assets/ui_ux/dashboard.png';
import chatbotImg from '../../assets/ui_ux/chatbot.jpeg';
import placementImg from '../../assets/ui_ux/placement.png';
import communityImg from '../../assets/ui_ux/community.jpeg';
import notabilityImg from '../../assets/ui_ux/notability.jpeg';




export default function CarevoLanding() {
 const navigate = useNavigate();
 const [expandedFaq, setExpandedFaq] = useState(null);
 const [activeVideoLine, setActiveVideoLine] = useState(0); // 0, 1, or 2

 // Cycle through video lines every 3.5 seconds
 useEffect(() => {
   const interval = setInterval(() => {
     setActiveVideoLine((prev) => (prev + 1) % 3);
   }, 3500);
   return () => clearInterval(interval);
 }, []);

 // Fade-in on scroll for feature section
 useEffect(() => {
   const els = Array.from(document.querySelectorAll('.reveal-on-scroll'));
   if (!('IntersectionObserver' in window) || els.length === 0) return;
   const observer = new IntersectionObserver(
     entries => {
       entries.forEach(entry => {
         if (entry.isIntersecting) {
           entry.target.classList.add('opacity-100', 'translate-y-0');
           entry.target.classList.remove('opacity-0', 'translate-y-6');
           observer.unobserve(entry.target);
         }
       });
     },
     { threshold: 0.15 }
   );
   els.forEach(el => observer.observe(el));
   return () => observer.disconnect();
 }, []);


 // FAQ data
 const faqs = [
   {
     question: "What is Carevo and how does it work?",
     answer: "Carevo is an AI-powered platform that analyzes your academic performance, interests, and personality to provide personalized guidance for your educational and career journey. It helps you make informed decisions about your future."
   },
   {
     question: "Is Carevo free to use?",
     answer: "Yes, Carevo offers a free tier with basic features. We also have premium plans with advanced analytics and personalized recommendations for students who want more comprehensive support."
   },
   {
     question: "How does Carevo protect my data?",
     answer: "We take data privacy seriously. All your information is encrypted and stored securely. We never share your personal data with third parties without your explicit consent."
   },
   {
     question: "Can I use Carevo on my mobile device?",
     answer: "Absolutely! Carevo is fully responsive and works seamlessly on all devices - desktop, tablet, and mobile. You can access your dashboard and get insights anywhere, anytime."
   },
   {
     question: "How accurate are Carevo's recommendations?",
     answer: "Our AI algorithms are continuously trained on educational data and career outcomes. While we can't guarantee specific results, our recommendations are based on proven patterns and are designed to guide you toward better decisions."
   }
 ];


 const toggleFaq = (index) => {
   setExpandedFaq(expandedFaq === index ? null : index);
 };
  return (
  

    

   <div className="min-h-screen bg-gray-50 relative overflow-hidden">
    
    
     {/* Content Container */}
     <div className="relative z-10">
     {/* Header Navigation */}
     <header className="sticky top-0 z-50 bg-gray-50/95 backdrop-blur-sm">
       <nav className="max-w-full mx-auto px-12 py-5 flex items-center justify-between">
         {/* Brand Logo & Navigation */}
         <div className="flex items-center space-x-8">
           <div className="text-xl font-bold text-black">
             Carevo
           </div>


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

     <br />

    {/* Main Content */}
     <main className="max-w-full mx-auto px-12">
         {/* Hero Section */}
        <section className="relative text-center pt-10 pb-8 space-y-6">
          
          
          {/* Orb Background - positioned within hero */}
          {/* <div className="absolute pointer-events-none" style={{ top: '-160px', bottom: '-190px', left: '-300px', right: '-300px' }}>
            <Suspense fallback={<div className="w-full h-full bg-transparent" />}>
              <Orb
              amplitude={2}
              distance={0}
              enableMouseInteraction={true}
              color = {[0,0,0]}
              />
            </Suspense>
          </div> */}

          
          {/* Headline */}
           <h1 className="text-6xl md:text-6xl font-black leading-tight relative z-10 reveal-on-scroll opacity-0 translate-y-6 transition-all duration-700 ease-out" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
             <span className="text-black">The AI That Thinks <br /> Ahead For You</span>
           </h1>
           <hr className="w-[300px] border-t border-gray-200 mx-auto" />
           {/* Supporting Text */}
           <p className="text-xl text-gray-800 font-medium max-w-full mx-auto pt-0 relative z-10 reveal-on-scroll opacity-0 translate-y-6 transition-all duration-700 ease-out" style={{ transitionDelay: '90ms' }}>
             Carevo provides personalized AI guidance for students to navigate 
             <br />
             academics and career choices effortlessly.
           </p>


           {/* CTA Button */}
           <div className="pt-0 relative z-10 reveal-on-scroll opacity-0 translate-y-6 transition-all duration-700 ease-out" style={{ transitionDelay: '160ms' }}>
             <button onClick={() => navigate('/login')} className="inline-flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-xl hover:bg-black transition-colors text-base font-medium">
               <Calendar className="w-4 h-4" />
               <span>Get Started</span>
             </button>
           </div>
         </section>


        <section className="py-4">
         
        {/* Large White Container */}
           <div className="bg-gray-50 rounded-3xl shadow-lg max-w-5xl mx-auto overflow-hidden reveal-on-scroll opacity-0 translate-y-6 transition-all duration-700 ease-out" style={{ minHeight: '600px' }}>
             <video
               autoPlay
               loop
               muted
               playsInline
               className="w-full h-full object-cover"
               style={{ minHeight: '600px' }}
               >
               <source src={landingVideo1} type="video/mp4" />
               Your browser does not support the video tag.
             </video>
           </div>
      
           
          </section>

           <br /><br /><br /><br /><br /><br />

       {/* Feature Showcase Section */}
       <section className="py-20 bg-gray-50">
         <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
             
             {/* Left Column - Student Profiling */}
            <div className="space-y-4 reveal-on-scroll opacity-0 translate-y-6 transition-all duration-700 ease-out">
              <h2 className="text-3xl md:text-4xl font-medium text-gray-900">Student AI Profiling</h2>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                Before every academic or career decision, Carevo collects and analyzes your scores, 
                interests, strengths, and personality traits to understand you better.
              </p>
               <div className="h-[480px] w-full mt-6">
               <div className="bg-white shadow-md rounded-lg overflow-hidden">
                 <img src={dashboardImg} alt="Visualization" className="w-full h-auto" />
               </div>
               </div>
             </div>

             {/* Right Column - Personalized Insights */}
            <div className="space-y-4 reveal-on-scroll opacity-0 translate-y-6 transition-all duration-700 ease-out" style={{ transitionDelay: '120ms' }}>
              <h2 className="text-3xl md:text-4xl font-medium text-gray-900">Personalized AI Guidance</h2>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                After every assessment or interaction, Carevo generates actionable advice 
                and guidance based on your learning style, goals, and progress.
              </p>
               <div className="h-[480px] w-full mt-6">
               <div className="bg-white shadow-md rounded-lg overflow-hidden">
                 <img src={chatbotImg} alt="Visualization" className="w-full h-auto" />
               </div>
               </div>
               
             </div>
           </div>
         </div>
        </section>


       {/* Hero Section with Background Text */}
       <section className="min-h-[70vh] flex items-start py-20">
         <div className="relative max-w-screen-xl mx-auto px-8 w-full">
           {/* Foreground Content */}
           <div className="relative reveal-on-scroll opacity-0 translate-y-6 transition-all duration-700 ease-out" style={{ zIndex: 10 }}>
             <h1
               className="font-semibold text-black mb-6 -ml-6"
               style={{ fontSize: '35px' }}
             >
               It's time to find clarity.
             </h1>


             {/* Background Text Layer */}
             <div style={{ position: 'relative', marginLeft: '-2rem', marginBottom: '3rem' }}>
               {/* First line - Academics. Careers. */}
              {activeVideoLine === 0 ? (
                <svg width="1100" height="140" style={{ display: 'block' }}>
                   <defs>
                     <mask id="textMask1">
                       <rect width="100%" height="100%" fill="black" />
                       <text
                         x="0"
                         y="100"
                         fontSize="100"
                         fontWeight="bold"
                         fill="white"
                         fontFamily="system-ui, -apple-system, sans-serif"
                       >
                         Academics. Careers.
                       </text>
                     </mask>
                   </defs>
                   <foreignObject width="100%" height="100%" mask="url(#textMask1)">
                     <video
                       autoPlay
                       loop
                       muted
                       playsInline
                       style={{
                         width: '100%',
                         height: '100%',
                         objectFit: 'cover'
                       }}
                     >
                       <source src={bgVideo} type="video/mp4" />
                     </video>
                   </foreignObject>
                 </svg>
               ) : (
                 <div style={{ 
                   fontSize: '100px', 
                   fontWeight: 'bold', 
                   color: '#D1D5DB',
                   lineHeight: '140px',
                   fontFamily: 'system-ui, -apple-system, sans-serif',
                   transition: 'opacity 0.5s ease-in-out'
                 }}>
                   Academics. Careers.
                 </div>
               )}

               {/* Second line - Skills. Mental Health. */}
              {activeVideoLine === 1 ? (
                <svg width="1200" height="140" style={{ display: 'block' }}>
                   <defs>
                     <mask id="textMask2">
                       <rect width="100%" height="100%" fill="black" />
                       <text
                         x="0"
                         y="100"
                         fontSize="100"
                         fontWeight="bold"
                         fill="white"
                         fontFamily="system-ui, -apple-system, sans-serif"
                       >
                         Skills. Mental Health.
                       </text>
                     </mask>
                   </defs>
                   <foreignObject width="100%" height="100%" mask="url(#textMask2)">
                     <video
                       autoPlay
                       loop
                       muted
                       playsInline
                       style={{
                         width: '100%',
                         height: '100%',
                         objectFit: 'cover'
                       }}
                     >
                       <source src={bgVideo2} type="video/mp4" />
                     </video>
                   </foreignObject>
                 </svg>
               ) : (
                 <div style={{ 
                   fontSize: '100px', 
                   fontWeight: 'bold', 
                   color: '#D1D5DB',
                   lineHeight: '140px',
                   fontFamily: 'system-ui, -apple-system, sans-serif',
                   transition: 'opacity 0.5s ease-in-out'
                 }}>
                   Skills. Mental Health.
                 </div>
               )}

               {/* Third line - Really everything. */}
              {activeVideoLine === 2 ? (
                <svg width="1100" height="140" style={{ display: 'block' }}>
                   <defs>
                     <mask id="textMask3">
                       <rect width="100%" height="100%" fill="black" />
                       <text
                         x="0"
                         y="100"
                         fontSize="100"
                         fontWeight="bold"
                         fill="white"
                         fontFamily="system-ui, -apple-system, sans-serif"
                       >
                         Really everything.
                       </text>
                     </mask>
                   </defs>
                   <foreignObject width="100%" height="100%" mask="url(#textMask3)">
                     <video
                       autoPlay
                       loop
                       muted
                       playsInline
                       style={{
                         width: '100%',
                         height: '100%',
                         objectFit: 'cover'
                       }}
                     >
                       <source src={bgVideo3} type="video/mp4" />
                     </video>
                   </foreignObject>
                 </svg>
               ) : (
                 <div style={{ 
                   fontSize: '100px', 
                   fontWeight: 'bold', 
                   color: '#D1D5DB',
                   lineHeight: '140px',
                   fontFamily: 'system-ui, -apple-system, sans-serif',
                   transition: 'opacity 0.5s ease-in-out'
                 }}>
                   Really everything.
                 </div>
               )}
             </div>

             {/* Button */}
             <button onClick={() => navigate('/login')} className="flex items-center space-x-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-black transition-colors text-sm font-medium -ml-8">
               <Calendar className="w-4 h-4" />
               <span className="text-sm">Get Started</span>
             </button>
           </div>
         </div>
       </section>

<br />
       {/* Your Academic Companion Section */}
       <section className="py-8 bg-gray-50">
         <div className="max-w-full mx-auto px-10">

          <div className="relative rounded-3xl bg-white border border-gray-200 p-8 md:p-14 overflow-hidden max-w-6xl mx-auto min-h-[600px] reveal-on-scroll opacity-0 translate-y-6 transition-all duration-700 ease-out">
            <div className="relative z-10 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-gray-100 text-[11px] text-gray-600">
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                Placement • Community • Notability
              </div>
              <h3 className="mt-5 text-3xl md:text-5xl font-black tracking-tight text-gray-900">
                Your journey, organized in one place
              </h3>
              <p className="mt-3 text-gray-600 text-sm md:text-base">
                Track placements and applications, learn with your community, and capture notes that turn into action — without leaving Carevo
              </p>
            </div>

            <CardSwap cardDistance={60} verticalDistance={70} delay={5000} pauseOnHover={false}>
              <Card customClass="w-[520px] h-[360px] shadow-2xl border-white/20 overflow-hidden bg-black">
                <div className="h-full w-full rounded-xl overflow-hidden border border-white/10 bg-black">
                  <div className="flex items-center gap-2 px-4 py-2 text-xs text-gray-300 bg-white/5 border-b border-white/10">
                    <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                    <span>Placement</span>
                  </div>
                  <img src={placementImg} alt="Academic Companion" className="w-full h-full object-cover" />
                </div>
              </Card>
              <Card customClass="w-[520px] h-[360px] shadow-2xl border-white/20 overflow-hidden bg-black">
                <div className="h-full w-full rounded-xl overflow-hidden border border-white/10 bg-black">
                  <div className="flex items-center gap-2 px-4 py-2 text-xs text-gray-300 bg-white/5 border-b border-white/10">
                    <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                    <span>Community</span>
                  </div>
                  <img src={communityImg} alt="Academic Companion" className="w-full h-full object-cover" />
                </div>
              </Card>
              <Card customClass="w-[520px] h-[360px] shadow-2xl border-white/20 overflow-hidden bg-black">
                <div className="h-full w-full rounded-xl overflow-hidden border border-white/10 bg-black">
                  <div className="flex items-center gap-2 px-4 py-2 text-xs text-gray-300 bg-white/5 border-b border-white/10">
                    <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                    <span>Notability</span>
                  </div>
                  <img src={notabilityImg} alt="Academic Companion" className="w-full h-full object-cover" />
                </div>
              </Card>
            </CardSwap>
          </div>

        </div>
       </section>
           


       {/* Unlock Potential Section */}
       <section className="py-24">
         <div className="max-w-screen-xl mx-auto px-12">
           <div className="text-center space-y-6 mb-12 reveal-on-scroll opacity-0 translate-y-6 transition-all duration-700 ease-out">
             {/* Top Tagline */}
             <p className="text-xl font-semibold text-purple-500">
               Your potential is greater than you realize.
             </p>
            
             {/* Main Heading */}
             <h2 className="text-5xl md:text-6xl font-black text-gray-900 whitespace-nowrap" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
               Carevo helps you unlock it
             </h2>
             <hr className="w-[840px] border-t border-gray-300 mx-auto" />


             {/* Supporting Paragraph */}
             <p className="text-base md:text-lg text-gray-800 max-w-3xl mx-auto leading-relaxed">
               Beyond grades, Carevo helps you track achievements, develop key skills, and build a clear and confident sense of your strengths.
             </p>
           </div>
          
           {/* Large White Container */}
           <div className="bg-gray-50 rounded-3xl shadow-lg max-w-5xl mx-auto overflow-hidden reveal-on-scroll opacity-0 translate-y-6 transition-all duration-700 ease-out" style={{ minHeight: '460px' }}>
             <video
               autoPlay
               loop
               muted
               playsInline
               className="w-full h-full object-cover"
               style={{ minHeight: '460px' }}
             >
               <source src={landingVideo2} type="video/mp4" />
               Your browser does not support the video tag.
             </video>
           </div>
         </div>
       </section>


       {/* FAQ Section */}
       <section className="py-20 bg-gray-50">
         <div className="max-w-full mx-auto px-12 ml-6">
           {/* Section Title */}
           <h2 className="text-3xl font-bold text-gray-900 mb-6 reveal-on-scroll opacity-0 translate-y-6 transition-all duration-700 ease-out">
            Frequently asked questions
           </h2>


           {/* FAQ List */}
           <div className="divide-y divide-gray-200">
             {faqs.map((faq, index) => (
               <div key={index} className="transition-all duration-200">
                 {/* Question */}
                 <button
                   onClick={() => toggleFaq(index)}
                   className="w-full flex items-center justify-between px-6 py-5 text-left transition-colors"
                 >
                   <span className="text-base md:text-lg font-medium text-gray-900 pr-8 -ml-6">
                     {faq.question}
                   </span>
                   <svg
                     className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${
                       expandedFaq === index ? 'rotate-180' : ''
                     }`}
                     fill="none"
                     viewBox="0 0 24 24"
                     stroke="currentColor"
                   >
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                   </svg>
                 </button>


                 {/* Answer */}
                 {expandedFaq === index && (
                   <div className="px-6 pb-5 pt-0">
                     <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                       {faq.answer}
                     </p>
                   </div>
                 )}
               </div>
             ))}
           </div>
         </div>
       </section>


       {/* Call-to-Action Section */}
       <section className="py-20">
         <div className="max-w-screen-xl mx-auto px-12">
           <h2 className="text-2xl md:text-3xl font-medium text-gray-900 mb-4 whitespace-nowrap -ml-12">
             Your AI mentor that guides during your journey, not after.
           </h2>
           <h2 className="text-sm md:text-3xl font-medium text-gray-600 mb-8 -ml-12">
             Start shaping your future with Carevo today.
           </h2>
           <button onClick={() => navigate('/login')} className="flex items-center space-x-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-black transition-colors text-sm font-medium, -ml-12">
            <Calendar className="w-4 h-4" />
            <span>Get Started</span>
          </button>
         </div>
       </section>
     </main>
<br /><br /><br /><br /><br /><br /><br />

     {/* Footer */}
     <hr className="w-5/6 border-t border-gray-300 mx-auto" />
     <footer className="bg-gray-50 py-16 px-12">
       <div className="max-w-screen-xl mx-auto">
         <div className="flex flex-col lg:flex-row gap-12 mb-8">
           {/* Carevo Logo */}
           <div className="lg:w-1/4">
             <div className="text-3xl font-bold text-gray-900 mb-4">
               Carevo
             </div>
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
           <div className="text-gray-500 mb-4 md:mb-0">
             © 2025 Carevo. All rights reserved.
           </div>


           {/* Social Media Icons */}
           <div className="flex gap-4">
             <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
               </svg>
             </a>
             <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.919-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
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
   </div>
 );
};
