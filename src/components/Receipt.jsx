import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { CheckCircle, Loader, Download } from 'lucide-react';

function Receipt() {
  const { entryId } = useParams();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!entryId) return;

    const unsub = onSnapshot(doc(db, 'entries', entryId), (docSnap) => {
      if (docSnap.exists()) {
        setEntry(docSnap.data());
        setLoading(false);
      } else {
        setError('Entry not found. Please contact support if you have paid.');
        setLoading(false);
      }
    }, (err) => {
      console.error(err);
      setError('Failed to fetch entry details.');
      setLoading(false);
    });

    return () => unsub();
  }, [entryId]);

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="text-center">
          <Loader className="text-maroon" size={48} style={{ animation: 'spin 2s linear infinite', marginBottom: '1rem' }} />
          <h2 className="font-heading text-maroon">Fetching your receipt...</h2>
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="card text-center">
          <h2 style={{ color: 'red' }}>Error</h2>
          <p>{error}</p>
          <Link to="/" className="btn btn-outline" style={{ marginTop: '1rem' }}>Return Home</Link>
        </div>
      </div>
    );
  }

  const isPaid = entry?.status === 'paid';

  return (
    <div className="container">
      <div className="card text-center">
        {isPaid ? (
          <>
            <CheckCircle color="var(--color-green-leaf)" size={64} style={{ margin: '0 auto 1rem' }} />
            <h1 className="text-green" style={{ marginBottom: '0.5rem' }}>Payment Successful!</h1>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
              Thank you, {entry.name}. Your entry to the Onam Lucky Draw is confirmed.
            </p>

            <div className="kasavu-border" style={{ maxWidth: '400px', margin: '0 auto 2rem' }}>
              <div className="kasavu-inner" style={{ backgroundColor: 'var(--color-ivory)', padding: '2rem 1rem' }}>
                <p style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Your Digital Coupon Code
                </p>
                <div style={{ 
                  fontSize: '2.5rem', 
                  fontFamily: 'monospace', 
                  fontWeight: 'bold', 
                  color: 'var(--color-maroon)',
                  margin: '1rem 0',
                  letterSpacing: '4px'
                }}>
                  {entry.coupon_code}
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                  Transaction ID: {entry.razorpay_payment_id}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                className="btn btn-primary" 
                onClick={() => window.print()} 
                style={{ width: 'auto' }}
              >
                <Download size={18} style={{ marginRight: '8px' }} />
                Save Receipt
              </button>
              <Link to="/" className="btn btn-outline" style={{ width: 'auto' }}>
                Return Home
              </Link>
            </div>
          </>
        ) : (
          <>
            <Loader className="text-gold" size={64} style={{ animation: 'spin 2s linear infinite', margin: '0 auto 1rem' }} />
            <h2 className="text-maroon" style={{ marginBottom: '1rem' }}>Waiting for Payment Confirmation</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Please do not close this window. We are verifying your payment securely...
            </p>
            <p style={{ marginTop: '2rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              If you have already paid and this screen doesn't update within a minute, please contact support with your Order ID: {entry?.razorpay_order_id}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Receipt;
