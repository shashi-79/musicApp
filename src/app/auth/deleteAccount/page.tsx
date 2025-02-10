'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const DeleteAccountPage = () => {

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleDeleteAccount = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const userId = localStorage.getItem('userId');

      if (!refreshToken || !userId) {
        setMessage('Refresh token or userId is missing.');
        setLoading(false);
        router.push('/auth'); // Redirect to the login page if tokens are missing
        return;
      }

      const response = await fetch('/auth/api/deleteAccount', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken, userId }),
      });

      if (response.ok) {
        // Clear the localStorage after successful account deletion
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        setMessage('Your account has been deleted successfully.');

        // Redirect the user to the login page after account deletion
        setTimeout(() => {
          router.push('/auth'); // Redirect to login page
        }, 2000); // Redirect after 2 seconds to allow the user to see the success message
      } else {
        const data = await response.json();
        setMessage(data.message || 'Failed to delete account.');
      }
    } catch (error) {
      console.error('Error during account deletion:', error);
      setMessage('An error occurred while trying to delete your account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Delete Account</h1>
      <p className="mb-6 text-gray-700">Are you sure you want to delete your account? This action cannot be undone.</p>

      <button
        onClick={handleDeleteAccount}
        className="bg-red-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Deleting Account...' : 'Delete Account'}
      </button>

      {message && <p className="mt-4 text-center text-gray-600">{message}</p>}
    </div>
  );
};

export default DeleteAccountPage;
