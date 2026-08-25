import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';

function WinnerBanner() {
  const [winnerName, setWinnerName] = useState(null);
  const [isDrawOpen, setIsDrawOpen] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'config', 'draw'), async (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setIsDrawOpen(data.is_draw_open !== false);
        
        if (data.winner_entry_id) {
          // Fetch winner details
          const winnerSnap = await getDoc(doc(db, 'entries', data.winner_entry_id));
          if (winnerSnap.exists()) {
            setWinnerName(winnerSnap.data().name);
          }
        } else {
          setWinnerName(null);
        }
      }
    });

    return () => unsub();
  }, []);

  if (!winnerName) {
    if (!isDrawOpen) {
      return (
        <div className="winner-banner">
          <h2 style={{ color: 'white' }}>The draw is now closed.</h2>
          <p>Please wait while we announce the winner!</p>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="winner-banner" style={{ background: 'linear-gradient(135deg, var(--color-green-leaf), var(--color-gold-dark))' }}>
      <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>🎉 We have a Winner! 🎉</h2>
      <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Congratulations to {winnerName}!</p>
      <p style={{ marginTop: '0.5rem', opacity: 0.9 }}>Thank you to everyone who participated in the Onam Lucky Draw.</p>
    </div>
  );
}

export default WinnerBanner;
