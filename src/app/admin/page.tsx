'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

type Subject = {
  id: string;
  name: string;
  description: string;
  icon: string;
  is_active: boolean;
};

type Question = {
  id: string;
  subject_id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string;
  is_sample: boolean;
  is_active: boolean;
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'subjects' | 'questions'>('subjects');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', description: '', icon: '📚' });
  const [newQuestion, setNewQuestion] = useState({
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: 'A',
    explanation: '',
    is_sample: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => { 
    fetchSubjects(); 
    if (activeTab === 'questions') fetchQuestions();
  }, [activeTab]);

  const fetchSubjects = async () => {
    const { data } = await supabase.from('subjects').select('*').order('display_order');
    if (data) setSubjects(data);
  };

  const fetchQuestions = async () => {
    let query = supabase.from('questions').select('*').order('created_at', { ascending: false });
    if (selectedSubject) query = query.eq('subject_id', selectedSubject);
    const { data } = await query.limit(50);
    if (data) setQuestions(data);
  };

  const addSubject = async () => {
    if (!newSubject.name.trim()) return;
    setLoading(true);
    await supabase.from('subjects').insert([{ 
      ...newSubject, 
      is_active: true, 
      sample_count: 10, 
      total_questions: 0, 
      display_order: subjects.length 
    }]);
    fetchSubjects(); 
    setShowSubjectModal(false); 
    setNewSubject({ name: '', description: '', icon: '📚' });
    setLoading(false);
  };

  const addQuestion = async () => {
    if (!newQuestion.question_text.trim() || !selectedSubject) return;
    setLoading(true);
    await supabase.from('questions').insert([{
      subject_id: selectedSubject,
      ...newQuestion,
      is_active: true,
    }]);
    fetchQuestions();
    setShowQuestionModal(false);
    setNewQuestion({
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_answer: 'A',
      explanation: '',
      is_sample: false,
    });
    setLoading(false);
  };

  const toggleSubjectActive = async (subject: Subject) => {
    await supabase.from('subjects').update({ is_active: !subject.is_active }).eq('id', subject.id);
    fetchSubjects();
  };

  const toggleQuestionActive = async (question: Question) => {
    await supabase.from('questions').update({ is_active: !question.is_active }).eq('id', question.id);
    fetchQuestions();
  };

  const deleteQuestion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    await supabase.from('questions').delete().eq('id', id);
    fetchQuestions();
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-white">← Back</Link>
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">Admin</span>
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
              <button onClick={() => setShowSubjectModal(true)} className="px-4 py-2 bg-green-600 rounded-lg text-white font-medium">+ Add Subject</button>
            </div>
            <div className="grid gap-4">
              {subjects.map((s) => (
                <div key={s.id} className="bg-gray-900/80 rounded-xl border border-gray-700/50 p-4 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{s.icon}</span>
                    <div><h3 className="font-bold">{s.name}</h3><p className="text-sm text-gray-400">{s.description}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleSubjectActive(s)} className={`px-3 py-1 rounded text-xs ${s.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{s.is_active ? 'Active' : 'Inactive'}</button>
                  </div>
                </div>
              ))}
              {subjects.length === 0 && <p className="text-gray-400 text-center py-8">No subjects yet. Add your first subject!</p>}
            </div>
          </div>
        )}

        {activeTab === 'questions' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-4 items-center">
                <h2 className="text-xl font-bold">Manage Questions</h2>
                <select value={selectedSubject} onChange={(e) => { setSelectedSubject(e.target.value); }} className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white">
                  <option value="">All Subjects</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <button onClick={() => setShowQuestionModal(true)} disabled={subjects.length === 0} className="px-4 py-2 bg-green-600 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed">+ Add Question</button>
            </div>
            
            <div className="space-y-3">
              {questions.map((q) => (
                <div key={q.id} className="bg-gray-900/80 rounded-xl border border-gray-700/50 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-1 rounded text-xs ${q.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{q.is_active ? 'Active' : 'Inactive'}</span>
                    <div className="flex gap-2">
                      <button onClick={() => toggleQuestionActive(q)} className="px-2 py-1 bg-gray-700 rounded text-xs">{q.is_active ? 'Deactivate' : 'Activate'}</button>
                      <button onClick={() => deleteQuestion(q.id)} className="px-2 py-1 bg-red-700 rounded text-xs">Delete</button>
</div>
                  </div>
                  <p className="font-medium mb-2">{q.question_text}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                    <span>A: {q.option_a}</span>
                    <span>B: {q.option_b}</span>
                    <span>C: {q.option_c}</span>
                    <span>D: {q.option_d}</span>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="text-green-400">Answer: {q.correct_answer}</span>
                    {q.explanation && <p className="text-gray-500 text-xs mt-1">Explanation: {q.explanation}</p>}
                  </div>
                </div>
              ))}
              {questions.length === 0 && <p className="text-gray-400 text-center py-8">No questions yet. Add your first question!</p>}
            </div>
          </div>
        )}
      </div>

      {/* Add Subject Modal */}
      {showSubjectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-gray-900 rounded-2xl border border-gray-700 p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Subject</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Subject Name" value={newSubject.name} onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white" />
              <textarea placeholder="Description" value={newSubject.description} onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white" rows={3} />
              <input type="text" placeholder="Icon (emoji)" value={newSubject.icon} onChange={(e) => setNewSubject({ ...newSubject, icon: e.target.value })} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white" />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowSubjectModal(false)} className="flex-1 py-3 bg-gray-800 rounded-xl text-white font-medium">Cancel</button>
              <button onClick={addSubject} disabled={loading} className="flex-1 py-3 bg-blue-600 rounded-xl text-white font-medium disabled:opacity-50">{loading ? 'Adding...' : 'Add Subject'}</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Question Modal */}
      {showQuestionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-gray-900 rounded-2xl border border-gray-700 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add New Question</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Subject</label>
                <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white">
                  <option value="">Select Subject</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Question Text</label>
                <textarea value={newQuestion.question_text} onChange={(e) => setNewQuestion({ ...newQuestion, question_text: e.target.value })} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white" rows={3} placeholder="Enter your question..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Option A</label>
                  <input type="text" value={newQuestion.option_a} onChange={(e) => setNewQuestion({ ...newQuestion, option_a: e.target.value })} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white" placeholder="Option A" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Option B</label>
                  <input type="text" value={newQuestion.option_b} onChange={(e) => setNewQuestion({ ...newQuestion, option_b: e.target.value })} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white" placeholder="Option B" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Option C</label>
                  <input type="text" value={newQuestion.option_c} onChange={(e) => setNewQuestion({ ...newQuestion, option_c: e.target.value })} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white" placeholder="Option C" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Option D</label>
                  <input type="text" value={newQuestion.option_d} onChange={(e) => setNewQuestion({ ...newQuestion, option_d: e.target.value })} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white" placeholder="Option D" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Correct Answer</label>
                  <select value={newQuestion.correct_answer} onChange={(e) => setNewQuestion({ ...newQuestion, correct_answer: e.target.value })} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white">
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Sample Question?</label>
                  <select value={newQuestion.is_sample ? 'true' : 'false'} onChange={(e) => setNewQuestion({ ...newQuestion, is_sample: e.target.value === 'true' })} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white">
                    <option value="true">Yes (Free)</option>
                    <option value="false">No (Premium)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Explanation (Why correct answer)</label>
                <textarea value={newQuestion.explanation} onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white" rows={2} placeholder="Explain why the answer is correct..." />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowQuestionModal(false)} className="flex-1 py-3 bg-gray-800 rounded-xl text-white font-medium">Cancel</button>
              <button onClick={addQuestion} disabled={loading || !selectedSubject} className="flex-1 py-3 bg-blue-600 rounded-xl text-white font-medium disabled:opacity-50">{loading ? 'Adding...' : 'Add Question'}</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
