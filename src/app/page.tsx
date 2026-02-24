'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">✈️</span>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              DGCA Prep
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
              Login
            </Link>
            <Link href="/login" className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg text-white font-medium hover:from-blue-500 hover:to-cyan-400 transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium mb-6">
              🎯 ATPL & DGCA Exam Preparation
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Master Your
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent"> Aviation </span>
              Exams
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10">
              Comprehensive question banks from IC Joshi & RK Bali with gamified learning, 
              progress tracking, and competitive leaderboards. Your flight to success starts here.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/login" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl text-white font-semibold text-lg hover:from-blue-500 hover:to-cyan-400 transition-all shadow-lg shadow-blue-500/25">
                Start Free Trial
              </Link>
              <Link href="/pricing" className="px-8 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white font-semibold text-lg hover:bg-gray-800 transition-all">
                View Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our platform combines comprehensive content with gamification to make exam prep engaging and effective.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '📚',
                title: 'Comprehensive Question Banks',
                description: 'Access thousands of questions from IC Joshi Meteorology and RK Bali Air Regulations with detailed explanations.',
              },
              {
                icon: '❤️',
                title: 'Health Bar System',
                description: 'Track your performance with our unique health bar. Right answers heal, wrong answers damage. Stay alive!',
              },
              {
                icon: '🏆',
                title: 'Weekly Leaderboards',
                description: 'Compete with fellow pilots. Climb the ranks, earn XP, and become the Top Pilot of the Week.',
              },
              {
                icon: '🌳',
                title: 'Skill Tree Progress',
                description: 'Visual knowledge map showing your mastery. Unlock chapters as you progress through the curriculum.',
              },
              {
                icon: '📊',
                title: 'Detailed Analytics',
                description: 'Track your accuracy, identify weak areas, and focus your preparation where it matters most.',
              },
              {
                icon: '🎮',
                title: 'Gamified Learning',
                description: 'Earn XP, unlock achievements, and stay motivated with our engaging gamification system.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800/50 hover:border-gray-700/50 transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects Preview */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Available Subjects</h2>
            <p className="text-gray-400">Start with these subjects, more coming soon!</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-8 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-2xl border border-blue-500/30"
            >
              <div className="text-5xl mb-4">🌤️</div>
              <h3 className="text-2xl font-bold mb-2">Aviation Meteorology</h3>
              <p className="text-gray-400 mb-4">IC Joshi - Complete question bank with all chapters</p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>📝 500+ Questions</span>
                <span>📖 15 Chapters</span>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-8 bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl border border-purple-500/30"
            >
              <div className="text-5xl mb-4">⚖️</div>
              <h3 className="text-2xl font-bold mb-2">Air Regulations</h3>
              <p className="text-gray-400 mb-4">RK Bali - DGCA style practice questions</p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>📝 1000+ Questions</span>
                <span>📖 20 Chapters</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-6 bg-gray-900/30">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Affordable Pricing</h2>
          <p className="text-gray-400 mb-12">Get full access to all features for just</p>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="inline-block p-8 bg-gradient-to-br from-yellow-900/20 to-amber-900/20 rounded-3xl border border-yellow-500/30"
          >
            <div className="text-6xl font-bold mb-2">
              <span className="text-yellow-400">₹100</span>
            </div>
            <p className="text-gray-400 mb-6">One-time payment, full access</p>
            <ul className="text-left space-y-3 mb-8">
              {['All question banks', 'Health bar system', 'Leaderboard access', 'Skill tree progress', 'Unlimited practice'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span> {item}
                </li>
              ))}
            </ul>
            <Link href="/pricing" className="block px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl text-black font-bold hover:from-yellow-400 hover:to-amber-400 transition-all">
              Get Premium Access
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">✈️</span>
            <span className="text-xl font-bold text-white">DGCA Prep</span>
          </div>
          <p>© 2026 DGCA Prep. Built for aspiring pilots.</p>
        </div>
      </footer>
    </div>
  );
}
