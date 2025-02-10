'use client'; // Required for client-side hooks like useRouter

import { useRouter } from 'next/navigation';
import {  useEffect } from 'react';
const AuthPage: React.FC = () => {
  const router = useRouter();

  // Check if user is already logged in by checking 'userId' in localStorage
  useEffect(() => {
    if (localStorage.getItem('userId')) {
      router.push('/auth/logout');
    }
  }, [router]); // Adding router to the dependency array to avoid any potential issues

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome</h1>
      <p className="text-lg text-gray-600 mb-6">Please select an option:</p>
      <div className="flex space-x-4">
        <button
          onClick={() => router.push('/auth/register')}
          className="px-6 py-3 text-lg font-medium text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          Register
        </button>
        <button
          onClick={() => router.push('/auth/login')}
          className="px-6 py-3 text-lg font-medium text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Login
        </button>
        <button
          onClick={() => router.push('/auth/webAuth/login')}
          className="px-6 py-3 text-lg font-medium text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          passkey
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
