'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { LeaderboardEntry } from '@/types';

export function Leaderboard() {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('weekly_leaderboard')
        .select('*')
        .limit(10);
      
      if (data) {
        setLeaders(data.map((item, index) => ({ ...item, rank: index + 1 })));
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const findMyRank = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('weekly_leaderboard')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (data) {
        setCurrentUserRank(data.rank);
      }
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'from-yellow-500/20 to-amber-500/20 border-yellow-500/50';
    if (rank === 2) return 'from-gray-400/20 to-gray-500/20 border-gray-400/50';
    if (rank === 3) return 'from-orange-600/20 to-orange-700/20 border-orange-600/50';
    return 'from-gray-800/50 to-gray-900/50 border-gray-700/50';
  };

  if (loading) {
    return (
      <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-800/50 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-blue-600/10 to-cyan-600/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Top Pilots of the Week</h2>
              <p className="text-sm text-gray-400">Flight Log Rankings</p>
            </div>
          </div>
          <button
            onClick={findMyRank}
            className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg text-blue-400 text-sm font-medium transition-all"
          >
            Find My Rank
          </button>
        </div>
      </div>

      {/* Podium for Top 3 */}
      {leaders.length >= 3 && (
        <div className="p-6 bg-gradient-to-b from-gray-800/30 to-transparent">
          <div className="flex items-end justify-center gap-4">
            {/* 2nd Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-20 h-20 mx-auto mb-2 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 p-1">
                <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-2xl">
                  {leaders[1]?.avatar_url ? (
                    <img src={leaders[1].avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : '✈️'}
                </div>
              </div>
              <div className="text-2xl mb-1">🥈</div>
              <p className="text-sm font-semibold text-white truncate w-24">{leaders[1]?.name}</p>
              <p className="text-xs text-gray-400">{leaders[1]?.total_xp.toLocaleString()} XP</p>
              <div className="mt-2 h-16 w-20 bg-gradient-to-t from-gray-500/30 to-gray-400/10 rounded-t-lg" />
            </motion.div>

            {/* 1st Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center -mt-4"
            >
              <div className="w-24 h-24 mx-auto mb-2 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 p-1 ring-4 ring-yellow-500/30">
                <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-3xl">
                  {leaders[0]?.avatar_url ? (
                    <img src={leaders[0].avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : '👨‍✈️'}
                </div>
              </div>
              <div className="text-3xl mb-1">🥇</div>
              <p className="text-sm font-bold text-yellow-400 truncate w-28">{leaders[0]?.name}</p>
              <p className="text-xs text-yellow-400/70">{leaders[0]?.total_xp.toLocaleString()} XP</p>
              <div className="mt-2 h-24 w-24 bg-gradient-to-t from-yellow-500/30 to-yellow-400/10 rounded-t-lg" />
            </motion.div>

            {/* 3rd Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="w-20 h-20 mx-auto mb-2 rounded-full bg-gradient-to-br from-orange-600 to-orange-700 p-1">
                <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-2xl">
                  {leaders[2]?.avatar_url ? (
                    <img src={leaders[2].avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : '🛩️'}
                </div>
              </div>
              <div className="text-2xl mb-1">🥉</div>
              <p className="text-sm font-semibold text-white truncate w-24">{leaders[2]?.name}</p>
              <p className="text-xs text-gray-400">{leaders[2]?.total_xp.toLocaleString()} XP</p>
              <div className="mt-2 h-12 w-20 bg-gradient-to-t from-orange-600/30 to-orange-500/10 rounded-t-lg" />
            </motion.div>
          </div>
        </div>
      )}

      {/* Rest of the list */}
      <div className="p-4 space-y-2">
        {leaders.slice(3).map((leader, index) => (
          <motion.div
            key={leader.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className={`flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r ${getRankStyle(leader.rank)} border backdrop-blur-sm`}
          >
<span className="w-8 text-center font-bold text-gray-400">#{leader.rank}</span>
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
              {leader.avatar_url ? (
                <img src={leader.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
              ) : '✈️'}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white">{leader.name}</p>
              <p className="text-xs text-gray-400">{leader.accuracy_rate}% accuracy</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-cyan-400">{leader.total_xp.toLocaleString()}</p>
              <p className="text-xs text-gray-500">XP</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Current user rank notification */}
      {currentUserRank && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="m-4 p-4 bg-blue-500/20 border border-blue-500/50 rounded-xl"
        >
          <p className="text-center text-blue-400">
            Your current rank: <span className="font-bold text-white">#{currentUserRank}</span>
          </p>
        </motion.div>
      )}
    </div>
  );
}
