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
      <nav style={{
        background: isScrolled ? 'rgba(255, 248, 232, 0.94)' : 'transparent',
        borderBottom: isScrolled ? '1px solid rgba(7, 91, 53, 0.1)' : 'none',
        transition: 'all 0.3s ease'
      }}>
        <div className="logo">
          <img src="/favicon.png" alt="logo" className="w-10 h-10 object-contain" />
          Onam Lucky Draw
        </div>
        
        {/* Desktop Nav Links */}
        <div className="nav-links hidden md:flex items-center gap-7">
          <a href="#prizes">Prizes</a>
          <a href="#how">How it Works</a>
          <a href="#join" className="nav-btn">Join Draw</a>
        </div>
        
        {/* Mobile Burger Menu Button */}
        <button 
          className="md:hidden p-2 text-[var(--green)] z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 w-full bg-[var(--cream)] border-b border-[var(--green)]/10 shadow-lg md:hidden flex flex-col items-center py-6 gap-6 z-40"
            >
              <a href="#prizes" onClick={() => setIsMobileMenuOpen(false)} className="text-[var(--text)] font-semibold text-lg">Prizes</a>
              <a href="#how" onClick={() => setIsMobileMenuOpen(false)} className="text-[var(--text)] font-semibold text-lg">How it Works</a>
              <a href="#join" onClick={() => setIsMobileMenuOpen(false)} className="bg-[var(--green)] text-white px-6 py-3 rounded-full font-bold">Join Draw</a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO */}
      <section className="hero relative overflow-hidden" style={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingBottom: '80px',
        gridTemplateColumns: '1fr', // Override the grid template from CSS
        background: 'transparent'
      }}>
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ 
            backgroundImage: 'url(/hero.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            y: yHeroBg 
          }}
        />
        <motion.a 
          href="#join" 
          className="primary-btn relative z-10" 
          style={{ fontSize: '1.3rem', padding: '18px 40px', boxShadow: '0 10px 25px rgba(0,0,0,0.6)', y: yHeroContent }}
        >
          Enter the Lucky Draw →
        </motion.a>
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
            className="shadow-2xl"
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
