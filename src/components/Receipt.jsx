import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { CheckCircle2, Home, Download, Loader2 } from 'lucide-react';

function Receipt() {
  const { entryId } = useParams();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!entryId) return;

    const fetchEntry = async () => {
      try {
        const docRef = doc(db, 'entries', entryId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setEntry(docSnap.data());
        } else {
          setError('Receipt not found. Please ensure you have completed the process.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load receipt.');
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [entryId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#021f12] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[#ffd878]" size={48} />
          <p className="text-[#ffd878] font-medium animate-pulse">Generating your receipt...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#021f12] flex items-center justify-center p-6">
        <div className="bg-white/5 border border-red-500/30 rounded-3xl p-8 max-w-md w-full text-center">
          <h2 className="text-red-400 font-bold text-2xl mb-4">Oops!</h2>
          <p className="text-white/70 mb-8">{error}</p>
          <Link to="/" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full transition-colors font-medium">
            <Home size={18} /> Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#021f12] py-20 px-6 flex items-center justify-center relative overflow-hidden">
      
      {/* Background Leaves */}
      <div className="absolute top-0 left-0 w-96 h-96 text-[#ffd878] opacity-5 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <svg viewBox="0 0 100 100" fill="currentColor"><path d="M90 10 C 90 50, 50 90, 10 90 C 10 50, 50 10, 90 10 Z" /></svg>
      </div>
      <div className="absolute bottom-0 right-0 w-96 h-96 text-[#ffd878] opacity-5 translate-x-1/2 translate-y-1/2 pointer-events-none">
        <svg viewBox="0 0 100 100" fill="currentColor"><path d="M90 10 C 90 50, 50 90, 10 90 C 10 50, 50 10, 90 10 Z" /></svg>
      </div>

      <div className="max-w-xl w-full relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          
          {/* Subtle gold glow behind checkmark */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#ffd878] opacity-10 blur-3xl rounded-full"></div>

          <div className="text-center relative z-10 mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <CheckCircle2 size={40} />
            </div>
            <h1 className="font-['Playfair_Display'] text-white text-3xl md:text-4xl font-bold mb-4">Thank you for participating!</h1>
            <p className="text-white/70 text-lg">Your entry is confirmed.</p>
          </div>

          <div className="bg-gradient-to-br from-[#ffd878]/20 to-[#ffd878]/5 border border-[#ffd878]/30 rounded-3xl p-8 mb-8 text-center relative overflow-hidden">
            {/* Ticket texture line */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-[#021f12] rounded-r-full border-r border-t border-b border-[#ffd878]/30"></div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-[#021f12] rounded-l-full border-l border-t border-b border-[#ffd878]/30"></div>
            
            <p className="text-[#ffd878] text-xs font-bold tracking-[0.2em] uppercase mb-4 opacity-80">Official Coupon Code</p>
            <div className="font-mono text-4xl md:text-5xl font-black text-white tracking-widest drop-shadow-md">
              {entry.coupon_code}
            </div>
          </div>

          <div className="space-y-4 mb-10">
            <h3 className="text-white/40 text-xs font-bold uppercase tracking-wider mb-2 px-4">Participant Details</h3>
            <div className="bg-white/5 rounded-2xl p-5 flex justify-between items-center">
              <span className="text-white/50">Name</span>
              <span className="text-white font-medium">{entry.name}</span>
            </div>
            <div className="bg-white/5 rounded-2xl p-5 flex justify-between items-center">
              <span className="text-white/50">Phone</span>
              <span className="text-white font-medium">{entry.phone}</span>
            </div>
            <div className="bg-white/5 rounded-2xl p-5 flex justify-between items-center">
              <span className="text-white/50">Batch</span>
              <span className="text-white font-medium">{entry.batch}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => window.print()}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-4 rounded-full transition-colors flex items-center justify-center gap-2"
            >
              <Download size={18} /> Save Receipt
            </button>
            <Link 
              to="/"
              className="flex-1 bg-transparent border border-white/20 hover:border-white/40 text-white font-semibold py-4 rounded-full transition-colors flex items-center justify-center gap-2"
            >
              <Home size={18} /> Return Home
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Receipt;
