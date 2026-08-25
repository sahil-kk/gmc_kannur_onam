import { useState } from 'react';
import { functions } from '../lib/firebase';
import { httpsCallable } from 'firebase/functions';
import { useNavigate } from 'react-router-dom';

function EntryForm() {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Call cloud function to create order
      const createOrder = httpsCallable(functions, 'createRazorpayOrder');
      const response = await createOrder(formData);
      const { entryId, orderId, amount, currency } = response.data;

      // 2. Open Razorpay Checkout
      const res = await loadRazorpay();
      if (!res) {
        throw new Error('Razorpay SDK failed to load. Are you online?');
      }

      const options = {
        // key will be loaded via API normally, but since we are handling webhook securely, 
        // Razorpay handles the order_id context. Still need a key for the client.
        // Usually, key_id is public. For now, we will pass a test key or omit if we can't.
        // Actually Razorpay requires the key in client. We should fetch it from config or hardcode test key.
        key: 'rzp_test_mock_key', // This needs to be replaced with the actual client key
        amount: amount,
        currency: currency,
        name: 'GMC Kannur Onam',
        description: 'Lucky Draw Entry',
        order_id: orderId,
        handler: function (response) {
          // On success, we navigate to the receipt page which will listen for the webhook update
          navigate(`/receipt/${entryId}`);
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#7c1919' // Maroon
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="entry-form">
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      
      <div className="form-group">
        <label className="form-label" htmlFor="name">Full Name *</label>
        <input 
          type="text" 
          id="name"
          name="name"
          className="form-input" 
          value={formData.name}
          onChange={handleChange}
          required 
          placeholder="Enter your name"
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="phone">Phone Number *</label>
        <input 
          type="tel" 
          id="phone"
          name="phone"
          className="form-input" 
          value={formData.phone}
          onChange={handleChange}
          required 
          placeholder="10-digit mobile number"
          pattern="[0-9]{10}"
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="email">Email Address (Optional)</label>
        <input 
          type="email" 
          id="email"
          name="email"
          className="form-input" 
          value={formData.email}
          onChange={handleChange}
          placeholder="For backup communication"
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Processing...' : 'Pay ₹50 & Enter Draw'}
      </button>
    </form>
  );
}

export default EntryForm;
