'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { HealthBar } from '@/components/quiz/HealthBar';
import type { User } from '@/types';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { window.location.href = '/login'; return; }
      const { data } = await supabase.from('users').select('*').eq('id', authUser.id).single();
      if (data) setUser(data);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" /></div>;

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">✈️</span>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">DGCA Prep</span>
          </Link>
          <div className="flex items-center gap-4">
            {user?.role === 'admin' && (
              <Link href="/admin" className="px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-400 font-medium">
                Admin Panel
              </Link>
            )}
            <div className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <span className="font-bold text-yellow-400">⭐ {user?.total_xp || 0} XP</span>
            </div>
            {!user?.is_premium && <Link href="/pricing" className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg text-black font-medium">Upgrade</Link>}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center font-bold">{user?.name?.charAt(0)}</div>
            <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/'; }} className="p-2 text-gray-400 hover:text-white">Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl border border-blue-500/30 p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0]}! 👨‍✈️</h1>
              <p className="text-gray-400">Ready to continue your flight training?</p>
            </div>
            {user?.role === 'admin' && (
              <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-full text-yellow-400 text-sm font-medium">
                Admin
              </span>
            )}
          </div>
        </motion.div>

        {user?.is_premium && <div className="mb-8"><HealthBar health={100} size="lg" /></div>}

        <h2 className="text-xl font-bold mb-4">Question Banks</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div whileHover={{ scale: 1.02 }} className="bg-gray-900/80 rounded-2xl border border-gray-700/50 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500" />
            <div className="p-6">
              <div className="text-4xl mb-4">🌤️</div>
              <h3 className="text-xl font-bold mb-2">Aviation Meteorology</h3>
              <p className="text-gray-400 text-sm mb-4">IC Joshi - Complete question bank</p>
              <p className="text-sm text-gray-500 mb-6">📝 500+ Questions • 📖 35 Chapters</p>
              <Link href="/quiz/meteorology" className="block w-full py-3 text-center bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl text-white font-semibold">Start Practice</Link>
            </div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} className="bg-gray-900/80 rounded-2xl border border-gray-700/50 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500" />
            <div className="p-6">
              <div className="text-4xl mb-4">⚖️</div>
              <h3 className="text-xl font-bold mb-2">Air Regulations</h3>
              <p className="text-gray-400 text-sm mb-4">RK Bali - DGCA style questions</p>
              <p className="text-sm text-gray-500 mb-6">📝 1000+ Questions • 📖 20 Chapters</p>
              <Link href="/quiz/regulations" className="block w-full py-3 text-center bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl text-white font-semibold">Start Practice</Link>
            </div>
          </motion.div>
        </div>

        {user?.role === 'admin' && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4 text-yellow-400">Admin Section</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/admin" className="bg-gray-900/80 rounded-xl border border-yellow-500/30 p-6 hover:border-yellow-500/60 transition-colors">
                <div className="text-3xl mb-3">📝</div>
                <h3 className="font-bold mb-1">Manage Questions</h3>
                <p className="text-sm text-gray-400">Add, edit, or delete questions</p>
              </Link>
              <Link href="/admin/users" className="bg-gray-900/80 rounded-xl border border-yellow-500/30 p-6 hover:border-yellow-500/60 transition-colors">
                <div className="text-3xl mb-3">👥</div>
                <h3 className="font-bold mb-1">Manage Users</h3>
                <p className="text-sm text-gray-400">View and manage user accounts</p>
              </Link>
              <Link href="/admin/subjects" className="bg-gray-900/80 rounded-xl border border-yellow-500/30 p-6 hover:border-yellow-500/60 transition-colors">
                <div className="text-3xl mb-3">📚</div>
                <h3 className="font-bold mb-1">Manage Subjects</h3>
                <p className="text-sm text-gray-400">Add or edit subjects</p>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
