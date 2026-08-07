import React from 'react';
import { ShieldAlert, Loader2, TrendingUp, ArrowRight } from 'lucide-react';

export default function FeedbackStates({ loading, error, hasSearched, resultCount }) {
  if (loading) return <StateCard icon={<Loader2 size={32} color="#6366f1" style={{ animation: 'spin 1s linear infinite' }} />} text="Executing multi-hop Cypher traversal..." />;
  
  if (error) return (
    <div style={{ ...styles.card, borderColor: '#ef4444', backgroundColor: '#181014' }}>
      <ShieldAlert size={32} color="#ef4444" />
      <h3 style={{ color: '#f87171', margin: '0.5rem 0' }}>Connection Error</h3>
      <p style={styles.text}>{error}</p>
    </div>
  );

  if (!hasSearched) return <StateCard icon={<ArrowRight size={32} color="#6366f1" />} text="Enter a strategy above to query the CognoDB graph database." />;
  
  if (hasSearched && resultCount === 0) return <StateCard icon={<TrendingUp size={32} color="#64748b" />} text="No companies matching this traversal were found in the dataset." title="No Nodes Found" />;

  return null;
}

const StateCard = ({ icon, title, text }) => (
  <div style={styles.card}>
    {icon}
    {title && <h3 style={{ margin: '0.5rem 0', color: '#f8fafc' }}>{title}</h3>}
    <p style={styles.text}>{text}</p>
  </div>
);

const styles = {
  card: { backgroundColor: '#1e293b', border: '1px dashed #334155', borderRadius: '0.75rem', padding: '3rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' },
  text: { margin: 0, color: '#94a3b8', fontSize: '0.9rem' }
};