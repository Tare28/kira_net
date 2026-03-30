import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface VisitItem {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
  time?: string; // scheduled time e.g. "10:00 AM"
}

interface VisitPlanContextType {
  visits: VisitItem[];
  addVisit: (item: VisitItem) => void;
  removeVisit: (id: string) => void;
  isInPlan: (id: string) => boolean;
  clearAll: () => void;
  updateTime: (id: string, time: string) => void;
}

const VisitPlanContext = createContext<VisitPlanContextType | null>(null);

export function VisitPlanProvider({ children }: { children: ReactNode }) {
  const [visits, setVisits] = useState<VisitItem[]>([]);

  const addVisit = (item: VisitItem) => {
    setVisits(prev => {
      if (prev.find(v => v.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeVisit = (id: string) => {
    setVisits(prev => prev.filter(v => v.id !== id));
  };

  const isInPlan = (id: string) => visits.some(v => v.id === id);

  const clearAll = () => setVisits([]);

  const updateTime = (id: string, time: string) => {
    setVisits(prev => prev.map(v => v.id === id ? { ...v, time } : v));
  };

  return (
    <VisitPlanContext.Provider value={{ visits, addVisit, removeVisit, isInPlan, clearAll, updateTime }}>
      {children}
    </VisitPlanContext.Provider>
  );
}

export function useVisitPlan() {
  const ctx = useContext(VisitPlanContext);
  if (!ctx) throw new Error('useVisitPlan must be used within VisitPlanProvider');
  return ctx;
}
