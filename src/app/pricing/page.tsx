'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">✈️</span>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">DGCA Prep</span>
          </Link>
          <Link href="/login" className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg text-white font-medium">Login</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold mb-4">
            Simple, <span className="text-yellow-400">Affordable</span> Pricing
          </motion.h1>
          <p className="text-gray-400">One-time payment. Lifetime access.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-gray-900/80 rounded-2xl border border-gray-700/50 p-8">
            <h2 className="text-2xl font-bold mb-2">Free</h2>
            <div className="text-4xl font-bold mb-6">₹0</div>
            <ul className="space-y-3 mb-8">
              {['10 sample questions per subject', 'Basic progress tracking'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-300"><span className="text-green-400">✓</span> {item}</li>
              ))}
              {['Health bar system', 'Full question bank', 'Leaderboard'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-500"><span>✕</span> {item}</li>
              ))}
            </ul>
            <Link href="/login" className="block w-full py-3 text-center bg-gray-800 rounded-xl text-white font-semibold">Get Started Free</Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-gradient-to-br from-yellow-900/30 to-amber-900/30 rounded-2xl border-2 border-yellow-500/50 p-8 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-500 rounded-full text-black text-sm font-bold">RECOMMENDED</div>
            <h2 className="text-2xl font-bold mb-2 text-yellow-400">Premium</h2>
            <div className="text-4xl font-bold mb-6 text-yellow-400">₹100</div>
            <ul className="space-y-3 mb-8">
              {['All question banks', 'Health bar system', 'Weekly leaderboard', 'Skill tree tracking', 'All future updates'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-200"><span className="text-yellow-400">✓</span> {item}</li>
              ))}
            </ul>
            <button className="w-full py-4 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl text-black font-bold text-lg">Get Premium Access</button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
