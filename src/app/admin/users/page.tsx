'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  is_premium: boolean;
  premium_expires_at: string | null;
  total_xp: number;
  created_at: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    checkAdmin();
    fetchUsers();
  }, []);

  const checkAdmin = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      const { data } = await supabase.from('users').select('*').eq('id', authUser.id).single();
      if (data?.role !== 'admin') {
        window.location.href = '/dashboard';
      } else {
        setCurrentUser(data);
      }
    } else {
      window.location.href = '/login';
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (data) setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, role: 'user' | 'admin') => {
    setActionLoading(true);
    try {
      await supabase.from('users').update({ role }).eq('id', userId);
      fetchUsers();
      if (selectedUser?.id === userId) {
        setSelectedUser({ ...selectedUser, role });
      }
    } catch (err) {
      console.error('Error updating role:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const togglePremium = async (userId: string, isPremium: boolean) => {
    setActionLoading(true);
    try {
      const updates: any = { is_premium: !isPremium };
      if (isPremium) {
        updates.premium_expires_at = null;
      } else {
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 30);
        updates.premium_expires_at = expiry.toISOString();
      }
      await supabase.from('users').update(updates).eq('id', userId);
      fetchUsers();
    } catch (err) {
      console.error('Error toggling premium:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchEmail.toLowerCase()) ||
    u.name?.toLowerCase().includes(searchEmail.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-white">← Back to Dashboard</Link>
          <span className="text-gray-600">|</span>
          <Link href="/admin" className="text-gray-400 hover:text-white">Questions</Link>
          <h1 className="text-xl font-bold">User Management</h1>
          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">Admin</span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">All Users ({users.length})</h2>
          <input
            type="text"
            placeholder="Search by email or name..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white w-64"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="bg-gray-900/80 rounded-xl border border-gray-700/50 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">User</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Premium</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">XP</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Joined</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-800/30">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{user.name || 'No name'}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-700 text-gray-400'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${user.is_premium ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                        {user.is_premium ? 'Premium' : 'Free'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-yellow-400 font-medium">{user.total_xp || 0}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateUserRole(user.id, user.role === 'admin' ? 'user' : 'admin')}
                          disabled={actionLoading || user.id === currentUser?.id}
                          className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded text-xs hover:bg-blue-600/30 disabled:opacity-50"
                        >
                          {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                        </button>
                        <button
                          onClick={() => togglePremium(user.id, user.is_premium)}
                          disabled={actionLoading}
                          className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded text-xs hover:bg-purple-600/30"
                        >
                          {user.is_premium ? 'Revoke Premium' : 'Give Premium'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <p className="text-center py-8 text-gray-400">No users found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
