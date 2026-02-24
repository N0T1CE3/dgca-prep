'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Question } from '@/types';
import { HealthBar } from './HealthBar';
import { useStore } from '@/store/useStore';

interface QuizCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: string, isCorrect: boolean) => void;
  isPremium: boolean;
}

export function QuizCard({ question, questionNumber, totalQuestions, onAnswer, isPremium }: QuizCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const { quizState } = useStore();

  const options = [
    { key: 'A', text: question.option_a },
    { key: 'B', text: question.option_b },
    { key: 'C', text: question.option_c },
    { key: 'D', text: question.option_d },
  ];

  const handleSelect = (key: string) => {
    if (showResult) return;
    setSelectedAnswer(key);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    const correct = selectedAnswer === question.correct_answer;
    setIsCorrect(correct);
    setShowResult(true);
    
    setTimeout(() => {
      onAnswer(selectedAnswer, correct);
      setSelectedAnswer(null);
      setShowResult(false);
    }, 2000);
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 shadow-2xl">
      {/* Header with progress and health */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">
            Question {questionNumber} of {totalQuestions}
          </span>
          <div className="h-2 w-32 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
              animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
        {isPremium && quizState && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-yellow-400">+{quizState.xp} XP</span>
          </div>
        )}
      </div>

      {/* Health Bar for premium users */}
      {isPremium && quizState && (
        <div className="mb-6">
          <HealthBar health={quizState.health} size="md" />
        </div>
      )}

      {/* Question */}
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <h2 className="text-xl font-semibold text-white leading-relaxed">
          {question.question_text}
        </h2>
      </motion.div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {options.map((option) => (
          <motion.button
            key={option.key}
            onClick={() => handleSelect(option.key)}
            disabled={showResult}
            className={`w-full p-4 rounded-xl text-left transition-all duration-300 border ${
              showResult
                ? option.key === question.correct_answer
                  ? 'bg-green-500/20 border-green-500 text-green-300'
                  : option.key === selectedAnswer
                  ? 'bg-red-500/20 border-red-500 text-red-300'
                  : 'bg-gray-800/50 border-gray-700 text-gray-400'
                : selectedAnswer === option.key
                ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600'
            }`}
            whileHover={!showResult ? { scale: 1.01 } : {}}
            whileTap={!showResult ? { scale: 0.99 } : {}}
          >
            <div className="flex items-center gap-4">
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                showResult
                  ? option.key === question.correct_answer
                    ? 'bg-green-500 text-white'
                    : option.key === selectedAnswer
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-700 text-gray-400'
                  : selectedAnswer === option.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}>
                {option.key}
              </span>
              <span className="flex-1">{option.text}</span>
              {showResult && option.key === question.correct_answer && (
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Explanation (shown after answer) */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`p-4 rounded-xl mb-6 ${isCorrect ? 'bg-green-500/10 border border-green-500/30' : 'bg-amber-500/10 border border-amber-500/30'}`}
          >
            <p className="text-sm text-gray-300">
              <span className="font-semibold text-white">Explanation: </span>
              {question.explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      {!showResult && (
        <motion.button
          onClick={handleSubmit}
          disabled={!selectedAnswer}
          className={`w-full py-4 rounded-xl font-semibold transition-all ${
            selectedAnswer
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-500 hover:to-cyan-400'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
          whileHover={selectedAnswer ? { scale: 1.02 } : {}}
          whileTap={selectedAnswer ? { scale: 0.98 } : {}}
        >
          Submit Answer
        </motion.button>
      )}
    </div>
  );
}
