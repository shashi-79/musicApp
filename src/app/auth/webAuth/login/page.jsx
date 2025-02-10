'use client';

import { useState, useEffect } from 'react';

// Helper function to convert base64url to base64
const base64urlToBase64 = (base64url) => {
  return base64url.replace(/-/g, '+').replace(/_/g, '/').padEnd(base64url.length + (4 - (base64url.length % 4)) % 4, '=');
};

// LoginPage component
const LoginPage = () => {
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  
  // Handle login process
  const handleLogin = async () => {
    setIsProcessing(true);

    try {
      // Step 1: Start the login process by sending the userId to the backend
      const res = await fetch('/auth/webAuth/api/login/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();

      if (data.challenge) {
        // Step 2: Convert challenge and allowCredentials IDs from base64url to base64
        const publicKeyCredentialRequestOptions = {
          ...data,
          challenge: Uint8Array.from(atob(base64urlToBase64(data.challenge)), (c) => c.charCodeAt(0)),
          allowCredentials: data.allowCredentials.map((cred) => ({
            ...cred,
            id: Uint8Array.from(atob(base64urlToBase64(cred.id)), (c) => c.charCodeAt(0)),
          })),
        };

        // Step 3: Get credentials assertion
        const assertion = await navigator.credentials.get({
          publicKey: publicKeyCredentialRequestOptions,
        });

        // Step 4: Send the assertion to the backend for verification
        const verificationRes = await fetch('/auth/webAuth/api/login/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            data: assertion,
          }),
        });

        const verificationData = await verificationRes.json();

        if (verificationData.success) {
          setMessage('Login successful!');

          // Store the returned tokens in localStorage
          localStorage.setItem('userId', verificationData.userId || '');
          localStorage.setItem('accessToken', verificationData.accessToken || '');
          localStorage.setItem('refreshToken', verificationData.refreshToken || '');
        } else {
          setMessage('Login failed');
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
      setMessage('An error occurred during login.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-xl font-bold text-center text-gray-800 mb-4">Login</h1>

        <div className="mb-4">
          <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
            User ID
          </label>
          <input
            id="userId"
            type="text"
            name="userId"
            autoComplete="userId webauthn"
            placeholder="Enter your User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={isProcessing}
          className={`px-4 py-2 font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
            isProcessing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isProcessing ? 'Processing Login...' : 'Login'}
        </button>

        {message && <p className="mt-4 text-sm text-center text-gray-600">{message}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
