import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FilterState {
  minPrice: number;
  maxPrice: number;
  deposit: string | null;
  neighborhood: string | null;
  essentialWater: boolean;
  essentialInternet: boolean;
  privateMeter: boolean;
  isVerified: boolean;
}

interface FilterContextType {
  filters: FilterState;
  updateFilters: (updates: Partial<FilterState>) => void;
  resetFilters: () => void;
}

const initialFilters: FilterState = {
  minPrice: 0,
  maxPrice: 150000,
  deposit: null,
  neighborhood: null,
  essentialWater: false,
  essentialInternet: false,
  privateMeter: false,
  isVerified: false,
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const updateFilters = (updates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <FilterContext.Provider value={{ filters, updateFilters, resetFilters }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}
