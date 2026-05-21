import React, { createContext, useContext, useState } from 'react';

export interface OnboardingData {
  phone?: string;
  name?: { first: string; last: string };
  location?: string;
  photo?: string;
  interests?: string[];
  vibe?: string[];
  budget?: 'under20' | '20to40' | '40to75';
  calendarConnected?: string[];
  availability?: string[];
  notificationsEnabled?: boolean;
  friendsAdded?: string[];
}

interface OnboardingContextType {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  reset: () => void;
}

const defaultData: OnboardingData = {};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<OnboardingData>(defaultData);

  function updateData(updates: Partial<OnboardingData>) {
    setData(prev => ({ ...prev, ...updates }));
  }

  function reset() {
    setData(defaultData);
  }

  return (
    <OnboardingContext.Provider value={{ data, updateData, reset }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used inside OnboardingProvider');
  return ctx;
}
