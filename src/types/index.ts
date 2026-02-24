// Database Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  is_premium: boolean;
  premium_expires_at?: string;
  total_xp: number;
  created_at: string;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  sample_count: number;
  total_questions: number;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export interface Chapter {
  id: string;
  subject_id: string;
  name: string;
  display_order: number;
  prerequisites: string[];
}

export interface Question {
  id: string;
  subject_id: string;
  chapter_id?: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  is_sample: boolean;
  is_active: boolean;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  subject_id: string;
  chapter_id?: string;
  questions_attempted: number;
  correct_answers: number;
  health_points: number;
  xp_earned: number;
  accuracy_rate: number;
  last_attempted_at: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar_url?: string;
  total_xp: number;
  accuracy_rate: number;
  rank: number;
}

export interface QuizState {
  currentQuestion: number;
  answers: Record<number, string>;
  health: number;
  xp: number;
  isComplete: boolean;
  startTime: Date;
}

export interface SkillNode {
  id: string;
  name: string;
  mastery: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  position: { x: number; y: number };
  prerequisites: string[];
}
