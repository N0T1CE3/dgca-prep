'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AdminSetupPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser(authUser);
        
        // Check if user already exists in users table
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();
        
        if (!userData) {
          // Create user profile first
          await supabase.from('users').insert([{
            id: authUser.id,
            email: authUser.email,
            name: authUser.user_metadata?.name || authUser.email?.split('@')[0],
            role: 'user'
          }]);
        }
      } else {
        // Redirect to login
        window.location.href = '/login';
      }
    } catch (err) {
      console.error('Auth check error:', err);
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleSetAdmin = async () => {
    if (!user) {
      setError('Please login first');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Update directly using the client - user can update their own profile
      const { data, error: updateError } = await supabase
        .from('users')
        .update({ role: 'admin' })
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) {
        // If RLS prevents this, show error with instructions
        if (updateError.code === '42501') {
          setError('Permission denied. Please add SUPABASE_SERVICE_ROLE_KEY to Vercel env vars, or set role manually in Supabase dashboard.');
        } else {
          setError(updateError.message);
        }
      } else {
        setResult({ message: 'You are now an admin! Go to /admin to manage questions.' });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <span className="text-3xl">✈️</span>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">DGCA Prep</span>
        </Link>

        <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8">
          <h1 className="text-2xl font-bold text-center mb-2">Admin Setup</h1>
          <p className="text-gray-400 text-center mb-6">Make yourself an admin user</p>

          {user && (
            <div className="mb-6 p-4 bg-gray-800/50 rounded-xl">
              <p className="text-sm text-gray-400 mb-1">Logged in as:</p>
              <p className="font-medium">{user.email}</p>
              <p className="text-xs text-gray-500 mt-1">ID: {user.id}</p>
            </div>
          )}

          <div className="space-y-4">
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
              disabled={loading || !user}
              className="w-full py-3 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl text-black font-bold disabled:opacity-50"
            >
              {loading ? 'Setting Admin...' : 'Make Me Admin'}
            </button>

            <Link href="/dashboard" className="block w-full py-3 text-center bg-gray-800 rounded-xl text-white font-medium">
              Go to Dashboard
            </Link>
          </div>

          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
            <h3 className="text-sm font-bold mb-2 text-blue-400">Note:</h3>
            <p className="text-sm text-gray-400">
              If you get a permission error, you'll need to set the role manually in Supabase:
            </p>
            <ol className="text-sm text-gray-400 space-y-1 mt-2">
              <li>1. Go to Supabase Dashboard → Table Editor → users</li>
              <li>2. Find your user row</li>
              <li>3. Click edit and change role to 'admin'</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
