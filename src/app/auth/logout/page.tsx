'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const LogoutPage = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    setMessage('');

    try {
      const refreshToken = localStorage.getItem('refreshToken'); // Example: Fetch token from localStorage
      const userId = localStorage.getItem('userId'); // Example: Fetch userId from localStorage

      if (!refreshToken || !userId) {
        setMessageType('error');
        setMessage('Refresh token or userId is missing.');
        setLoading(false);
        return;
      }

      const response = await fetch('/auth/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken, userId }),
      });

      if (response.ok) {
        // Clear localStorage
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');

        setMessageType('success');
        setMessage('Logged out successfully.');
        setTimeout(() => {
          router.push('/auth'); // Redirect after a brief delay
        }, 1000);
      } else {
        const data = await response.json();
        setMessageType('error');
        setMessage(data.message || 'Logout failed.');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      setMessageType('error');
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Logout</h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Logging out...' : 'Logout'}
      </button>

      {message && (
        <p
          className={`mt-4 text-center ${
            messageType === 'success' ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default LogoutPage;
