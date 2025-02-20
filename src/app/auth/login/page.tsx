'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaImage, setCaptchaImage] = useState("");
  const [captchaId, setCaptchaId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const fetchCaptcha = async () => {
    try {
      const response = await axios.get("api/captcha");
      setCaptchaImage(response.data.captchaImage);
      setCaptchaId(response.data.captchaId);
    } catch {
      setMessage("Error fetching CAPTCHA. Please try again.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");  // Clear any previous message

    try {
      const response = await axios.post("api/login", {
        email,
        password,
        captchaInput: captcha,
        captchaId,
      });

      if (response.data.userId) {
        // Save tokens to localStorage
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);

        setMessage("Login successful! Redirecting...");
        setTimeout(() => {
          window.location.href = "/"; // Redirect to home/dashboard
        }, 2000);
      } else {
        setMessage(response.data.message || "Login failed.");
        fetchCaptcha(); // Refresh CAPTCHA on failure
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred. Please try again.");
      fetchCaptcha(); // Refresh CAPTCHA if an error occurs
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Login</h1>
        <p className="text-gray-600 mb-6">Please login to your account</p>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Captcha</label>
            {captchaImage ? (
              <img
                src={captchaImage}
                alt="Captcha"
                className="my-2 border border-gray-300 rounded-lg"
              />
            ) : (
              <p>Loading CAPTCHA...</p>
            )}
            <input
              type="number"
              value={captcha}
              
              onChange={(e) => setCaptcha(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={fetchCaptcha}
              className="mt-2 text-blue-500 underline"
            >
              Refresh CAPTCHA
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p
            className={`mt-4 text-sm ${
              message.includes("successful") ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
