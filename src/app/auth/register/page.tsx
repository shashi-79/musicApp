'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import axios from "axios";

interface CaptchaResponse {
  captchaImage: string;
  captchaId: string;
}

interface RegisterResponse {
  success: boolean;
  message?: string;
}

interface OtpVerificationResponse {
  success: boolean;
  userId: string;
  accessToken: string;
  refreshToken: string;
  message?: string;
}

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [captcha, setCaptcha] = useState<string>("");
  const [captchaImage, setCaptchaImage] = useState<string>("");
  const [captchaId, setCaptchaId] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const fetchCaptcha = async () => {
    try {
      const response = await axios.get<CaptchaResponse>("api/captcha");
      setCaptchaImage(response.data.captchaImage);
      setCaptchaId(response.data.captchaId);
    } catch {
      setMessage("Error fetching CAPTCHA. Please try again.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post<RegisterResponse>("/auth/api/register", {
        email,
        password,
        captchaInput: captcha,
        captchaId,
      });

      if (response.data.success) {
        setOtpSent(true);
        setMessage("OTP sent to your email.");
      } else {
        setMessage(response.data.message || "Captcha validation failed.");
        fetchCaptcha();
      }
    } catch {
      setMessage("Error during registration. Please try again.");
      fetchCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post<OtpVerificationResponse>("api/verifyOtp", {
        email,
        otp,
      });

      if (response.data.success) {
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);

        setOtpVerified(true);
        setMessage("OTP verified successfully! Registration complete.");
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        setMessage(response.data.message || "Invalid OTP. Please try again.");
      }
    } catch {
      setMessage("Error verifying OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {otpSent && !otpVerified
            ? "Verify OTP"
            : otpVerified
            ? "Success"
            : "Register"}
        </h1>
        <p className="text-gray-600 mb-6">
          {otpSent && !otpVerified
            ? "Enter the OTP sent to your email."
            : otpVerified
            ? "Registration is complete."
            : "Please fill in the form to register."}
        </p>

        {/* Registration Form */}
        {!otpSent && !otpVerified && (
          <form onSubmit={handleRegister} className="space-y-4">
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
                <p>Loading captcha...</p>
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
                disabled={loading}
                className="mt-2 text-blue-500 underline"
              >
                Refresh Captcha
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-2 text-white rounded-lg ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
              } focus:outline-none`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        )}

        {/* OTP Verification Form */}
        {otpSent && !otpVerified && (
          <form onSubmit={handleOtpVerification} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-2 text-white rounded-lg ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
              } focus:outline-none`}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        {/* Success Message */}
        {otpVerified && <p className="text-green-500 font-medium">{message}</p>}

        {/* Error/Info Messages */}
        {message && !otpVerified && (
          <p className="mt-4 text-sm text-red-500">{message}</p>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
