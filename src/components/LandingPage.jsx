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
  const drawDate = new Date("September 5, 2026 18:00:00").getTime();

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
        <div className="relative z-20 flex flex-col items-center text-center w-full mb-[-20px] md:mb-[-60px] mt-4 md:mt-0">
           <div className="text-[#ffd878] drop-shadow-md mb-2 opacity-90 relative z-30 uppercase text-center flex flex-col items-center">
             <span className="font-extrabold tracking-[0.15em] text-sm md:text-lg leading-tight">UDSF GMCK</span>
             <span className="font-semibold tracking-[0.3em] text-[9px] md:text-[11px] mt-0.5 opacity-80">presents</span>
           </div>
           <p className="text-[#ffd878] font-bold tracking-[0.2em] uppercase text-xs md:text-sm mt-2 md:mt-4 relative z-30 opacity-90 drop-shadow-md">
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
      <section className="prizes relative z-20 bg-[var(--cream)]" id="prizes">
        <div className="section-header">
          <div className="section-tag">Exciting Rewards</div>
          <h2>What's Up for Grabs?</h2>
          <p>
            A little extra happiness for your Onam celebrations.
            Every entry gives you a chance to win.
          </p>
        </div>
        
        <div className="prize-grid">
          <div className="prize-card">
            <div className="prize-number">02</div>
            <h3>Second Prize</h3>
            <p>A special Onam reward for one lucky participant.</p>
            <div className="prize-value">₹25,000</div>
          </div>
          <div className="prize-card featured">
            <div className="prize-number">01</div>
            <h3>Grand Prize</h3>
            <p>
              The biggest prize of the Onam Lucky Draw.
              One lucky winner takes it home.
            </p>
            <div className="prize-value">₹50,000</div>
          </div>
          <div className="prize-card">
            <div className="prize-number">03</div>
            <h3>Third Prize</h3>
            <p>More exciting rewards and surprises for lucky winners.</p>
            <div className="prize-value">₹10,000</div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works relative z-20" id="how">
        <div className="section-header">
          <div className="section-tag">Simple & Easy</div>
          <h2>How It Works</h2>
        </div>
        <div className="steps">
          <div className="step">
            <div className="step-icon">①</div>
            <h3>Register</h3>
            <p>Fill in your details and complete your entry.</p>
          </div>
          <div className="step">
            <div className="step-icon">②</div>
            <h3>Get Your Lucky Number</h3>
            <p>Your unique lucky draw number will be assigned.</p>
          </div>
          <div className="step">
            <div className="step-icon">③</div>
            <h3>Wait for the Draw</h3>
            <p>Winners will be selected during the grand Onam draw.</p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta" id="join">
        <div className="cta-box">
          <h2 style={{ color: 'white' }}>Your Lucky Moment Could Be This Onam.</h2>
          <p>
            Join the Onam Lucky Draw today and stand a chance
            to take home exciting prizes.
          </p>
          
          <div style={{ marginTop: '2rem' }}>
            <EntryForm />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-wrap">
          <div className="logo" style={{ color: 'white' }}>
            <img src="/favicon.png" alt="logo" className="w-10 h-10 object-contain brightness-0 invert" />
            Onam Lucky Draw
          </div>
          <p>© 2026 Onam Lucky Draw. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default LandingPage;
