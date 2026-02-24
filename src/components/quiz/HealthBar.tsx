'use client';

import { motion } from 'framer-motion';

interface HealthBarProps {
  health: number;
  maxHealth?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function HealthBar({ health, maxHealth = 100, showLabel = true, size = 'md' }: HealthBarProps) {
  const percentage = (health / maxHealth) * 100;
  
  const getHealthColor = () => {
    if (percentage >= 70) return 'from-green-500 to-green-400';
    if (percentage >= 40) return 'from-yellow-500 to-yellow-400';
    return 'from-red-500 to-red-400';
  };

  const getHealthStatus = () => {
    if (percentage >= 70) return 'Excellent';
    if (percentage >= 40) return 'Caution';
    return 'Critical';
  };

  const heights = { sm: 'h-3', md: 'h-5', lg: 'h-8' };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            Pilot Health
          </span>
          <span className={`text-sm font-bold ${percentage >= 70 ? 'text-green-400' : percentage >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
            {getHealthStatus()} - {Math.round(health)}HP
          </span>
        </div>
      )}
      
      <div className={`relative ${heights[size]} bg-gray-800/50 rounded-full overflow-hidden border border-gray-700/50 backdrop-blur-sm`}>
        <motion.div
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getHealthColor()} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-full" />
        
        {/* Pulse effect when low health */}
        {percentage < 30 && (
          <motion.div
            className="absolute inset-0 bg-red-500/30 rounded-full"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </div>
    </div>
  );
}
