'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";

const UserProfile = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("accessToken");

    if (!userId || !token) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }

    fetchProfile(userId, token);
  }, []);

  const refreshAuthToken = async (userId: string, refreshToken: string) => {
    try {
      const { data } = await axios.post(
        "/auth/api/token",
        { userId, refreshToken },
        { headers: { "Content-Type": "application/json" } }
      );
      
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      
      return data.accessToken;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return null;
    }
  };

  const fetchProfile = async (userId: string, token: string) => {
    try {
      const res = await fetch(`/home/profile/api/profile/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          userid: userId,
        },
      });

      if (res.status === 401) {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const newToken = await refreshAuthToken(userId, refreshToken);
          if (newToken) {
            return fetchProfile(userId, newToken); // Retry after refreshing token
          }
        }
      }

      if (!res.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      console.error(err);
      setError("Failed to load user data.");
      router.push(`/home/profile/edit?userId=${localStorage.getItem("userId")}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-80 h-40 bg-gray-300 animate-pulse rounded-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center text-red-600 bg-white p-6 rounded-lg shadow-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center text-gray-600 bg-white p-6 rounded-lg shadow-lg">
          No user data found.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full text-center">
        {/* Banner */}
        <div className="mb-8 relative">
          <Image
            src={user.banner || "/1.webp"}
            alt="User Banner"
            width={600}
            height={200}
            className="rounded-lg object-cover shadow-md"
          />
          {/* Profile Picture */}
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
            <Image
              src={user.pic || "/1.webp"}
              alt="Profile Picture"
              width={100}
              height={100}
              className="rounded-full border-4 border-white shadow-lg"
            />
          </div>
        </div>

        {/* User Details */}
        <div className="mt-16">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{user.name}</h1>

          <div className="text-left">
            <div className="mb-4">
              <label className="block text-gray-500 text-sm font-semibold">
                Contact
              </label>
              <p className="text-gray-700">{user.contact || "Not provided"}</p>
            </div>

            <div className="mb-4">
              <label className="block text-gray-500 text-sm font-semibold">
                About
              </label>
              <p className="text-gray-700">
                {user.about || "No bio available."}
              </p>
            </div>
          </div>
        </div>

        {/* Edit Profile Button */}
        <div className="mt-6">
          <button
            onClick={() => router.push(`/home/profile/edit?userId=${localStorage.getItem("userId")}`)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
