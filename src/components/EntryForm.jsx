import { useState } from 'react';
import { db, storage } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

function EntryForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', phone: '', batch: '' });
  const [screenshot, setScreenshot] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }
      setScreenshot(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const generateCouponCode = () => {
    return `ONAM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.batch) {
      setError('Please fill all fields');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!screenshot) {
      setError('Please upload your payment screenshot');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Generate coupon code
      const couponCode = generateCouponCode();
      const uniqueId = Date.now().toString() + Math.random().toString(36).substring(2, 5);

      // Upload Screenshot
      const storageRef = ref(storage, `receipts/${uniqueId}_${screenshot.name}`);
      await uploadBytes(storageRef, screenshot);
      const screenshotUrl = await getDownloadURL(storageRef);

      // Create Document in Firestore
      const docRef = await addDoc(collection(db, 'entries'), {
        name: formData.name,
        phone: formData.phone,
        batch: formData.batch,
        amount: 50,
        coupon_code: couponCode,
        screenshot_url: screenshotUrl,
        status: 'pending_verification',
        created_at: serverTimestamp()
      });

      // Navigate to receipt
      navigate(`/receipt/${docRef.id}`);

    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button 
          type="button" 
          onClick={() => setStep(1)}
          className="text-white/60 hover:text-white flex items-center gap-2 text-sm font-medium w-fit transition-colors bg-transparent border-0 p-0 shadow-none focus:outline-none"
        >
          <ArrowLeft size={16} /> Back to Details
        </button>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center">
          <h3 className="text-white font-bold text-lg mb-2">Pay ₹50 to Enter</h3>
          <p className="text-white/60 text-sm mb-6">Scan QR or tap to open UPI app</p>
          
          <div className="bg-white p-4 rounded-2xl w-48 h-48 mx-auto mb-6 flex items-center justify-center">
            <img src="/upiqr.png" alt="UPI QR Code" className="w-full h-full object-contain rounded-xl" />
          </div>
          <a 
            href="tez://upi/pay?pa=paytm.s3nizf7@pty&pn=GMC_Kannur&am=50&tn=Onam-Bumper&cu=INR"
            className="w-full bg-[#075b35] hover:bg-[#0a6b3e] text-white font-semibold py-3.5 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 mb-4 shadow-md"
          >
            <svg className="w-5 h-5 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
            Pay directly with GPay
          </a>

          <div className="text-sm font-medium text-[#ffd878] bg-[#ffd878]/10 py-2 px-4 rounded-full inline-block border border-[#ffd878]/20">
            UPI: paytm.s3nizf7@pty
          </div>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-xl text-sm font-medium">{error}</div>}

        <div className="flex flex-col gap-2">
          <label className="text-white/70 text-xs font-bold uppercase tracking-wider ml-1">Upload Payment Screenshot *</label>
          
          <div className="relative">
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              required 
            />
            <div className={`w-full border-2 border-dashed ${previewUrl ? 'border-[#ffd878] bg-[#ffd878]/5' : 'border-white/20 bg-black/20'} rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-colors text-center`}>
              {previewUrl ? (
                <>
                  <CheckCircle2 className="text-[#ffd878]" size={32} />
                  <div>
                    <p className="text-[#ffd878] font-medium text-sm">Screenshot Attached</p>
                    <p className="text-white/50 text-xs mt-1 truncate max-w-[200px]">{screenshot.name}</p>
                  </div>
                </>
              ) : (
                <>
                  <UploadCloud className="text-white/40" size={32} />
                  <div>
                    <p className="text-white/80 font-medium text-sm">Tap to upload screenshot</p>
                    <p className="text-white/40 text-xs mt-1">JPEG, PNG (Max 5MB)</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-[#ffd878] text-[#3a2500] hover:bg-white hover:text-black font-extrabold text-lg py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-2 flex items-center justify-center gap-2" 
          disabled={loading || !screenshot}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying...
            </span>
          ) : (
            <>Complete Entry <CheckCircle2 size={20}/></>
          )}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleNext} className="w-full flex flex-col gap-5 animate-in fade-in duration-500">
      {error && <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-xl text-sm font-medium mb-2">{error}</div>}
      
      <div className="flex flex-col gap-1.5">
        <label className="text-white/70 text-xs font-bold uppercase tracking-wider ml-1" htmlFor="name">Full Name *</label>
        <input 
          type="text" 
          id="name"
          name="name"
          className="w-full bg-black/30 text-white border-0 ring-1 ring-white/10 px-5 py-4 rounded-2xl placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#ffd878] focus:bg-black/40 transition-all shadow-sm"
          value={formData.name}
          onChange={handleChange}
          required 
          placeholder="Enter your name"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-white/70 text-xs font-bold uppercase tracking-wider ml-1" htmlFor="phone">Phone Number *</label>
        <input 
          type="tel" 
          id="phone"
          name="phone"
          className="w-full bg-black/30 text-white border-0 ring-1 ring-white/10 px-5 py-4 rounded-2xl placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#ffd878] focus:bg-black/40 transition-all shadow-sm" 
          value={formData.phone}
          onChange={handleChange}
          required 
          placeholder="10-digit mobile number"
          pattern="[0-9]{10}"
        />
      </div>

      <div className="flex flex-col gap-1.5 mb-2">
        <label className="text-white/70 text-xs font-bold uppercase tracking-wider ml-1" htmlFor="batch">Batch *</label>
        <input 
          type="text" 
          id="batch"
          name="batch"
          className="w-full bg-black/30 text-white border-0 ring-1 ring-white/10 px-5 py-4 rounded-2xl placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#ffd878] focus:bg-black/40 transition-all shadow-sm" 
          value={formData.batch}
          onChange={handleChange}
          required
          placeholder="Enter your batch"
        />
      </div>

      <button 
        type="submit" 
        className="w-full bg-[#ffd878] text-[#3a2500] hover:bg-white hover:text-black font-extrabold text-lg py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-4 flex items-center justify-center gap-2" 
      >
        Proceed to Pay <ArrowRight size={20} />
      </button>
    </form>
  );
}

export default EntryForm;
