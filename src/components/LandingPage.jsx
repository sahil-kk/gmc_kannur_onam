import { useState, useEffect, useRef } from 'react';
import EntryForm from './EntryForm';
import WinnerBanner from './WinnerBanner';
import { AnimatedCountdown } from './ui/animated-countdown';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Parallax Hooks
  const { scrollY } = useScroll();
  const yHeroBg = useTransform(scrollY, [0, 1000], [0, 400]);
  const yHeroContent = useTransform(scrollY, [0, 1000], [0, 200]);

  // CHANGE THIS DATE TO YOUR ACTUAL DRAW DATE
  const drawDate = new Date("September 6, 2026 17:00:00").getTime();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <WinnerBanner />
      
      {/* NAVBAR */}
      <nav 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out px-6 lg:px-16 flex items-center justify-between ${
          isScrolled ? 'h-20 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'h-24 bg-transparent'
        }`}
      >
        {/* LOGO */}
        <a href="#" className="flex items-center gap-3 hover:scale-105 transition-transform duration-300 z-50 no-underline">
          <img 
            src="/favicon.png" 
            alt="Logo" 
            className="w-12 h-12 object-contain filter drop-shadow-md"
          />
          <img 
            src="/thimir.svg" 
            alt="Thimir" 
            className="h-20 object-contain filter drop-shadow-sm"
          />
        </a>
        
        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#prizes" className={`no-underline font-semibold text-sm tracking-wide uppercase transition-colors hover:text-[var(--gold)] ${isScrolled ? 'text-gray-800' : 'text-white/90'}`}>
            Prizes
          </a>
          <a href="#how" className={`no-underline font-semibold text-sm tracking-wide uppercase transition-colors hover:text-[var(--gold)] ${isScrolled ? 'text-gray-800' : 'text-white/90'}`}>
            How it Works
          </a>
          <a href="#join" className="no-underline bg-[var(--gold)] text-[#3a2500] px-6 py-2.5 rounded-full font-bold text-sm uppercase tracking-wide hover:bg-[#ffd878] hover:scale-105 transition-all shadow-md">
            Join Draw
          </a>
        </div>
        
        {/* MOBILE BURGER */}
        <button 
          className={`md:hidden bg-transparent border-none outline-none focus:outline-none shadow-none appearance-none transition-colors z-50 ${
            isScrolled ? 'text-gray-800' : 'text-white'
          }`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={26} className={isScrolled ? "" : "text-gray-800"} /> : <Menu size={26} />}
        </button>

        {/* MOBILE MENU OVERLAY */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute top-0 left-0 w-full bg-white shadow-2xl flex flex-col items-center pt-24 pb-10 gap-6 z-40 border-b-4 border-[var(--gold)]"
            >
              <a href="#prizes" onClick={() => setIsMobileMenuOpen(false)} className="no-underline text-gray-800 font-bold text-xl uppercase tracking-wider">
                Prizes
              </a>
              <a href="#how" onClick={() => setIsMobileMenuOpen(false)} className="no-underline text-gray-800 font-bold text-xl uppercase tracking-wider">
                How it Works
              </a>
              <a href="#join" onClick={() => setIsMobileMenuOpen(false)} className="no-underline mt-4 bg-[var(--gold)] text-[#3a2500] px-8 py-3.5 rounded-full font-extrabold text-lg uppercase tracking-wider shadow-lg">
                Join Draw
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden w-full min-h-[90vh] md:min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-6 lg:px-16" style={{
        backgroundImage: `
          radial-gradient(rgba(0, 0, 0, 0.25) 1.5px, transparent 1.5px),
          radial-gradient(circle at center, #7A161E 0%, #3B0A0E 70%, #240407 100%)
        `,
        backgroundSize: '6px 6px, 100% 100%'
      }}>
        
        {/* TOP SPONSOR LOGO */}
        <div className="relative z-20 flex flex-col items-center text-center w-full mb-8 md:mb-12 mt-4 md:mt-0">
           <div className="text-[#ffd878] drop-shadow-md mb-2 opacity-90 relative z-30 uppercase text-center flex flex-col items-center">
             <span className="font-extrabold tracking-[0.15em] text-lg md:text-2xl leading-tight">UDSF GMCK</span>
             <span className="font-semibold tracking-[0.3em] text-xs md:text-sm mt-1 opacity-80">presents</span>
           </div>
           <p className="text-[#ffd878] font-['Cormorant_Garamond'] font-bold tracking-normal text-4xl md:text-6xl mt-3 md:mt-5 relative z-30 opacity-95 drop-shadow-lg">
             Onam Bumper 2026
           </p>
        </div>

        <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-10 lg:gap-20 relative z-10">
          
          {/* LEFT SIDE: Text */}
          <motion.div 
            className="flex flex-col items-center md:items-start text-center md:text-left text-white order-2 md:order-1"
            style={{ y: yHeroContent }}
          >
            
            <div className="flex flex-col items-center md:items-start mb-8">
              <span className="font-['Great_Vibes'] text-6xl md:text-8xl text-[#ffd878] drop-shadow-xl transform -rotate-3 mb-[-15px] md:mb-[-30px] md:ml-8 z-10">
                Happy
              </span>
              <span className="font-['Cinzel'] text-7xl md:text-[110px] lg:text-[140px] font-extrabold leading-none tracking-tight text-white drop-shadow-2xl">
                ONAM
              </span>
            </div>
            
            <p className="text-lg md:text-2xl text-white/95 mb-10 max-w-lg font-light leading-relaxed drop-shadow-md">
              Celebrate the festival of joy, prosperity, and togetherness. Enter now for a chance to win spectacular prizes!
            </p>
            
            <a href="#join" className="primary-btn inline-block hover:scale-105 no-underline" style={{ 
              fontSize: '1.2rem', 
              padding: '18px 45px', 
              boxShadow: '0 15px 35px rgba(0,0,0,0.35)',
              background: '#ffd878', // light gold
              color: '#3a2500', // dark rich text
              border: 'none'
            }}>
              Enter the Lucky Draw →
            </a>
          </motion.div>
          
          {/* RIGHT SIDE: Image */}
          <motion.div 
            className="relative flex justify-center items-center order-1 md:order-2 w-full max-w-[450px] lg:max-w-[650px] mx-auto"
            style={{ y: yHeroBg }}
          >
            {/* Glow effect behind the image */}
            <div className="absolute inset-0 bg-[#ffd878]/30 blur-[100px] rounded-full scale-125"></div>
            
            <img 
              src="/hero-right.webp" 
              alt="Onam Celebration" 
              className="relative z-10 w-full h-auto object-contain drop-shadow-2xl" 
            />
          </motion.div>
          
        </div>
      </section>

      {/* COUNTDOWN */}
      <section className="countdown-section py-14 px-[8%] bg-[var(--green)] text-white relative z-20">
        <div className="countdown-wrap max-w-[1150px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="countdown-text text-center lg:text-left">
            <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl lg:text-[40px] mb-2">The Grand Draw Begins Soon</h2>
            <p className="opacity-80 text-lg">Don't miss your chance to participate.</p>
          </div>
          <AnimatedCountdown 
            targetDate={drawDate} 
            variant="modern" 
            size="lg" 
            className="shadow-2xl bg-white/15 border-white/20 backdrop-blur-md"
            unitClassName="bg-white border-white/30 hover:bg-white hover:border-white/50 shadow-md"
            numberClassName="text-[#043d25] font-extrabold"
            labelClassName="text-[#e96f24] font-bold tracking-widest"
          />
        </div>
      </section>

      {/* PRIZES */}
      <section className="relative z-20 bg-[#fffdf9] py-24 px-6" id="prizes">
        
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#075b35]/5 blur-[120px]"></div>
          <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-[#e96f24]/5 blur-[120px]"></div>
        </div>

        <div className="text-center max-w-3xl mx-auto mb-20 relative z-10">
          <span className="text-[#e96f24] font-extrabold text-sm tracking-[0.2em] uppercase mb-4 inline-block">Exciting Rewards</span>
          <h2 className="font-['Playfair_Display'] text-[#075b35] text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            What's Up for Grabs?
          </h2>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            A little extra happiness for your Onam celebrations. Every entry gives you a chance to win something spectacular.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 max-w-[1250px] mx-auto items-center relative z-10">
          
          {/* 2ND PRIZE */}
          <div className="order-2 md:order-1 bg-gradient-to-br from-[#075b35] via-[#043d25] to-[#021f12] rounded-[2rem] p-8 lg:p-10 relative overflow-hidden group hover:-translate-y-3 transition-all duration-500 shadow-[0_15px_40px_rgba(7,91,53,0.3)] border border-[#ffd878]/20 flex flex-col h-full min-h-[320px]">
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
            <div className="absolute top-2 right-4 text-[120px] leading-none font-black text-white/15 font-['Cinzel'] pointer-events-none group-hover:scale-105 group-hover:rotate-3 transition-transform duration-700">02</div>
            
            <div className="relative z-10 flex-grow">
              <div className="bg-white/10 border border-[#ffd878]/30 text-[#ffd878] font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full inline-flex mb-6 backdrop-blur-sm">Second Prize</div>
              <h3 className="text-white text-2xl lg:text-3xl font-bold mb-4 leading-tight drop-shadow-md">20,000 mAh Powerbank</h3>
              <p className="text-white/70 leading-relaxed">Keep your devices fully charged and ready for all the Onam festivities without missing a beat.</p>
            </div>
          </div>

          {/* 1ST PRIZE (FEATURED) */}
          <div className="order-1 md:order-2 bg-gradient-to-br from-[#7A161E] via-[#520d14] to-[#240407] rounded-[2.5rem] p-10 lg:p-12 relative overflow-hidden group hover:-translate-y-4 transition-all duration-500 shadow-[0_25px_60px_rgba(122,22,30,0.35)] border border-[#ffd878]/30 flex flex-col h-full min-h-[380px] md:scale-105 z-20">
            {/* Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
            <div className="absolute top-4 right-6 text-[150px] leading-none font-black text-white/15 font-['Cinzel'] pointer-events-none group-hover:scale-105 group-hover:rotate-3 transition-all duration-700">01</div>
            
            <div className="relative z-10 flex-grow flex flex-col">
              <div className="bg-gradient-to-r from-[#ffd878] to-[#e6ae35] text-[#3a2500] font-black text-xs uppercase tracking-[0.2em] px-5 py-2 rounded-full inline-flex w-max mb-8 shadow-lg">Grand Prize</div>
              <h3 className="text-white text-3xl lg:text-4xl font-black mb-5 leading-tight drop-shadow-md">Premium Smartwatch</h3>
              <p className="text-white/80 leading-relaxed text-lg mb-8">The ultimate reward of the Onam Lucky Draw. Stay connected in absolute luxury and style.</p>
              
              <div className="mt-auto">
                <span className="inline-flex items-center text-[#ffd878] font-bold text-sm tracking-widest uppercase group-hover:pl-2 transition-all duration-300">
                  <span className="w-8 h-[2px] bg-[#ffd878] mr-3"></span> The Jackpot
                </span>
              </div>
            </div>
          </div>

          {/* 3RD PRIZE */}
          <div className="order-3 bg-gradient-to-br from-[#075b35] via-[#043d25] to-[#021f12] rounded-[2rem] p-8 lg:p-10 relative overflow-hidden group hover:-translate-y-3 transition-all duration-500 shadow-[0_15px_40px_rgba(7,91,53,0.3)] border border-[#ffd878]/20 flex flex-col h-full min-h-[320px]">
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
            <div className="absolute top-2 right-4 text-[120px] leading-none font-black text-white/15 font-['Cinzel'] pointer-events-none group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-700">03</div>
            
            <div className="relative z-10 flex-grow">
              <div className="bg-white/10 border border-[#ffd878]/30 text-[#ffd878] font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full inline-flex mb-6 backdrop-blur-sm">Third Prize</div>
              <h3 className="text-white text-2xl lg:text-3xl font-bold mb-4 leading-tight drop-shadow-md">Mini BT Speaker</h3>
              <p className="text-white/70 leading-relaxed">Bring your favorite Onam tracks and celebration vibes absolutely everywhere you go.</p>
            </div>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative z-20 bg-[#043d25] py-20 px-6 overflow-hidden" id="how">
        {/* Deep rich background glowing accents */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#075b35] rounded-full blur-[150px] pointer-events-none opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#7A161E] rounded-full blur-[150px] pointer-events-none opacity-30"></div>

        <div className="max-w-[1250px] mx-auto relative z-10">
          
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-[#ffd878] font-bold text-sm tracking-[0.25em] uppercase mb-6 inline-block px-5 py-2 rounded-full border border-[#ffd878]/30 bg-[#ffd878]/10 backdrop-blur-sm shadow-[0_0_20px_rgba(255,216,120,0.15)]">
              Simple & Easy
            </span>
            <h2 className="font-['Playfair_Display'] text-white text-5xl md:text-6xl lg:text-7xl font-black leading-tight mt-4 drop-shadow-lg">
              How It Works
            </h2>
          </div>

          {/* Steps Grid - Asymmetrical Bento layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8">
            
            {/* Step 1 */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 hover:-translate-y-3 transition-all duration-500 hover:bg-white/[0.06] hover:border-white/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] group relative overflow-hidden">
              <div className="absolute -right-4 -top-8 text-[140px] font-black text-white/5 font-['Cinzel'] group-hover:text-white/10 transition-colors duration-500 pointer-events-none">1</div>
              
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ffd878] to-[#e96f24] flex items-center justify-center mb-10 shadow-lg shadow-[#e96f24]/20 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-6">
                <span className="text-[#043d25] font-black text-2xl font-sans">01</span>
              </div>
              
              <h3 className="text-white text-2xl md:text-3xl font-bold mb-4 tracking-tight">Register</h3>
              <p className="text-white/60 leading-relaxed text-lg font-light">
                Fill in your details and complete your entry securely to join the Onam Lucky Draw.
              </p>
            </div>

            {/* Step 2 - Offset downwards for a dynamic layout */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 hover:-translate-y-3 transition-all duration-500 hover:bg-white/[0.06] hover:border-white/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] group relative overflow-hidden md:translate-y-8">
              <div className="absolute -right-4 -top-8 text-[140px] font-black text-white/5 font-['Cinzel'] group-hover:text-white/10 transition-colors duration-500 pointer-events-none">2</div>
              
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ffd878] to-[#e96f24] flex items-center justify-center mb-10 shadow-lg shadow-[#e96f24]/20 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-6">
                <span className="text-[#043d25] font-black text-2xl font-sans">02</span>
              </div>
              
              <h3 className="text-white text-2xl md:text-3xl font-bold mb-4 tracking-tight">Lucky Number</h3>
              <p className="text-white/60 leading-relaxed text-lg font-light">
                Your unique lucky draw ticket number will be immediately assigned to you.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 hover:-translate-y-3 transition-all duration-500 hover:bg-white/[0.06] hover:border-white/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] group relative overflow-hidden">
              <div className="absolute -right-4 -top-8 text-[140px] font-black text-white/5 font-['Cinzel'] group-hover:text-white/10 transition-colors duration-500 pointer-events-none">3</div>
              
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ffd878] to-[#e96f24] flex items-center justify-center mb-10 shadow-lg shadow-[#e96f24]/20 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-6">
                <span className="text-[#043d25] font-black text-2xl font-sans">03</span>
              </div>
              
              <h3 className="text-white text-2xl md:text-3xl font-bold mb-4 tracking-tight">The Draw</h3>
              <p className="text-white/60 leading-relaxed text-lg font-light">
                Wait for the grand Onam celebration where the lucky winners will be revealed!
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative z-20 py-24 md:py-32 px-6 bg-[#fffdf9]" id="join">
        <div className="max-w-[1250px] mx-auto bg-gradient-to-br from-[#7A161E] via-[#520d14] to-[#240407] rounded-[3rem] p-10 md:p-16 lg:p-20 relative overflow-hidden shadow-[0_30px_60px_rgba(122,22,30,0.35)] border border-[#ffd878]/20">
          
          {/* Decorative background elements */}
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-bl from-[#ffd878]/15 to-transparent rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-gradient-to-tr from-[#e96f24]/20 to-transparent rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="flex-1 text-center lg:text-left">
              <span className="text-[#ffd878] font-bold text-sm tracking-[0.25em] uppercase mb-6 inline-flex items-center px-5 py-2 rounded-full border border-[#ffd878]/30 bg-[#ffd878]/10 backdrop-blur-sm">
                Join The Draw
              </span>
              <h2 className="font-['Playfair_Display'] text-white text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-10 drop-shadow-lg">
                Your Lucky Moment <br className="hidden lg:block"/> Could Be This Onam.
              </h2>
              
              <div className="hidden lg:flex items-center gap-6 opacity-70">
                <div className="flex -space-x-4">
                  <div className="w-12 h-12 rounded-full border-2 border-[#520d14] bg-white/10 backdrop-blur-md"></div>
                  <div className="w-12 h-12 rounded-full border-2 border-[#520d14] bg-white/20 backdrop-blur-md"></div>
                  <div className="w-12 h-12 rounded-full border-2 border-[#520d14] bg-white/30 backdrop-blur-md flex items-center justify-center text-xs font-bold text-white">+1K</div>
                </div>
                <p className="text-sm text-white font-medium">Already joined the celebration</p>
              </div>
            </div>
            
            <div className="w-full lg:w-[480px] shrink-0 relative">
              {/* Form container */}
              <div className="bg-white/10 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-10 border border-white/20 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                <div className="relative z-10">
                  <EntryForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative bg-[#021f12] overflow-hidden pt-24 pb-8 px-6 border-t border-[#ffd878]/20">
        
        {/* Huge Translucent Leaf SVGs */}
        <div className="absolute -top-20 -left-20 w-96 h-96 text-[#ffd878] opacity-5 -rotate-45 pointer-events-none">
          <svg viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M90 10 C 90 50, 50 90, 10 90 C 10 50, 50 10, 90 10 Z" />
            <path d="M10 90 L 90 10" stroke="#021f12" strokeWidth="2" fill="none" />
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] text-[#075b35] opacity-20 rotate-45 pointer-events-none translate-x-1/3 translate-y-1/3">
          <svg viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M90 10 C 90 50, 50 90, 10 90 C 10 50, 50 10, 90 10 Z" />
            <path d="M10 90 L 90 10" stroke="#021f12" strokeWidth="1" fill="none" />
          </svg>
        </div>

        <div className="max-w-[1250px] mx-auto relative z-10">
          
          <div className="flex flex-col items-center text-center mb-16">
            <div className="w-20 h-20 bg-white/5 backdrop-blur-xl rounded-[2rem] flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(255,216,120,0.1)] mb-8 p-4">
              <img src="/favicon.png" alt="logo" className="w-full h-full object-contain brightness-0 invert opacity-90" />
            </div>
            
            <h3 className="font-['Playfair_Display'] font-black text-4xl md:text-5xl text-white tracking-wide mb-4">
              Onam Lucky Draw
            </h3>
            <p className="text-[#ffd878]/70 text-lg font-light tracking-widest uppercase">GMC Kannur • {new Date().getFullYear()}</p>
          </div>
          
          {/* Translucent Glass Navigation */}
          <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 max-w-3xl mx-auto mb-16 shadow-2xl">
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12">
              <a href="#prizes" className="text-white/70 font-semibold uppercase tracking-wider text-sm hover:text-[#ffd878] transition-colors">Prizes</a>
              <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-white/20"></div>
              <a href="#how" className="text-white/70 font-semibold uppercase tracking-wider text-sm hover:text-[#ffd878] transition-colors">How it works</a>
              <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-white/20"></div>
              <a href="#join" className="text-white/70 font-semibold uppercase tracking-wider text-sm hover:text-[#ffd878] transition-colors">Join Draw</a>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs md:text-sm text-white/30 font-light text-center md:text-left">
            <p>© {new Date().getFullYear()} GMC Kannur Onam Lucky Draw. All rights reserved.</p>
            <p>Crafted with elegance for the festival.</p>
          </div>

        </div>
      </footer>
    </>
  );
}

export default LandingPage;
