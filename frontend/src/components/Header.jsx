import React from 'react';
import { Database } from 'lucide-react';

export default function Header() {
  return (
    <header className="app-header" style={styles.header}>
      <div style={styles.logoGroup}>
        <Database size={24} color="#6366f1" />
        <span style={{ fontSize: '1.25rem', fontWeight: '700' }}>Intelligent Investor Graph</span>
      </div>
      <span style={styles.badge}>CognoDB + FastAPI + React</span>
    </header>
  );
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' },
  logoGroup: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  badge: { fontSize: '0.75rem', backgroundColor: '#1e293b', color: '#94a3b8', padding: '0.25rem 0.75rem', borderRadius: '9999px', border: '1px solid #334155' }
};