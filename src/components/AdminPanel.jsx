import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, doc, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';

function AdminPanel() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState([]);
  const [drawConfig, setDrawConfig] = useState(null);
  const [error, setError] = useState('');
  
  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await loadAdminData();
      } else {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError('');
      // Check config
      const configSnap = await getDoc(doc(db, 'config', 'draw'));
      if (configSnap.exists()) {
        setDrawConfig(configSnap.data());
      }

      // Load all entries
      const querySnapshot = await getDocs(collection(db, 'entries'));
      const loadedEntries = [];
      querySnapshot.forEach((doc) => {
        loadedEntries.push({ id: doc.id, ...doc.data() });
      });
      // Sort: pending first, then paid
      loadedEntries.sort((a, b) => {
        if (a.status === 'pending_verification' && b.status !== 'pending_verification') return -1;
        if (a.status !== 'pending_verification' && b.status === 'pending_verification') return 1;
        return (b.created_at?.seconds || 0) - (a.created_at?.seconds || 0);
      });
      setEntries(loadedEntries);
    } catch (err) {
      console.error(err);
      setError('Failed to load data. Make sure you have admin privileges.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const pickWinnerRandomly = async () => {
    const paidEntries = entries.filter(e => e.status === 'paid');
    if (paidEntries.length === 0) {
      alert("No verified paid entries to choose from!");
      return;
    }
    const randomIndex = Math.floor(Math.random() * paidEntries.length);
    const winner = paidEntries[randomIndex];
    await declareWinner(winner.id);
  };

  const declareWinner = async (entryId) => {
    if (window.confirm("Are you sure you want to declare this entry as the winner? This will be announced publicly immediately.")) {
      try {
        setLoading(true);
        await updateDoc(doc(db, 'config', 'draw'), {
          winner_entry_id: entryId,
          is_draw_open: false,
          winner_announced_at: new Date()
        });
        await loadAdminData();
      } catch (err) {
        setError('Failed to declare winner. ' + err.message);
        setLoading(false);
      }
    }
  };

  const handleApprove = async (entryId) => {
    try {
      await updateDoc(doc(db, 'entries', entryId), {
        status: 'paid'
      });
      await loadAdminData();
    } catch (err) {
      alert("Error approving: " + err.message);
    }
  };

  const handleReject = async (entryId) => {
    if (window.confirm("Are you sure you want to reject and delete this entry? This action cannot be undone.")) {
      try {
        await deleteDoc(doc(db, 'entries', entryId));
        await loadAdminData();
      } catch (err) {
        alert("Error rejecting: " + err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffdf9]">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-[#075b35]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-[#075b35] font-semibold text-lg tracking-wide">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#043d25] via-[#022415] to-black relative overflow-hidden px-4">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ffd878] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#e96f24] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

        <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-4 shadow-inner">
              <svg className="w-8 h-8 text-[#ffd878]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Admin Portal</h2>
            <p className="text-white/50 mt-2 text-sm">Sign in to manage the Onam Lucky Draw</p>
          </div>

          {error && <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-xl text-sm font-medium mb-6">{error}</div>}
          
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-white/70 text-xs font-bold uppercase tracking-wider ml-1">Email Address</label>
              <input 
                type="email" 
                className="w-full bg-black/30 text-white border-0 ring-1 ring-white/10 px-5 py-4 rounded-xl placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#ffd878] focus:bg-black/40 transition-all" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-white/70 text-xs font-bold uppercase tracking-wider ml-1">Password</label>
              <input 
                type="password" 
                className="w-full bg-black/30 text-white border-0 ring-1 ring-white/10 px-5 py-4 rounded-xl placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#ffd878] focus:bg-black/40 transition-all" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-[#ffd878] text-[#3a2500] hover:bg-white font-bold text-lg py-4 rounded-xl shadow-lg mt-4 transition-all"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  const verifiedEntriesCount = entries.filter(e => e.status === 'paid').length;
  const pendingEntriesCount = entries.filter(e => e.status === 'pending_verification').length;

  return (
    <div className="min-h-screen bg-[#fffdf9] font-sans">
      {/* Header */}
      <header className="bg-white border-b border-[#075b35]/10 sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#075b35] rounded-xl flex items-center justify-center text-white shadow-md">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#075b35]">Dashboard</h1>
          </div>
          <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 font-semibold px-4 py-2 rounded-lg hover:bg-red-50 transition-colors">
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-10 flex flex-col gap-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3 shadow-sm">
            <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Draw Controls Card */}
        <div className="bg-white rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(7,91,53,0.05)] border border-[#075b35]/5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="text-2xl font-bold text-[#075b35] mb-2">Draw Controls</h2>
              <p className="text-gray-500">Manage the selection of the grand prize winner.</p>
            </div>
            
            <div className="flex items-center gap-4 bg-[#f8f9fa] p-2 rounded-2xl border border-gray-100">
              <button 
                className="bg-gradient-to-r from-[#ffd878] to-[#e6ae35] text-[#3a2500] font-bold px-8 py-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2" 
                onClick={pickWinnerRandomly}
                disabled={drawConfig?.winner_entry_id || verifiedEntriesCount === 0}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                Pick Random Winner
              </button>
              
              {drawConfig?.winner_entry_id && (
                <div className="flex items-center gap-2 text-green-700 bg-green-50 px-6 py-4 rounded-xl font-bold border border-green-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Winner Declared!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Entries Table Card */}
        <div className="bg-white rounded-[2rem] shadow-[0_10px_40px_rgba(7,91,53,0.05)] border border-[#075b35]/5 overflow-hidden flex flex-col">
          <div className="p-8 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#075b35] mb-1">Participants</h2>
              <p className="text-gray-500">Manage all pending and verified entries.</p>
            </div>
            <div className="flex gap-4">
              <div className="bg-orange-50 text-orange-700 px-4 py-2 rounded-lg font-bold border border-orange-100">
                {pendingEntriesCount} Pending
              </div>
              <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg font-bold border border-green-100">
                {verifiedEntriesCount} Verified
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                  <th className="px-8 py-5 font-semibold">Participant Details</th>
                  <th className="px-8 py-5 font-semibold">Coupon Code</th>
                  <th className="px-8 py-5 font-semibold">Payment Proof</th>
                  <th className="px-8 py-5 font-semibold text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {entries.map(entry => {
                  const isWinner = drawConfig?.winner_entry_id === entry.id;
                  const isPending = entry.status === 'pending_verification';
                  return (
                    <tr 
                      key={entry.id} 
                      className={`hover:bg-gray-50 transition-colors ${isWinner ? 'bg-green-50/50 hover:bg-green-50' : ''}`}
                    >
                      <td className="px-8 py-6">
                        <div className="font-bold text-gray-900">{entry.name}</div>
                        <div className="text-sm text-gray-500 mt-1">{entry.phone}</div>
                        <div className="text-xs text-gray-400 mt-0.5">Batch: {entry.batch}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-3 py-1.5 rounded-lg font-mono font-bold text-sm border border-gray-200">
                          {entry.coupon_code}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        {entry.screenshot_url ? (
                          <a 
                            href={entry.screenshot_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                            View SS
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm italic">No Proof</span>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right">
                        {isWinner ? (
                          <div className="inline-flex items-center gap-1.5 text-green-700 bg-green-100 px-4 py-2 rounded-full font-bold text-sm border border-green-200">
                            WINNER
                          </div>
                        ) : isPending ? (
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleApprove(entry.id)}
                              className="text-sm font-semibold text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg shadow-sm transition-colors"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleReject(entry.id)}
                              className="text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors border border-red-200"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full font-bold text-sm border border-emerald-200">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            Verified
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {entries.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-8 py-16 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <span className="text-lg font-medium">No entries found.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminPanel;
