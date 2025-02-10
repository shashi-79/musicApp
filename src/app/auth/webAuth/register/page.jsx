'use client';

import { useState, useEffect } from 'react';

// Helper function to decode Base64Url strings
const decodeBase64Url = (input) => {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  return base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
};

const RegisterPage = () => {
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
useEffect(() => {
      setUserId(localStorage.getItem('userId'));

    
  }, []);

  const handleRegister = async () => {
    
    if (!userId) {
      setMessage('User ID is missing.');
      return;
    }

    setIsProcessing(true);
    try {
      // Start registration request
      const res = await fetch('/auth/webAuth/api/register/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (!res.ok || !data.challenge) {
        throw new Error('Failed to start registration');
      }

      const user = data.user || {};
      const publicKeyCredentialCreationOptions = {
        ...data,
        challenge: Uint8Array.from(
          atob(decodeBase64Url(data.challenge)),
          (c) => c.charCodeAt(0)
        ),
        user: {
          id: Uint8Array.from(atob(user.id || ''), (c) => c.charCodeAt(0)),
          name: user.name || '',
          displayName: user.displayName || '',
        },
        pubKeyCredParams: data.pubKeyCredParams.map((param) => ({
          ...param,
          alg: param.alg,
        })),
      };

      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      });

      const credentialResponse = {
        id: credential?.id || '',
        rawId: btoa(String.fromCharCode(...new Uint8Array(credential?.rawId || []))),
        type: credential?.type || '',
        response: {
          clientDataJSON: btoa(
            String.fromCharCode(...new Uint8Array(credential?.response.clientDataJSON || []))
          ),
          attestationObject: btoa(
            String.fromCharCode(...new Uint8Array(credential?.response.attestationObject || []))
          ),
        },
      };

      // Verify the registration
      const verificationRes = await fetch('/auth/webAuth/api/register/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, credential: credentialResponse }),
      });

      const verificationData = await verificationRes.json();
      if (verificationData.success) {
        setMessage('Registration successful!');
      } else {
        setMessage('Registration failed: ' + (verificationData.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setMessage('An error occurred during registration. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-xl font-bold text-center text-gray-800 mb-4">Register passkey</h1>
        <div className="flex justify-center">
          <button
            onClick={handleRegister}
            disabled={isProcessing}
            className={`flex px-4 py-2 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isProcessing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isProcessing ? 'Processing Registration...' : 'Register'}
          </button>
        </div>
        {message && <p className="mt-4 text-sm text-center text-gray-600">{message}</p>}
      </div>
    </div>
  );
};

export default RegisterPage;
