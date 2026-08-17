import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  PortfolioProperty,
  PortfolioSummary,
  calculatePortfolioSummary,
  defaultPortfolioProperties,
  PropertyType,
} from '@cqs/finance-logic';

export type PortfolioFilter = 'ALL' | 'PRIMARY' | 'RENTAL';

interface PortfolioContextType {
  properties: PortfolioProperty[];
  filter: PortfolioFilter;
  setFilter: (filter: PortfolioFilter) => void;
  filteredProperties: PortfolioProperty[];
  summary: PortfolioSummary;
  addProperty: (property: Omit<PortfolioProperty, 'id'>) => void;
  deleteProperty: (id: string) => void;
  resetToDefaults: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<PortfolioProperty[]>(defaultPortfolioProperties);
  const [filter, setFilter] = useState<PortfolioFilter>('ALL');

  const filteredProperties = useMemo(() => {
    if (filter === 'PRIMARY') {
      return properties.filter((p) => p.propertyType === 'PRIMARY');
    }
    if (filter === 'RENTAL') {
      return properties.filter((p) => p.propertyType === 'RENTAL');
    }
    return properties;
  }, [properties, filter]);

  const summary = useMemo(() => {
    return calculatePortfolioSummary(filteredProperties);
  }, [filteredProperties]);

  const addProperty = (newProp: Omit<PortfolioProperty, 'id'>) => {
    const id = `prop-${Date.now()}`;
    setProperties((prev) => [...prev, { ...newProp, id }]);
  };

  const deleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  const resetToDefaults = () => {
    setProperties(defaultPortfolioProperties);
  };

  return (
    <PortfolioContext.Provider
      value={{
        properties,
        filter,
        setFilter,
        filteredProperties,
        summary,
        addProperty,
        deleteProperty,
        resetToDefaults,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
