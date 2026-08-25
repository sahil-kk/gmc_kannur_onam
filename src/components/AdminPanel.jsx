import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';

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
      } else {
        // Initialize config if doesn't exist
        // Note: Rules need to allow this if admin
      }

      // Load paid entries
      const q = query(collection(db, 'entries'), where('status', '==', 'paid'));
      const querySnapshot = await getDocs(q);
      const loadedEntries = [];
      querySnapshot.forEach((doc) => {
        loadedEntries.push({ id: doc.id, ...doc.data() });
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
    if (entries.length === 0) {
      alert("No paid entries to choose from!");
      return;
    }
    const randomIndex = Math.floor(Math.random() * entries.length);
    const winner = entries[randomIndex];
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

  if (loading) {
    return <div className="container text-center"><p>Loading...</p></div>;
  }

  if (!user) {
    return (
      <div className="container" style={{ maxWidth: '400px' }}>
        <div className="card">
          <h2 className="text-center text-maroon" style={{ marginBottom: '1.5rem' }}>Admin Login</h2>
          {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className="form-input" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-input" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '1000px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="text-maroon">Admin Dashboard</h1>
        <button onClick={handleLogout} className="btn btn-outline" style={{ width: 'auto' }}>Logout</button>
      </div>

      {error && <div style={{ padding: '1rem', background: '#ffebee', color: 'red', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Draw Controls</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            className="btn btn-primary" 
            style={{ width: 'auto', backgroundColor: 'var(--color-gold-dark)' }}
            onClick={pickWinnerRandomly}
            disabled={drawConfig?.winner_entry_id || entries.length === 0}
          >
            🎲 Pick Random Winner
          </button>
          
          {drawConfig?.winner_entry_id && (
            <div style={{ color: 'var(--color-green-leaf)', fontWeight: 'bold' }}>
              ✓ Winner already declared!
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1rem' }}>Paid Entries ({entries.length})</h2>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-cream)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>Coupon Code</th>
                <th style={{ padding: '1rem' }}>Name</th>
                <th style={{ padding: '1rem' }}>Phone</th>
                <th style={{ padding: '1rem' }}>Payment ID</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(entry => (
                <tr key={entry.id} style={{ 
                  borderBottom: '1px solid var(--color-cream)',
                  backgroundColor: drawConfig?.winner_entry_id === entry.id ? 'var(--color-green-light)' : 'transparent'
                }}>
                  <td style={{ padding: '1rem', fontFamily: 'monospace', fontWeight: 'bold' }}>{entry.coupon_code}</td>
                  <td style={{ padding: '1rem' }}>{entry.name}</td>
                  <td style={{ padding: '1rem' }}>{entry.phone}</td>
                  <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{entry.razorpay_payment_id}</td>
                  <td style={{ padding: '1rem' }}>
                    {drawConfig?.winner_entry_id === entry.id ? (
                      <span style={{ color: 'var(--color-green-leaf)', fontWeight: 'bold' }}>WINNER</span>
                    ) : (
                      <button 
                        onClick={() => declareWinner(entry.id)}
                        disabled={!!drawConfig?.winner_entry_id}
                        style={{
                          padding: '0.4rem 0.8rem',
                          background: 'white',
                          border: '1px solid var(--color-maroon)',
                          color: 'var(--color-maroon)',
                          borderRadius: '4px',
                          cursor: drawConfig?.winner_entry_id ? 'not-allowed' : 'pointer',
                          opacity: drawConfig?.winner_entry_id ? 0.5 : 1
                        }}
                      >
                        Set as Winner
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    No paid entries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
