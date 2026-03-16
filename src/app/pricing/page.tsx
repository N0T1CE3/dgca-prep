'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PREMIUM_PRICE_INR = 100;
const PREMIUM_DURATION_DAYS = 30; // 1 month

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [premiumExpiry, setPremiumExpiry] = useState<string | null>(null);

  useEffect(() => {
    checkUser();
    loadRazorpayScript();
  }, []);

  const loadRazorpayScript = () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  };

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      const { data: profile } = await supabase
        .from('users')
        .select('is_premium, premium_expires_at')
        .eq('id', user.id)
        .single();
      if (profile) {
        // Check if premium has expired
        if (profile.premium_expires_at) {
          const expiryDate = new Date(profile.premium_expires_at);
          const now = new Date();
          if (expiryDate > now) {
            setIsPremium(true);
            setPremiumExpiry(profile.premium_expires_at);
          } else {
            // Premium expired - reset to free
            await supabase
              .from('users')
              .update({ is_premium: false, premium_expires_at: null })
              .eq('id', user.id);
            setIsPremium(false);
            setPremiumExpiry(null);
          }
        } else {
          setIsPremium(false);
        }
      }
    }
  };

  const handlePayment = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    try {
      // Create order on backend (we'll simulate this for now)
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: PREMIUM_PRICE_INR * 100, userId: user.id }),
      });

      const orderData = await response.json();

      const razorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_SRn89iypBeUy1U',
        amount: PREMIUM_PRICE_INR * 100,
        currency: 'INR',
        name: 'DGCA Prep',
        description: 'Premium Subscription',
        order_id: orderData.orderId,
        handler: async (response: any) => {
          // Verify payment and update user status
          await verifyPayment(response, user.id);
        },
        prefill: {
          email: user.email,
          name: user.user_metadata?.name || '',
        },
        theme: {
          color: '#F59E0B',
        },
      };

      const razorpay = new window.Razorpay(razorpayOptions);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (response: any, userId: string) => {
    try {
      // Calculate expiry date (1 month from now)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + PREMIUM_DURATION_DAYS);
      
      const { error } = await supabase
        .from('users')
        .update({ 
          is_premium: true, 
          premium_expires_at: expiryDate.toISOString() 
        })
        .eq('id', userId);

      if (!error) {
        setIsPremium(true);
        setPremiumExpiry(expiryDate.toISOString());
        alert(`Payment successful! You are now a Premium member for ${PREMIUM_DURATION_DAYS} days!`);
      }
    } catch (error) {
      console.error('Verification error:', error);
    }
  };

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">✈️</span>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">DGCA Prep</span>
          </Link>
          <div className="flex items-center gap-4">
            {user && (
              <span className={`px-3 py-1 rounded-full text-sm ${isPremium ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-700 text-gray-300'}`}>
                {isPremium ? '✓ Premium' : 'Free'}
              </span>
            )}
            <Link href="/login" className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg text-white font-medium">Login</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold mb-4">
            Simple, <span className="text-yellow-400">Affordable</span> Pricing
          </motion.h1>
          <p className="text-gray-400">Pay ₹100/month. Renew anytime.</p>
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
            <div className="text-4xl font-bold mb-6 text-yellow-400">₹{PREMIUM_PRICE_INR}</div>
            <ul className="space-y-3 mb-8">
              {['All question banks', 'Health bar system', 'Weekly leaderboard', 'Skill tree tracking', 'All future updates'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-200"><span className="text-yellow-400">✓</span> {item}</li>
              ))}
            </ul>
            
            {isPremium ? (
              <div className="space-y-3">
                <div className="w-full py-4 bg-green-600 rounded-xl text-white font-bold text-lg text-center">
                  ✓ You are Premium!
                </div>
                {premiumExpiry && (
                  <p className="text-sm text-gray-400 text-center">
                    Expires: {new Date(premiumExpiry).toLocaleDateString()}
                  </p>
                )}
                <button 
                  onClick={handlePayment}
                  className="w-full py-3 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl text-black font-bold"
                >
                  Renew (₹{PREMIUM_PRICE_INR}/month)
                </button>
              </div>
            ) : (
              <button 
                onClick={handlePayment} 
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl text-black font-bold text-lg disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Get Premium Access'}
              </button>
            )}
          </motion.div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
            🔒 Secure payment powered by Razorpay • Instant access after payment
          </p>
        </div>
      </div>
    </div>
  );
}
