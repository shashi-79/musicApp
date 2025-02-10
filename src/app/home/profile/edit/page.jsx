'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';

export default function EditProfile() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    about: '',
    pic: null,
    banner: null, // New field for banner image
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserId(localStorage.getItem('userId'));
      setAccessToken(localStorage.getItem('accessToken'));
      setRefreshToken(localStorage.getItem('refreshToken'));
    }
  }, []);

  useEffect(() => {
    if (userId && accessToken) {
      fetchProfile();
    }
    return () => {
      if (formData.pic) URL.revokeObjectURL(formData.pic);
      if (formData.banner) URL.revokeObjectURL(formData.banner);
    };
  }, [userId, accessToken]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/home/profile/api/profile/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          userid: userId,
        },
      });

      if (response.status === 401 && retryCount < 3) {
        await refreshAccessToken();
        setRetryCount(retryCount + 1);
        fetchProfile();
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch user data.');

      const { user } = await response.json();
      setUser(user);
      setFormData({
        name: user.name || '',
        contact: user.contact || '',
        about: user.about || '',
        pic: null,
        banner: null,
      });
    } catch (err) {
      console.error(err);
      alert('Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const { data } = await axios.post('/auth/api/token', { userId, refreshToken });
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      setAccessToken(data.accessToken);
    } catch (err) {
      console.error('Failed to refresh token:', err);
      alert('Session expired. Please log in again.');
      router.push('/');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setFormData((prev) => ({ ...prev, [type]: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const form = new FormData();
    form.append('name', formData.name);
    form.append('contact', formData.contact);
    form.append('about', formData.about);
    if (formData.pic) form.append('pic', formData.pic);
    if (formData.banner) form.append('banner', formData.banner); // Append banner image

    try {
      const response = await fetch(`/home/profile/api/profile/${userId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          userid: userId,
        },
        body: form,
      });

      if (response.status === 401 && retryCount < 3) {
        await refreshAccessToken();
        setRetryCount(retryCount + 1);
        handleSubmit(e);
        return;
      }

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || 'Error updating profile');
      }

      alert('Profile updated successfully!');
      router.push(`/`);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Edit Profile</h2>

        {/* Banner Image */}
        <div className="mb-6">
          <Image
            src={formData.banner ? URL.createObjectURL(formData.banner) : user?.banner || '/default-banner.jpg'}
            alt="Banner"
            width={600}
            height={200}
            className="rounded-lg w-full h-32 object-cover"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, 'banner')}
            className="mt-2"
            aria-label="Upload Banner Image"
          />
        </div>

        <form onSubmit={handleSubmit}>
          {/* Profile Picture */}
          <div className="mb-6 flex justify-center">
            <Image
              src={formData.pic ? URL.createObjectURL(formData.pic) : user?.pic || '/1.webp'}
              alt="Profile Picture"
              width={100}
              height={100}
              className="rounded-full border-2 border-gray-300"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'pic')}
              className="mt-2"
              aria-label="Upload Profile Picture"
            />
          </div>

          {/* Name */}
          <div className="mb-4">
            <label className="block text-gray-600">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full text-sm text-gray-600 border border-gray-300 rounded p-2"
              required
            />
          </div>

          {/* Contact */}
          <div className="mb-4">
            <label className="block text-gray-600">Contact</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="w-full text-sm text-gray-600 border border-gray-300 rounded p-2"
              required
            />
          </div>

          {/* About */}
          <div className="mb-6">
            <label className="block text-gray-600">About</label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              className="w-full text-sm text-gray-600 border border-gray-300 rounded p-2"
              rows="4"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
