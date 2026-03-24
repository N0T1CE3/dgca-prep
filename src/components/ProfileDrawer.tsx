'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { User } from '@/types';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function ProfileDrawer({ isOpen, onClose, user }: ProfileDrawerProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'help' | 'feedback'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackType, setFeedbackType] = useState<'bug' | 'suggestion' | 'complaint' | 'other'>('suggestion');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await supabase.from('users').update({ name }).eq('id', user.id);
      setIsEditing(false);
      window.location.reload();
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!user || !feedbackText.trim()) return;
    setSubmittingFeedback(true);
    try {
      await supabase.from('feedback').insert([{
        user_id: user.id,
        user_email: user.email,
        type: feedbackType,
        message: feedbackText.trim(),
      }]);
      setFeedbackSuccess(true);
      setFeedbackText('');
      setTimeout(() => {
        setFeedbackSuccess(false);
        setActiveTab('profile');
      }, 2000);
    } catch (err) {
      console.error('Error submitting feedback:', err);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const helpTopics = [
    {
      icon: '📚',
      title: 'How to Practice',
      content: 'Select a subject from the dashboard, then choose "Start Practice" to begin answering questions. You have 3 lives (health points) - wrong answers cost 1 life.'
    },
    {
      icon: '⭐',
      title: 'Earning XP',
      content: 'Earn XP by answering questions correctly. The faster you answer, the more XP you earn. Maintain your accuracy to climb the leaderboard!'
    },
    {
      icon: '👑',
      title: 'Premium Features',
      content: 'Upgrade to Premium for ₹100/month to access all questions, health bar system, and weekly leaderboard competitions.'
    },
    {
      icon: '🎯',
      title: 'Scoring System',
      content: 'Each correct answer: +10 XP. Streak bonus: +5 XP per 3 correct answers. Wrong answer: -1 health, no XP penalty.'
    },
    {
      icon: '📊',
      title: 'Progress Tracking',
      content: 'Your progress is automatically saved. View your stats on the leaderboard and track your improvement over time.'
    },
    {
      icon: '🔒',
      title: 'Account Security',
      content: 'Your account is secured with Supabase authentication. Use Google Sign-In for quick and secure access.'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-900 border-l border-gray-700 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Account</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* User Info */}
              <div className="mt-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-2xl font-bold">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-bold text-lg">{user?.name || 'User'}</p>
                  <p className="text-gray-400 text-sm">{user?.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {user?.is_premium ? (
                      <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">Premium</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-gray-700 text-gray-400 text-xs rounded-full">Free</span>
                    )}
                    {user?.role === 'admin' && (
                      <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">Admin</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-700">
              {[
                { id: 'profile', label: 'Profile', icon: '👤' },
                { id: 'help', label: 'Help', icon: '❓' },
                { id: 'feedback', label: 'Feedback', icon: '💬' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-4 text-center transition-colors ${
                    activeTab === tab.id
                      ? 'bg-gray-800 text-white border-b-2 border-blue-500'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <span className="block text-lg mb-1">{tab.icon}</span>
                  <span className="text-sm">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold mb-4">Profile Settings</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Display Name</label>
                        {isEditing ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
                              placeholder="Enter your name"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => setIsEditing(false)}
                                className="flex-1 py-2 bg-gray-700 rounded-lg text-white"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleSaveProfile}
                                disabled={saving}
                                className="flex-1 py-2 bg-blue-600 rounded-lg text-white disabled:opacity-50"
                              >
                                {saving ? 'Saving...' : 'Save'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                            <span>{user?.name || 'Not set'}</span>
                            <button
                              onClick={() => setIsEditing(true)}
                              className="px-3 py-1 text-blue-400 hover:bg-blue-500/20 rounded-lg"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Email</label>
                        <div className="p-4 bg-gray-800/50 rounded-xl">
                          <span className="text-gray-300">{user?.email}</span>
                          <span className="ml-2 text-xs text-green-400">Verified</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Total XP</label>
                        <div className="p-4 bg-gray-800/50 rounded-xl">
                          <span className="text-2xl font-bold text-yellow-400">⭐ {user?.total_xp || 0} XP</span>
                        </div>
                      </div>

                      {!user?.is_premium && (
                        <div className="p-4 bg-gradient-to-r from-yellow-900/30 to-amber-900/30 rounded-xl border border-yellow-500/30">
                          <h4 className="font-bold mb-2">Upgrade to Premium</h4>
                          <p className="text-sm text-gray-400 mb-3">Get access to all questions and features!</p>
                          <a
                            href="/pricing"
                            className="block w-full py-2 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg text-black font-bold text-center"
                          >
                            View Plans
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-700">
                    <button
                      onClick={handleLogout}
                      className="w-full py-3 bg-red-600/20 text-red-400 rounded-xl hover:bg-red-600/30 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}

              {/* Help Tab */}
              {activeTab === 'help' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold mb-4">Help & FAQ</h3>
                  
                  {helpTopics.map((topic, index) => (
                    <details key={index} className="bg-gray-800/50 rounded-xl overflow-hidden group">
                      <summary className="p-4 cursor-pointer flex items-center gap-3 hover:bg-gray-800 transition-colors list-none">
                        <span className="text-xl">{topic.icon}</span>
                        <span className="font-medium">{topic.title}</span>
                        <svg className="w-5 h-5 ml-auto transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="px-4 pb-4 text-gray-400 text-sm">
                        {topic.content}
                      </div>
                    </details>
                  ))}

                  <div className="pt-4">
                    <p className="text-sm text-gray-400 mb-2">Still need help?</p>
                    <a
                      href="mailto:support@dgca-prep.com"
                      className="block w-full py-3 bg-blue-600 rounded-xl text-white text-center font-medium hover:bg-blue-700 transition-colors"
                    >
                      Contact Support
                    </a>
                  </div>
                </div>
              )}

              {/* Feedback Tab */}
              {activeTab === 'feedback' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold mb-2">Send Feedback</h3>
                    <p className="text-sm text-gray-400">We'd love to hear from you! Help us improve.</p>
                  </div>

                  {feedbackSuccess ? (
                    <div className="text-center py-8">
                      <div className="text-5xl mb-4">✅</div>
                      <h4 className="text-xl font-bold text-green-400 mb-2">Thank You!</h4>
                      <p className="text-gray-400">Your feedback has been submitted successfully.</p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Feedback Type</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'bug', label: 'Bug Report', icon: '🐛' },
                            { id: 'suggestion', label: 'Suggestion', icon: '💡' },
                            { id: 'complaint', label: 'Complaint', icon: '😞' },
                            { id: 'other', label: 'Other', icon: '💬' }
                          ].map((type) => (
                            <button
                              key={type.id}
                              onClick={() => setFeedbackType(type.id as any)}
                              className={`p-3 rounded-xl border transition-colors ${
                                feedbackType === type.id
                                  ? 'border-blue-500 bg-blue-500/20 text-white'
                                  : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
}`}
                            >
                              <span className="block text-lg mb-1">{type.icon}</span>
                              <span className="text-sm">{type.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Your Feedback</label>
                        <textarea
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          placeholder="Tell us what you think..."
                          className="w-full h-40 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white resize-none"
                        />
                      </div>

                      <button
                        onClick={handleSubmitFeedback}
                        disabled={submittingFeedback || !feedbackText.trim()}
                        className="w-full py-3 bg-blue-600 rounded-xl text-white font-bold disabled:opacity-50 hover:bg-blue-700 transition-colors"
                      >
                        {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                      </button>

                      <p className="text-xs text-gray-500 text-center">
                        Your feedback helps us improve the app for everyone.
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
