import React from 'react';
import Header from './components/Header';
import SearchSection from './components/SearchSection';
import FeedbackStates from './components/FeedbackStates';
import ResultsTable from './components/ResultsTable';
import { useGraphQuery } from './hooks/useGraphQuery';

export default function App() {
  const { results, loading, error, hasSearched, fetchStrategyData } = useGraphQuery();

  return (
    <div style={styles.container}>
      <Header />
      
      <main style={styles.main}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={styles.title}>Explore Connected Investment Assets</h1>
          <p style={{ color: '#94a3b8' }}>Leveraging graph traversals to connect investment strategies and sectors.</p>
        </div>

        <SearchSection onSearch={fetchStrategyData} loading={loading} />

        <section style={{ marginTop: '1.5rem' }}>
          <FeedbackStates 
            loading={loading} 
            error={error} 
            hasSearched={hasSearched} 
            resultCount={results.length} 
          />
          
          {!loading && !error && (
            <ResultsTable results={results} />
          )}
        </section>
      </main>
    </div>
  );
}

const styles = {
  container: { 
    minHeight: '100vh', 
    width: '100%',       // Ensures full width
    backgroundColor: '#0f172a', 
    color: '#f8fafc', 
    padding: '2rem 5%',  // Uses percentage padding for better responsiveness
    fontFamily: 'system-ui, sans-serif' 
  },
  main: { 
    maxWidth: '1200px',  // Widened from 900px to look better on full screen
    margin: '0 auto' 
  },
  title: { 
    fontSize: '2.5rem', 
    fontWeight: '800', 
    margin: '0 0 0.75rem 0', 
    background: 'linear-gradient(to right, #818cf8, #c084fc)', 
    WebkitBackgroundClip: 'text', 
    WebkitTextFillColor: 'transparent',
    lineHeight: '1.4',        // FIX: Prevents the top/bottom of letters from clipping
    paddingTop: '0.1em',      // FIX: Gives breathing room for the top of the text
    paddingBottom: '0.1em'    // FIX: Gives breathing room for descenders (like 'g' or 'p')
  }
};