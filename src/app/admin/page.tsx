'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'subjects' | 'questions'>('subjects');
  const [subjects, setSubjects] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', description: '', icon: '📚' });

  useEffect(() => { fetchSubjects(); }, []);

  const fetchSubjects = async () => {
    const { data } = await supabase.from('subjects').select('*').order('display_order');
    if (data) setSubjects(data);
  };

  const addSubject = async () => {
    await supabase.from('subjects').insert([{ ...newSubject, is_active: true, sample_count: 10, total_questions: 0, display_order: subjects.length }]);
    fetchSubjects(); setShowModal(false); setNewSubject({ name: '', description: '', icon: '📚' });
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-white">← Back</Link>
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-4 mb-8">
          {['subjects', 'questions'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-6 py-3 rounded-xl font-medium capitalize ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}>{tab}</button>
          ))}
        </div>

        {activeTab === 'subjects' && (
          <div>
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-bold">Manage Subjects</h2>
              <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-green-600 rounded-lg text-white font-medium">+ Add Subject</button>
            </div>
            <div className="grid gap-4">
              {subjects.map((s) => (
                <div key={s.id} className="bg-gray-900/80 rounded-xl border border-gray-700/50 p-4 flex justify-between items-center">
                  <div><h3 className="font-bold">{s.name}</h3><p className="text-sm text-gray-400">{s.description}</p></div>
                  <span className={`px-2 py-1 rounded text-xs ${s.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{s.is_active ? 'Active' : 'Inactive'}</span>
                </div>
              ))}
              {subjects.length === 0 && <p className="text-gray-400 text-center py-8">No subjects yet. Add your first subject!</p>}
            </div>
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="bg-gray-900/80 rounded-xl border border-gray-700/50 p-6">
            <h2 className="text-xl font-bold mb-4">Question Management</h2>
            <p className="text-gray-400 mb-4">Add questions individually or import via CSV.</p>
            <div className="p-4 bg-gray-800/50 rounded-lg"><p className="text-sm text-gray-300">CSV Format:</p><code className="text-xs text-green-400">question,option_a,option_b,option_c,option_d,correct_answer,explanation</code></div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-gray-900 rounded-2xl border border-gray-700 p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Subject</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Subject Name" value={newSubject.name} onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white" />
              <textarea placeholder="Description" value={newSubject.description} onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white" rows={3} />
              <input type="text" placeholder="Icon (emoji)" value={newSubject.icon} onChange={(e) => setNewSubject({ ...newSubject, icon: e.target.value })} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white" />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-gray-800 rounded-xl text-white font-medium">Cancel</button>
              <button onClick={addSubject} className="flex-1 py-3 bg-blue-600 rounded-xl text-white font-medium">Add Subject</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
