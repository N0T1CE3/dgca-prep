'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AdminSetupPage() {
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSetAdmin = async () => {
    if (!userId.trim()) {
      setError('Please enter a User ID');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId.trim(), role: 'admin' }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to set admin');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <span className="text-3xl">✈️</span>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">DGCA Prep</span>
        </Link>

        <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8">
          <h1 className="text-2xl font-bold text-center mb-2">Admin Setup</h1>
          <p className="text-gray-400 text-center mb-6">Set up admin privileges for a user</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">User ID (UUID)</label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white"
                placeholder="Enter Supabase User ID"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {result && (
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
                ✓ {result.message}
              </div>
            )}

            <button
              onClick={handleSetAdmin}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl text-black font-bold disabled:opacity-50"
            >
              {loading ? 'Setting Admin...' : 'Set as Admin'}
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-800/50 rounded-xl">
            <h3 className="text-sm font-bold mb-2">How to get User ID:</h3>
            <ol className="text-sm text-gray-400 space-y-1">
              <li>1. Go to Supabase Dashboard</li>
              <li>2. Select your project → Authentication → Users</li>
              <li>3. Click on the user you want to make admin</li>
              <li>4. Copy the User ID from the user details</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
