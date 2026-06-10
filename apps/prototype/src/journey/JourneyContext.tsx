import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

/** Answers collected across the example "juggling licence" journey. */
export interface JourneyAnswers {
  fullName: string;
  whereYouLive: string;
  jugglingBalls: string;
  trickDescription: string;
}

const emptyAnswers: JourneyAnswers = {
  fullName: '',
  whereYouLive: '',
  jugglingBalls: '',
  trickDescription: '',
};

interface JourneyContextValue {
  answers: JourneyAnswers;
  setAnswer: <K extends keyof JourneyAnswers>(key: K, value: JourneyAnswers[K]) => void;
  reset: () => void;
}

const JourneyContext = createContext<JourneyContextValue | null>(null);

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<JourneyAnswers>(emptyAnswers);
  const value = useMemo<JourneyContextValue>(
    () => ({
      answers,
      setAnswer: (key, val) => setAnswers((prev) => ({ ...prev, [key]: val })),
      reset: () => setAnswers(emptyAnswers),
    }),
    [answers],
  );
  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>;
}

export function useJourney(): JourneyContextValue {
  const ctx = useContext(JourneyContext);
  if (!ctx) throw new Error('useJourney must be used within JourneyProvider');
  return ctx;
}
