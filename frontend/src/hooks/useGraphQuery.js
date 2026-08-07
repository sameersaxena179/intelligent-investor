import { useState } from 'react';

export function useGraphQuery() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchStrategyData = async (strategyName, maxPe = 15) => {
    if (!strategyName.trim()) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      // Append max_pe as a query parameter
      const url = `http://localhost:8000/strategies/${encodeURIComponent(strategyName)}/companies?max_pe=${maxPe}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 503) {
          throw new Error('Database is offline. Check your CognoDB instance.');
        }
        throw new Error(`Failed to fetch data (Status: ${response.status})`);
      }
      
      const data = await response.json();
      setResults(data.companies || []);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, hasSearched, fetchStrategyData };
}