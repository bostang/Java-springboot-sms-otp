/* global grecaptcha -- Disables no-unused-vars for grecaptcha global */
import React, { useState, useEffect } from 'react';
import { auth } from './firebaseConfig'; // Your Firebase config
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const PhoneAuth = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [recaptchaRendered, setRecaptchaRendered] = useState(false);

  // This effect runs once after the component mounts to set up the reCAPTCHA verifier
  useEffect(() => {
    // Only initialize reCAPTCHA if it hasn't been initialized yet and not already rendered
    if (!window.recaptchaVerifier && !recaptchaRendered) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible', // Use 'invisible' for a smoother user experience
        'callback': (response) => {
          // reCAPTCHA solved, allows signInWithPhoneNumber to proceed
          console.log("reCAPTCHA solved:", response);
          setRecaptchaRendered(true); // Mark reCAPTCHA as rendered
        },
        'expired-callback': () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          setError('reCAPTCHA expired. Please try again.');
          // Reset reCAPTCHA to allow the user to try again
          if (window.grecaptcha && window.recaptchaVerifier) {
            window.recaptchaVerifier.render().then(widgetId => window.grecaptcha.reset(widgetId));
          }
        }
      });

      // Render the reCAPTCHA if you want it visible, otherwise leave as invisible and it will
      // be automatically rendered when signInWithPhoneNumber is called.
      // If you are using 'invisible', you don't explicitly need to call render() here.
      // If 'visible', you would call: window.recaptchaVerifier.render();
      window.recaptchaVerifier.render().then((widgetId) => {
        console.log("reCAPTCHA widget rendered with ID:", widgetId);
      }).catch(err => {
        console.error("Error rendering reCAPTCHA:", err);
        setError("Failed to load reCAPTCHA. Please check your Firebase setup.");
      });
    }
  }, [recaptchaRendered]);


  const handleSendOtp = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    if (!phoneNumber) {
      setError('Please enter a phone number.');
      setLoading(false);
      return;
    }

    try {
      // Ensure the phone number is in E.164 format (e.g., +628123456789)
      const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

      const result = await signInWithPhoneNumber(auth, formattedPhoneNumber, window.recaptchaVerifier);
      setConfirmationResult(result);
      setMessage('OTP sent! Please enter the verification code.');
    } catch (err) {
      console.error("Error sending OTP:", err);
      setError(`Failed to send OTP: ${err.message}`);
      // Re-render reCAPTCHA if it was a reCAPTCHA error
      if (err.code === 'auth/web-storage-unsupported' || err.code === 'auth/too-many-requests') {
          // For these errors, reCAPTCHA might need a refresh or the user needs to try again later
          if (window.recaptchaVerifier) {
              window.recaptchaVerifier.render().then(widgetId => window.grecaptcha.reset(widgetId));
          }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    if (!otp) {
      setError('Please enter the OTP.');
      setLoading(false);
      return;
    }

    try {
      if (!confirmationResult) {
        setError('No OTP request was initiated. Please send OTP first.');
        setLoading(false);
        return;
      }

      const result = await confirmationResult.confirm(otp);
      const user = result.user; // Firebase User object

      setMessage(`Successfully verified! User UID: ${user.uid}`);
      console.log('Firebase user:', user);

      // --- Send ID Token to your Spring Boot Backend ---
      const idToken = await user.getIdToken();
      console.log('Firebase ID Token:', idToken);

      await sendIdTokenToBackend(idToken);

      // You can now redirect the user or update UI based on successful login
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError(`Failed to verify OTP: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const sendIdTokenToBackend = async (idToken) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/verify-firebase-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // You might add an Authorization header if your backend requires it for this endpoint,
          // but based on your Spring Security config, it's currentlypermitAll() for this path.
        },
        body: JSON.stringify({ idToken: idToken }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to verify token with backend.');
      }

      const data = await response.json();
      setMessage(prev => prev + `\nBackend response: ${data.message}, UID: ${data.uid}, Phone: ${data.phoneNumber}`);
      console.log('Backend Verification Success:', data);
    } catch (err) {
      console.error("Error sending token to backend:", err);
      setError(prev => prev + `\nBackend communication error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Phone Number Authentication</h2>

        {!confirmationResult ? (
          <div className="space-y-4">
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number (e.g., +628123456789):</label>
            <input
              id="phoneNumber"
              type="tel" // Use tel for phone numbers
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number with country code"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">Verification Code (OTP):</label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        )}

        {error && <p className="mt-4 text-sm text-red-600">Error: {error}</p>}
        {message && <p className="mt-4 text-sm text-green-600">{message}</p>}

        {/* The reCAPTCHA container. Firebase will inject the reCAPTCHA widget here. */}
        {/* For invisible reCAPTCHA, it might not be visually obvious but it's still needed. */}
        <div id="recaptcha-container" className="mt-6"></div>
      </div>
    </div>
  );
};

// Main App component
const App = () => {
  return (
    // Tailwind CSS setup for Inter font and rounded corners
    <>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          body {
            font-family: 'Inter', sans-serif;
          }
          /* Ensure all elements have rounded corners */
          * {
            border-radius: 0.5rem; /* Default rounded-md from Tailwind */
          }
        `}
      </style>
      <PhoneAuth />
    </>
  );
};

export default App;
