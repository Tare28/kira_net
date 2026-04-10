import React, { createContext, useContext, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

export interface SavedItem {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
  badge?: 'verified' | 'hot_deal';
}

interface SavedContextType {
  saved: SavedItem[];
  saveProperty: (item: SavedItem) => void;
  unsaveProperty: (id: string) => void;
  isSaved: (id: string) => boolean;
  clearAll: () => void;
}

const SavedContext = createContext<SavedContextType | null>(null);

const STORAGE_KEY = '@kira_saved_properties';

export function SavedProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<SavedItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Rehydrate from AsyncStorage on mount
  useEffect(() => {
    const hydrate = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          setSaved(JSON.parse(raw));
        }
      } catch (e) {
        console.error('Failed to hydrate saved properties:', e);
      } finally {
        setIsHydrated(true);
      }
    };
    hydrate();
  }, []);

  // Persist to AsyncStorage whenever saved list changes, but ONLY after initial hydration
  useEffect(() => {
    if (isHydrated) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(saved)).catch(e => {
        console.error('Failed to save property:', e);
      });
    }
  }, [saved, isHydrated]);

  const saveProperty = (item: SavedItem) => {
    setSaved(prev => {
      if (prev.find(s => s.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const unsaveProperty = (id: string) => {
    setSaved(prev => prev.filter(s => s.id !== id));
  };

  const isSaved = (id: string) => saved.some(s => s.id === id);

  const clearAll = () => {
    setSaved([]);
  };

  return (
    <SavedContext.Provider value={{ saved, saveProperty, unsaveProperty, isSaved, clearAll }}>
      {children}
    </SavedContext.Provider>
  );
}

export function useSaved() {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error('useSaved must be used within a SavedProvider');
  return ctx;
}
