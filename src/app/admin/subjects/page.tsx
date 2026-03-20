'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

type Subject = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  sample_count: number;
  total_questions: number;
  is_active: boolean;
  display_order: number;
};

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '📚',
    color: 'from-blue-500 to-cyan-500',
    sample_count: 10,
  });

  useEffect(() => {
    checkAdmin();
    fetchSubjects();
  }, []);

  const checkAdmin = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      const { data } = await supabase.from('users').select('*').eq('id', authUser.id).single();
      if (data?.role !== 'admin') {
        window.location.href = '/dashboard';
      }
    } else {
      window.location.href = '/login';
    }
  };

  const fetchSubjects = async () => {
    try {
      const { data } = await supabase.from('subjects').select('*').order('display_order');
      if (data) setSubjects(data);
    } catch (err) {
      console.error('Error fetching subjects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSubject) {
      await supabase.from('subjects').update(formData).eq('id', editingSubject.id);
    } else {
      await supabase.from('subjects').insert([{
        ...formData,
        total_questions: 0,
        is_active: true,
        display_order: subjects.length,
      }]);
    }
    
    setShowModal(false);
    setEditingSubject(null);
    setFormData({ name: '', description: '', icon: '📚', color: 'from-blue-500 to-cyan-500', sample_count: 10 });
    fetchSubjects();
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      description: subject.description,
      icon: subject.icon,
      color: subject.color,
      sample_count: subject.sample_count,
    });
    setShowModal(true);
  };

  const toggleActive = async (subject: Subject) => {
    await supabase.from('subjects').update({ is_active: !subject.is_active }).eq('id', subject.id);
    fetchSubjects();
  };

  const deleteSubject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subject? All questions will also be deleted.')) return;
    await supabase.from('subjects').delete().eq('id', id);
    fetchSubjects();
  };

  const iconOptions = ['📚', '🌤️', '⚖️', '✈️', '🔧', '📡', '🛩️', '🗺️', '⛽', '🔒', '💻', '📖', '🎓', '🏆'];
  const colorOptions = [
    { name: 'Blue-Cyan', value: 'from-blue-500 to-cyan-500' },
    { name: 'Purple-Pink', value: 'from-purple-500 to-pink-500' },
    { name: 'Green-Emerald', value: 'from-green-500 to-emerald-500' },
    { name: 'Orange-Amber', value: 'from-orange-500 to-amber-500' },
    { name: 'Red-Rose', value: 'from-red-500 to-rose-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-white">← Back to Dashboard</Link>
          <span className="text-gray-600">|</span>
          <Link href="/admin" className="text-gray-400 hover:text-white">Questions</Link>
          <span className="text-gray-600">|</span>
          <Link href="/admin/users" className="text-gray-400 hover:text-white">Users</Link>
          <h1 className="text-xl font-bold">Subject Management</h1>
          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">Admin</span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">All Subjects ({subjects.length})</h2>
          <button
            onClick={() => {
              setEditingSubject(null);
              setFormData({ name: '', description: '', icon: '📚', color: 'from-blue-500 to-cyan-500', sample_count: 10 });
              setShowModal(true);
            }}
            className="px-4 py-2 bg-green-600 rounded-lg text-white font-medium hover:bg-green-700"
          >
            + Add Subject
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-gray-900/80 rounded-xl border ${subject.is_active ? 'border-gray-700/50' : 'border-red-500/30'} overflow-hidden`}
              >
                <div className={`h-2 bg-gradient-to-r ${subject.color}`} />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-4xl">{subject.icon}</span>
                    <span className={`px-2 py-1 rounded text-xs ${subject.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {subject.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{subject.name}</h3>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">{subject.description}</p>
                  <div className="flex gap-4 text-sm text-gray-500 mb-4">
                    <span>📝 {subject.total_questions} questions</span>
                    <span>🎁 {subject.sample_count} free</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(subject)}
                      className="flex-1 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggleActive(subject)}
                      className="py-2 px-3 bg-gray-700/50 text-gray-400 rounded-lg hover:bg-gray-700"
                    >
                      {subject.is_active ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => deleteSubject(subject.id)}
                      className="py-2 px-3 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {subjects.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No subjects yet. Create your first subject!</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-green-600 rounded-lg text-white font-medium"
            >
              + Add Subject
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-2xl border border-gray-700 p-6 w-full max-w-lg"
          >
            <h2 className="text-xl font-bold mb-4">{editingSubject ? 'Edit Subject' : 'Add New Subject'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Subject Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
                  placeholder="e.g., Aviation Meteorology"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
                  placeholder="Describe the subject..."
                  rows={3}
                  required
                />
              </div>

<div>
                <label className="block text-sm text-gray-400 mb-1">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`w-12 h-12 text-2xl rounded-lg border ${formData.icon === icon ? 'border-blue-500 bg-blue-500/20' : 'border-gray-700 hover:border-gray-600'}`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Color Theme</label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.value })}
                      className={`px-4 py-2 rounded-lg border ${formData.color === color.value ? 'border-blue-500 bg-blue-500/20' : 'border-gray-700 hover:border-gray-600'}`}
                    >
                      <div className={`w-20 h-3 rounded bg-gradient-to-r ${color.value}`} />
                      <span className="text-xs mt-1 block">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Free Sample Count</label>
                <input
                  type="number"
                  value={formData.sample_count}
                  onChange={(e) => setFormData({ ...formData, sample_count: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
                  min={0}
                />
                <p className="text-xs text-gray-500 mt-1">Number of free questions for non-premium users</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-gray-800 rounded-xl text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 rounded-xl text-white font-medium"
                >
                  {editingSubject ? 'Save Changes' : 'Add Subject'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
