'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Subject } from '@/types';

interface SubjectCardProps {
  subject: Subject;
  progress?: { completed: number; total: number; accuracy: number };
  isPremium: boolean;
}

export function SubjectCard({ subject, progress, isPremium }: SubjectCardProps) {
  const completionRate = progress ? (progress.completed / progress.total) * 100 : 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden hover:border-gray-600/50 transition-all shadow-xl"
    >
      <div className={`h-2 bg-gradient-to-r ${subject.color || 'from-blue-500 to-cyan-500'}`} />
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-gray-800/50 rounded-xl text-3xl">
            {subject.icon || '📚'}
          </div>
          {!isPremium && (
            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full">
              {subject.sample_count} Free
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-white mb-2">{subject.name}</h3>
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{subject.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
          <span>{subject.total_questions} Questions</span>
          {progress && <span>{progress.accuracy}% Accuracy</span>}
        </div>

        {progress && (
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">Progress</span>
              <span className="text-blue-400">{Math.round(completionRate)}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        )}

        <Link
          href={`/quiz/${subject.id}`}
          className="block w-full py-3 text-center bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 rounded-xl text-white font-semibold transition-all"
        >
          {progress && progress.completed > 0 ? 'Continue Practice' : 'Start Practice'}
        </Link>
      </div>
    </motion.div>
  );
}
