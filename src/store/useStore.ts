import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Subject, QuizState } from '@/types';

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  subjects: Subject[];
  setSubjects: (subjects: Subject[]) => void;
  quizState: QuizState | null;
  initQuiz: () => void;
  answerQuestion: (questionIndex: number, answer: string, isCorrect: boolean) => void;
  completeQuiz: () => void;
  resetQuiz: () => void;
  health: number;
  maxHealth: number;
  updateHealth: (change: number) => void;
  resetHealth: () => void;
  totalXp: number;
  addXp: (amount: number) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      subjects: [],
      setSubjects: (subjects) => set({ subjects }),
      quizState: null,
      initQuiz: () => set({
        quizState: {
          currentQuestion: 0,
          answers: {},
          health: 100,
          xp: 0,
          isComplete: false,
          startTime: new Date(),
        }
      }),
      answerQuestion: (questionIndex, answer, isCorrect) => {
        const state = get();
        const healthChange = isCorrect ? 5 : -10;
        const xpGain = isCorrect ? 10 : 0;
        set({
          quizState: state.quizState ? {
            ...state.quizState,
            currentQuestion: state.quizState.currentQuestion + 1,
            answers: { ...state.quizState.answers, [questionIndex]: answer },
            health: Math.max(0, Math.min(100, state.quizState.health + healthChange)),
            xp: state.quizState.xp + xpGain,
          } : null,
        });
        if (state.user?.is_premium) {
          get().updateHealth(healthChange);
        }
      },
      completeQuiz: () => set((state) => ({
        quizState: state.quizState ? { ...state.quizState, isComplete: true } : null
      })),
      resetQuiz: () => set({ quizState: null }),
      health: 100,
      maxHealth: 100,
      updateHealth: (change) => set((state) => ({
        health: Math.max(0, Math.min(state.maxHealth, state.health + change))
      })),
      resetHealth: () => set({ health: 100 }),
      totalXp: 0,
      addXp: (amount) => set((state) => ({ totalXp: state.totalXp + amount })),
    }),
    {
      name: 'dgca-prep-storage',
      partialize: (state) => ({ health: state.health, totalXp: state.totalXp }),
    }
  )
);
