import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function ResultsTable({ results, searchedStrategy }) {
  if (!results || results.length === 0) return null;

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <CheckCircle2 size={18} color="#22c55e" />
        <span>Found {results.length} connected entities</span>
      </div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Ticker</th>
            <th style={styles.th}>Company Name</th>
            <th style={styles.th}>Sector Node</th>
          </tr>
        </thead>
        <tbody>
          {results.map((item, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #1e293b' }}>
              <td style={{ ...styles.td, fontWeight: '700', color: '#818cf8', fontFamily: 'monospace' }}>{item.ticker}</td>
              <td style={styles.td}>{item.name}</td>
              <td style={styles.td}><span style={styles.badge}>{item.sector}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  wrapper: { backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', overflow: 'hidden' },
  header: { padding: '1rem', backgroundColor: '#0f172a', borderBottom: '1px solid #334155', display: 'flex', gap: '0.5rem', fontSize: '0.875rem', color: '#cbd5e1' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '0.875rem 1.25rem', borderBottom: '1px solid #334155', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' },
  td: { padding: '1rem 1.25rem', color: '#f1f5f9' },
  badge: { backgroundColor: '#334155', color: '#e2e8f0', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }
};