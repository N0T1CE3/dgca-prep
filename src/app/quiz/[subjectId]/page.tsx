'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { QuizCard } from '@/components/quiz/QuizCard';
import { HealthBar } from '@/components/quiz/HealthBar';
import type { Question } from '@/types';

const demoQuestions: Question[] = [
  { id: '1', subject_id: 'met', question_text: 'Lowest layer of atmosphere is .........', option_a: 'Troposphere', option_b: 'Tropopause', option_c: 'Stratosphere', option_d: 'Mesosphere', correct_answer: 'A', explanation: 'The Troposphere is the lowest portion of the atmosphere, containing about 70% of the atmospheric mass.', is_sample: true, is_active: true, created_at: '' },
  { id: '2', subject_id: 'met', question_text: 'Height of Tropopause at equator is .........', option_a: '10-12 km', option_b: '16-18 km', option_c: '12-14 km', option_d: '8-10 km', correct_answer: 'B', explanation: 'The tropopause height is greatest at the equator, extending to 16-18 km.', is_sample: true, is_active: true, created_at: '' },
  { id: '3', subject_id: 'met', question_text: 'Atmosphere is heated by .........', option_a: 'Solar Radiation', option_b: 'Heat from earth surface', option_c: 'From above', option_d: 'All of the above', correct_answer: 'B', explanation: 'The atmosphere is primarily heated from below by the earth\'s surface.', is_sample: true, is_active: true, created_at: '' },
];

export default function QuizPage({ params }: { params: { subjectId: string } }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [health, setHealth] = useState(100);
  const [xp, setXp] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [results, setResults] = useState({ correct: 0, total: 0 });

  const handleAnswer = (_answer: string, isCorrect: boolean) => {
    setHealth(prev => Math.max(0, Math.min(100, prev + (isCorrect ? 5 : -10))));
    setXp(prev => prev + (isCorrect ? 10 : 0));
    setResults(prev => ({ correct: prev.correct + (isCorrect ? 1 : 0), total: prev.total + 1 }));
    setTimeout(() => currentIndex < demoQuestions.length - 1 ? setCurrentIndex(prev => prev + 1) : setIsComplete(true), 2000);
  };

  if (isComplete) {
    const accuracy = Math.round((results.correct / results.total) * 100);
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-gray-900/80 rounded-2xl border border-gray-700/50 p-8 text-center">
          <div className="text-6xl mb-4">{accuracy >= 80 ? '🏆' : '💪'}</div>
          <h1 className="text-2xl font-bold mb-6">Quiz Complete!</h1>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800/50 rounded-xl p-4"><p className="text-2xl font-bold text-green-400">{results.correct}</p><p className="text-xs text-gray-400">Correct</p></div>
            <div className="bg-gray-800/50 rounded-xl p-4"><p className="text-2xl font-bold text-blue-400">{accuracy}%</p><p className="text-xs text-gray-400">Accuracy</p></div>
            <div className="bg-gray-800/50 rounded-xl p-4"><p className="text-2xl font-bold text-yellow-400">+{xp}</p><p className="text-xs text-gray-400">XP</p></div>
          </div>
          <button onClick={() => { setCurrentIndex(0); setIsComplete(false); setResults({ correct: 0, total: 0 }); setHealth(100); setXp(0); }} className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl text-white font-semibold mb-3">Try Again</button>
          <Link href="/dashboard" className="block w-full py-3 bg-gray-800 rounded-xl text-white font-semibold">Back to Dashboard</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-gray-400 hover:text-white">← Back</Link>
          <h1 className="font-bold">{params.subjectId === 'meteorology' ? 'Aviation Meteorology' : 'Air Regulations'}</h1>
          <span className="text-yellow-400 font-bold">⭐ {xp} XP</span>
        </div>
      </nav>
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-6"><HealthBar health={health} size="md" /></div>
        <QuizCard question={demoQuestions[currentIndex]} questionNumber={currentIndex + 1} totalQuestions={demoQuestions.length} onAnswer={handleAnswer} isPremium={true} />
      </div>
    </div>
  );
}
